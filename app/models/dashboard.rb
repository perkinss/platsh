load 'report'
class Dashboard < Object

  def section ( course, section)
    content_stats = section_content_stats(section, course)
    competency_stats = section_competency_stats(section, course)
    return { id: section.id, name: section.name, content_stats: content_stats, competency_stats: competency_stats }
  end

  def stats (user)

    # only valid task_standards are those used in assessments for sections that we're checking out.
    courses = {}

    user.sections.each do |section|
      section.courses.each do |course|
        if courses[course.id]
          content_stats = section_content_stats(section, course)
          competency_stats = section_competency_stats(section, course)
          courses[course.id][:sections][section.id] = { :name => section.name, :content_stats => content_stats, :competency_stats => competency_stats }
        else
          content_stats = section_content_stats(section, course)
          competency_stats = section_competency_stats(section, course)
          if content_stats.length > 0
            courses[course.id] = {
                title: course.title,
                sections: { section.id => { :name => section.name, :content_stats => content_stats, :competency_stats => competency_stats } },
            }
          end
        end
      end
    end
    #Rails.logger.info "Courses: #{courses}\n\n"
    return courses

  end

  def section_content_stats (section, course)
    t_start = Time.now
    section_tasks = section.tasks.pluck(:id)
    section_students = section.students.pluck(:id)
    section_standards = TaskStandard.where(task_id: section_tasks).distinct.pluck(:standard_id)
    observations = StandardObservation.where(task_id: section_tasks, student_id: section_students).pluck(:standard_id)

    stats = []

    course.contents.each do |content|
      current_content = { name: content.name, id: content.id }
      standard_ids = content.standards.pluck(:id)
      current_content[:details] = section_content_details(section, standard_ids)

      used = standard_ids.filter { |standard_id| section_standards.include? standard_id }
      observed = standard_ids.filter { |standard_id| observations.include? standard_id }

      current_content[:percent_included] = calculate_remaining_percentage(used.size, standard_ids.size)
      current_content[:percent_observed] = calculate_remaining_percentage(observed.size, standard_ids.size)
      stats.push(current_content)
    end
    Rails.logger.info "\n***********Content stats took : #{Time.now - t_start}\n\n"
    # print "Stats #{stats}\n\n"
    return stats
  end

  def section_competency_stats (section, course)
    t_start = Time.now
    section_task_ids = section.tasks.pluck(:id)
    course_competencies = course.competencies
    groups = {}

    # competencies belong to courses, and belong to groups.
    # The groups are just a way of grouping competencies under a heading, and are used in many courses.
    course_competencies.each do |competency|
      groups[competency.competency_group_id] ||= { percent_included: 0, title: competency.competency_group.title, id: competency.competency_group_id }

      task_ids = competency.tasks.where(assessment: Assessment.where(user_id: section.user_id)).pluck(:id) & section_task_ids

      # percent_included is a placeholder that contains the tasks count
      if task_ids.size > 0
        groups[competency.competency_group_id][:percent_included] += 1
      end
      groups[competency.competency_group_id][:details] ||= []

      student_ids = section.students.pluck(:id)
      mode =  Report.competency_mode(CompetencyObservation.where(student_id: student_ids, task_id: task_ids, competency_id: competency.id).order(assessed_at: :desc).load)
      groups[competency.competency_group_id][:details].push( {
              id: competency.id,
              description: competency.description,
              count: task_ids.size,
              mode: mode
          })
    end

    observed_competency_ids = groups.values.map{ |group| group[:details] }.flatten.filter { |details| !details[:mode].nil? && details[:mode] > 0 }.map{ |details| details[:id] }

    groups.values.each do |group|
      observed_for_group = group[:details].filter { |detail| observed_competency_ids.include? detail[:id] }
      group[:percent_included] = calculate_remaining_percentage(group[:percent_included], group[:details].size)
      group[:percent_observed] = calculate_remaining_percentage(observed_for_group.size, group[:details].size)

    end
    Rails.logger.info "\n********* competency stats took: #{Time.now - t_start}\n\n"
    groups
  end


  def calculate_remaining_percentage (part_size, whole_size)
    return sprintf('%.0f', 100 - (whole_size - part_size).fdiv(whole_size) * 100)
  end

  def section_content_details (section, standard_ids)
    t_start = Time.now
    # evaluation will be first class object
    section_tasks = section.tasks.pluck(:id)
    standards = Standard.find(standard_ids)

    stats = standards.collect { |standard|
      task_standards = TaskStandard.where(task_id: section_tasks, standard_id: standard.id)
      {
          description: standard.description,
          id: standard.id,
          h_count: task_standards.filter { |ts| ts.level == 'H' }.size,
          m_count: task_standards.filter { |ts| ts.level == 'M' }.size,
          l_count: task_standards.filter { |ts| ts.level == 'L' }.size,
          average: standard_section_average(section, standard, task_standards)
      }
    }
    Rails.logger.info "\n\n*********** Content details took : #{Time.now - t_start}\n\n"
    return stats
  end

  def standard_section_average(section, standard, task_standards)
    student_ids = section.students.pluck(:id)

    marks = student_ids.collect { |student_id|
      student_content_stats(student_id, standard, task_standards)
    }.compact
    Report.standard_average(marks)
  end

  def student_content_stats (student_id, standard, task_standards)
    task_ids = task_standards.collect { |task_standard| task_standard.task_id }
    student_observations = StandardObservation.where(student_id: student_id, task_id: task_ids)
    observed_task_ids = student_observations.filter{ |observation| observation.standard_id == standard.id }.map { |o| o.task_id }
    # TODO: Check this for decreased performance:
    # observed_task_ids = StandardObservation.where(student_id: student_id, standard_id: standard.id, task_id: task_ids).pluck(:task_id)

    observed_students_standards = task_standards.filter { |task_standard|
      observed_task_ids.include?(task_standard.task_id)
    }
    # count high first, then med, then low
    report = Report.new

    return report.get_mark_from_observations observed_students_standards, standard
  end

end
