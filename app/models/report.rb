require 'matrix'

class Report < Object

  ##
  # Collect the individual student standard marks organized by content and course.
  #
  def student_standard_report(student, section, from = nil, to = nil, topics = [])
    section.courses.collect do |course|
      course_topic_ids = course.contents.pluck(:id)
      ids = topics.any? ? topics & course_topic_ids : course_topic_ids
      course_marks = Content.find(ids).collect do |content|
        standard_marks = student_standard_marks(content, student, from, to)
        { id: content.id, name: content.name, marks: standard_marks }
      end.compact
      {id: course.id, title: course.title, course_marks: course_marks }
    end
  end

  ##
  # Collect the observations by date, grouped by day or week, ordered by competency group, with modes
  # averaged by the time range, arranged in the specific way needed by the heat map chart
  #
  def student_heat_map(student, section, from = nil, to = nil)
    t_start = Time.now
    section.courses.collect do |course|
      competency_ids = course.competencies.map(&:id)

      observations = date_range_query(CompetencyObservation.where(competency_id: competency_ids, student_id: student.id), from, to).order(:assessed_at).group_by do |o|
        o.assessed_at.utc.at_beginning_of_day
      end
      # If we have way too many days to fit on the heat map, then group by week instead of day.
      if observations.size > 45
        observations = date_range_query(CompetencyObservation.where(competency_id: competency_ids, student_id: student.id), from, to).order(:assessed_at).group_by do |o|
          o.assessed_at.utc.at_beginning_of_week
        end
      end

      competencies = []
      observations_by_dates = observations.keys.collect do |date|
        obs_by_competency = observations[date].group_by do |o|
          competencies.push(o.competency)
          o.competency_id
        end

        counts = {}
        mode_averages = {}
        obs_by_competency.each do |obs|
          mode_average = Report.competency_mode(obs[1])
          counts[obs[0]] = obs[1].size
          mode_averages[obs[0]] = mode_average
        end.flatten

         { date: date.strftime('%b %e'), values: mode_averages, count: counts }
      end

      dates = observations_by_dates.map { |d| d[:date]}

      heat_data = []
      competencies.uniq.sort_by(&:competency_group).reverse!.each do |competency|
        data = []
        dates.each_with_index do |date|
          datum = observations_by_dates.find { |d| d[:date] == date}
          average = datum[:values] ? datum[:values][competency.id] : nil
          count = datum[:count] ? datum[:count][competency.id] : 0
          data.push({ x: date, y: average, count: count })
        end

        heat_data.push({id: competency.id, name: competency.description, phrasing: competency.phrasing, group: competency.competency_group.id, data: data})
      end
      Rails.logger.info "\n\n\n^^^^^^^^^^ HEAT MAP took #{Time.now - t_start}  ^^^^^^^^^^^^^^\n\n\n"
      { id: course.id, title: course.title, dates: dates, data: heat_data}
    end
  end

  # Find the tasks that belong to assessments on which at least one observation has been made for any student
  def observed_assessments(section, student, from = nil, to = nil)
    t_start = Time.now
    student_id = student.id

    # find all the assessments that had at least one observation made (on any of the tasks) for the student:
    assessments = section.assessments.find_all { |assessment|
      assessment.tasks.any? { |task|
          date_range_query(StandardObservation.where(task: task, student_id: student_id), from, to).exists? ||
              date_range_query(CompetencyObservation.where(task: task, student_id: student_id), from, to).exists?
      }
    }

    Rails.logger.info "\n\n\nAbout to collect assessments report for student took #{Time.now - t_start}\n\n\n"
    assessments.collect do |assessment|
      {id: assessment.id, name: assessment.name, tasks: assessment.tasks.map { |task|
        {id: task.id, name: task.name,
         standards: task.standards.map{ |standard| {id: standard.id, descriptions: standard.description} },
         competencies: task.competencies.map{ |competency| {id: competency.id, descriptions: competency.description} }}
      }}
      end
  end

  #**
  # Get the json object for one student's competency overview report, averaging all competencies within
  # a group and getting the corresponding percentage for that value.  Includes the course average for
  # all competency groups, weighted if weights were set, otherwise with all groups being equal weight.
  # Retrieves the data for all time; if they've done the course before those marks will be included.
  def student_competency_report(section, student, from = nil, to = nil)
    teacher = section.user
    t_start = Time.now
    result = section.courses.collect do |course|
      course_competencies = course.competencies.uniq.sort_by(&:competency_group).reverse!
      competency_modes = {}
      category_marks = course.competency_groups.uniq.sort!.collect do |group|
          grouped_competencies = course_competencies.filter{ |competency| competency.competency_group_id == group.id }
          # Find all the competency observations for the given section (section.tasks).
          # If there's no observation it wasn't marked.
          # Also return the most recent modes for the heat map chart.
          competencies_data = student_competencies(student, grouped_competencies, from, to)
          mark =  competencies_data[0]
          weight = retreive_competency_weight(group, teacher, course)
          competency_modes.merge!(competencies_data[1])

          { id: group.id, title: group.title, competency_mark: mark, percentage: mark.nil? ? 0 : convert_mode_score_to_percentage(mark), weight: weight }
      end
      average = category_marks.size.positive? ? weighted_competency_averages(category_marks) : nil
      { id: course.id, title: course.title, course_competencies: category_marks, course_average: average, competency_modes: competency_modes }
    end
    Rails.logger.info "\n\n\n ++++++ COMPETENCY report for student took #{Time.now - t_start} +++++++\n\n\n"
    { student_id: student.id, name: student.name, competency_report: result }
  end

  def content_report_for_student(section, student, from = nil, to = nil, topic_ids = [])
    t_start = Time.now
    teacher = section.user
    result = section.courses.collect do |course|
      content_weights = []
      course_topic_ids = course.contents.pluck(:id)
      ids = topic_ids.any? ? topic_ids & course_topic_ids : course_topic_ids
      course_marks = Content.find(ids).collect do |content|
        weight = retrieve_content_weight(content, teacher)
        content_weights.push(weight)
        content_mark = student_marks(content, student, from, to)
        { id: content.id, name: content.name, mark: content_mark, weight: weight }
      end.compact
      average = course_marks.empty? ? 0 : weighted_average(course_marks.map { |m| m[:mark] }, content_weights)
      course_contents_weight = CourseWeighting.where(user: teacher, course: course)[0]
      topic_weight = course_contents_weight ? course_contents_weight.contents_weight : 50
      {id: course.id, title: course.title, course_marks: course_marks, average: average, course_contents_weight: topic_weight}
    end
    Rails.logger.info "\n\n\n========= CONTENT report for student took #{Time.now - t_start}\n\n\n"
    {student_id: student.id, name: student.name, content_report: result }
  end

  # Retrieves the report for a section.  It will turn nothing for a topic where all student marks are nil
  # It does not count missed standards, only met standards. If no standards are met for a student their mark will be
  # nil.  (there is no such thing as zero for standards, it's either met or not met),
  def section_content_report(section, user,  from = nil, to = nil, topics = [])
    t_start = Time.now
    enrolled_students = section.students
    result = []

    section.courses.each do |course|
      t_start = Time.now
      marks = course_marks(course, enrolled_students, section, user, from, to, topics)
      Rails.logger.info "\n\n\nCourse marks took #{Time.now - t_start}\n\n\n"
      averages = weighted_averages(marks)
      result.push(
        id: course.id, title: course.title, course_marks: marks, averages: averages
      )
    end
    Rails.logger.info "\n\n\n***** ***** ***** Section CONTENT report took #{Time.now - t_start} ***** ***** *****\n\n\n"
    {section_content_overview: result }
  end

  def section_competency_report(section, user, from = nil, to = nil)
    t_start = Time.now
    section_task_ids = section.tasks.map(&:id)
    enrolled_students = section.students
    result = []
    section.courses.each do |course|
      com = course.competencies
      group_marks = course.competency_groups.uniq.collect do |group|
        group_of_competencies = com.filter{ |competency| competency.competency_group_id == group.id }
        # for each student find all the competency observations for the given section (section.tasks).  If there's no observation it wasn't marked.  They would at least get a zero.
        competencies = student_competencies_for_tasks(enrolled_students, group_of_competencies, section_task_ids, course, user, from, to)

        weight = retreive_competency_weight(group, user, course)
        { id: group.id, title: group.title, competency_mark: competencies, weight: weight}
      end
      averages = weighted_competency_averages(group_marks)
      result.push(
          {id: course.id, title: course.title, course_competencies: group_marks, averages: averages}
      )
    end
    Rails.logger.info "\n\n\nCOMPETENCY report for section took #{Time.now - t_start}\n\n\n"
    {section_competency_overview: result }
  end

  def weighted_competency_averages(course_marks)
    return nil if course_marks.empty?
    return course_marks[0][:competency_mark] if course_marks.size == 1

    weights = course_marks.map { |marks| marks[:weight] || 1 }
    if course_marks[0][:competency_mark].kind_of?(Array)
      columns = Matrix.columns(course_marks.map { |m| m[:competency_mark].map { |m| m[:mark] } })
      (0...columns.row_count).collect do |i|
        c = columns.row(i).to_a
        c.compact.empty? ? nil : convert_mode_score_to_percentage(weighted_average(c, weights))
      end
    else
      # the case where we are averaging the average competency group scores:
      weighted_average(course_marks.map { |m| m[:percentage] }, weights)
    end
  end

  def weighted_averages(course_marks)
    return [course_marks[0][:mark]] if course_marks.size == 1

    weights = course_marks.map { |marks| marks[:weight] }
    columns = Matrix.columns(course_marks.map { |m| m[:content_marks].map { |m| m[:mark] } })
    (0...columns.row_count).collect do |i|
      c = columns.row(i).to_a
      c.compact.empty? ? nil : weighted_average(c, weights)
    end
  end

  def weighted_average(marks, weights)
    return if marks.empty? || weights.empty? || marks.compact.empty?
    numerator = marks.zip(weights).filter { |x, y| !x.nil? }.map { |x, y| x * y }.reduce(:+)
    denominator = marks.zip(weights).filter { |x, y| !x.nil? }.map { |x, y| y }.reduce(:+)
    numerator.to_f / denominator
  end

  def get_mark_from_observations(observations, standard)
    return nil if observations.nil?

    standard_observations = observations.filter { |o| o[:standard_id] == standard.id }

    holistic_score = standard_observations.filter { |o| o[:level].nil? }.map { |o| o[:score] }.max
    holistic_standard_marks = { 0 => 33, 1 => 50, 2 => 60, 3 => 70, 4 => 80, 5 => 90, 6 => 100 }
    holistic_mark = holistic_standard_marks[holistic_score]

    high_count = count_level(standard_observations, standard, 'H')
    if high_count != 0
      analytic_mark = high_count > 1 ? 100 : 90
      return holistic_mark ? [analytic_mark, holistic_mark].max : analytic_mark
    end

    med_count = count_level(standard_observations, standard,'M')
    if med_count != 0
      analytic_mark = med_count > 1 ? 80 : 70
      return holistic_mark ? [analytic_mark, holistic_mark].max : analytic_mark
    end

    low_count = count_level(standard_observations, standard, 'L')
    if low_count != 0
      analytic_mark = low_count > 1 ? 60 : 50
      return holistic_mark ? [analytic_mark, holistic_mark].max : analytic_mark
    end

    # If we get to this point we find there were no analytic observations for the standard, therefore it either has a
    # holistic score or is not marked
    return holistic_mark
  end

  private

  #**
  # Get the modes for one student's competencies within a competency group,
  # get the average for the group, and then return as a percentage
  #
  def student_competencies(student, competency_group, from = nil, to = nil)
    competency_modes = {}
    competency_group.each do |competency|
      observations = CompetencyObservation.where(student: student, competency: competency)
      observations = date_range_query(observations, from, to).order(assessed_at: :desc).load
      if observations.exists?
        competency_modes[competency.id] = Report.competency_mode(observations)
      end
    end.compact
    [competency_modes.empty? ? nil : Report.average(competency_modes.values), competency_modes ]
  end

  def date_range_query(observations, from, to)
    if from
      observations = observations.where('assessed_at >= ?', from)
    end
    if to
      observations = observations.where('assessed_at < ?', to)
    end
    observations
  end

  #***
  # Get the modes of the competencies within a competency category, for a group of students,
  # And only include data for the given section taskids.
  #
  def student_competencies_for_tasks(students, competency_group, section_task_ids, course, user, from = nil, to = nil)
    students.collect do |student|
      competency_modes = competency_group.collect do |competency|
        observations = date_range_query(
            CompetencyObservation.where(student: student, competency: competency, task_id: section_task_ids),
            from,
            to
        ).order(assessed_at: :desc).load # competency_mode depends on the observations being in descending order by assessed_date
        Report.competency_mode(observations)
      end.compact
      {name: student.name, id: student.id, mark: Report.average(competency_modes), weight: retreive_competency_weight(competency_group, user, course) }
    end
  end

  def count_level(observations, standard, level)
    # TODO in the future, there may be records with a score of 0 (observed but not met), so we may sum the score instead
    observations.filter { |o| o[:standard_id] == standard.id && o[:level] == level }.size
  end

  def course_marks(course, enrolled_students, section, user,  from = nil, to = nil, topics = [])
    course_topic_ids = course.contents.pluck(:id)
    ids = topics.any? ? topics & course_topic_ids : course_topic_ids

    Content.find(ids).collect do |content|
      content_weight = retrieve_content_weight(content, user)
      content_marks = section_student_mark_objects(content, enrolled_students, section, from, to)
      if content_marks.filter { |mark| mark[:mark] != nil }.size > 0
        { id: content.id, name: content.name, content_marks: content_marks, weight: content_weight }
      end
    end.compact
  end

  def retrieve_content_weight(content, user)
    content_weight = ContentWeighting.where(user: user, content: content)[0]
    content_weight ||= DefaultContentWeighting.where(content: content)[0]
    content_weight ? content_weight.weight : 1
  end

  def retreive_competency_weight(competency_group, user, course)
    content_weight = CompetencyGroupWeighting.where(user: user, competency_group: competency_group, course: course)[0]
    content_weight ? content_weight.weight : 1
  end

  #**
  # Gets the collection of averaged student mark for each content, rolled up in a nice object with the
  # student name and id.  If there were no observations for a student on a standard, the mark will be nil.
  def section_student_mark_objects(content, enrolled_students, section, from, to)
    task_ids = section.tasks.map(&:id)
    enrolled_students.collect do |student|
      observations = StandardObservation.where(student_id: student.id, task_id: task_ids)
      observations = date_range_query(observations, from, to).limit(500000)

      standard_marks = content.standards.collect { |standard|
         get_mark_from_observations(observations, standard)
      }.compact
      { name: student.name, id: student.id, mark: Report.average(standard_marks) }
    end
  end

  def student_marks( content, student, from, to)
    standard_ids = content.standards.map(&:id)
    observations = StandardObservation.where(student_id: student.id, standard_id: standard_ids)
    observations = date_range_query(observations, from, to).limit(500000)
    content_marks = content.standards.collect { | standard|
      get_mark_from_observations(observations, standard)
    }.flatten.compact
    Report.average(content_marks)
  end

  def student_standard_marks(content, student, from, to)
    standard_ids = content.standards.map(&:id)
    observations = date_range_query(StandardObservation.where(student_id: student.id, standard_id: standard_ids), from, to).limit(500000)
    content.standards.collect { | standard|
      mark = get_mark_from_observations(observations, standard)
      { id: standard.id, description: standard.description, mark: mark }
    }
  end

  ##
  # Calculate the mode for an array of competency observations.
  # At this point, the observations should be on one competency only
  ##
  def self.competency_mode(observations)
    return nil if observations.empty?
    size = observations.size
    mode = 0
    if size <= 5
      mode = Report.calculate_mode(observations, size)

    elsif size <= 11
      # get the latest 50%
      o = observations.sort_by { |observation| observation.assessed_at }.reverse!
      latest_50_percent = o.slice(0, observations.size >> 1)
      # there will only be 5 observations if we take 50% of 11, so we can treat this the same
      mode = Report.calculate_mode(latest_50_percent, latest_50_percent.size)
    else
      # get the latest 25%
      o = observations.sort_by { |observation| observation.assessed_at }.reverse!
      o = o.slice(0, size >> 2)

      marks = {}
      o.each do |observation|
        marks[observation.level] ? marks[observation.level] = marks[observation.level] + 1 : marks[observation.level] = 1
      end
      if marks.size == 1
        mode = marks.keys[0]
      elsif marks.size >= 2
        # could be 2, 3, 4, or 5 in length.
        # # worst case would be something like:
        # {0 => 5, 1 => 5, 2 => 5, 3 => 5, 4 => 5 }

        sorted = marks.sort_by{ |key, value| value }
        if sorted[-1][1] > sorted[-2][1]
          mode = sorted[-1][0]
        elsif marks.size == 2 || sorted[-2][1] > sorted[-3][1]
          mode = Report.average([sorted[-1][0], sorted[-2][0]])
        elsif marks.size == 3 || sorted[-3][1] > sorted[-4][1]
          mode = Report.average([sorted[-1][0], sorted[-2][0], sorted[-3][0]])
        elsif marks.size == 4 || sorted[-4][1] > sorted[-5][1]
          mode = Report.average([sorted[-1][0], sorted[-2][0], sorted[-3][0], sorted[-4][0]])
        else
          mode = Report.average(marks.values)
        end
      end
    end
    mode
  end

  def self.calculate_mode(observations, size)
    marks = {}

    observations.each do |observation|
      marks[observation.level] ? marks[observation.level] = marks[observation.level] + 1 : marks[observation.level] = 1
    end
    if marks.size == 1
      mode = marks.keys[0]
    elsif marks.size == size
      # return the average of all
      mode = Report.average(marks.keys)
    elsif marks.size >= 2
      # There can be only one case where 2 have equal frequency, that didn't fall into the "Everything happened once" case above

      sorted = marks.sort_by {|key, value| value}
      if sorted[-1][1] > sorted[-2][1]
        mode = sorted[-1][0]
      else
        mode = Report.average([sorted[-1][0], sorted[-2][0]])
      end
    end
    mode
  end

  def convert_mode_score_to_percentage mode
    return nil if mode.nil?

    if mode > 3.75
      100
    elsif mode > 3.5
      96
    elsif mode > 3.25
      92
    elsif mode > 3
      87
    elsif mode > 2.75
      83
    elsif mode > 2.5
      79
    elsif mode > 2.25
      75
    elsif mode > 2
      71
    elsif mode > 1.75
      67
    elsif mode > 1.5
      62
    elsif mode > 1.25
      58
    elsif mode > 1
      54
    elsif mode > 0.75
      50
    elsif mode > 0.5
      46
    elsif mode > 0.25
      41
    else
      37
    end
  end

  # Standards want zero for an empty array because we only average on tasks that the student participated in
  # Thats how we can get a zero when a task standard mark is not present.  It's either met or its not.
  # That's our philosophy.  That, and hakuna matata.  Kidding.
  def self.standard_average (int_array)
    return 0 if int_array.nil? || int_array.length == 0

    Report.average(int_array)
  end

  def self.average(int_array)
    return nil if int_array.nil? || int_array.empty?

    sum = int_array.inject(0, :+)
    return sum.fdiv(int_array.size)
  end

end
