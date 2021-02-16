class Assessment < ApplicationRecord
  HOLISTIC_SCORING_TYPE = 'Holistic'

  has_one_attached :package
  belongs_to :user
  belongs_to :assessment_type
  belongs_to :assessment_scoring_type
  belongs_to :competency, optional: true
  has_many :tasks
  has_and_belongs_to_many :sections, :join_table => :sections_assessments
  has_and_belongs_to_many :courses, :join_table => :assessment_courses
  validates :name, presence: true

  # TODO: Archiving.  Also break this down into shorter methods!!!!!!   !!!! !
  def update_with_tasks_and_standards(name, type_name, tasks, competency_id = nil, section_params = nil)

    if name
      update(name: name)
    end
    if type_name
      type = AssessmentType.find_by_name(type_name)
      update(assessment_type: type)
    end

    update(competency_id: competency_id)

    if section_params
      sections = Section.find(section_params)
      update(sections: sections)
    end

    if tasks
      new_task_ids = tasks.map { |nt| nt[:id] }.compact
      tasks_delete = self.tasks.filter { |et| new_task_ids.exclude?(et.id) && deletable_task?(et.id)  }
      task_standards_delete = tasks_delete.collect { |t| t.task_standards }

      tasks_save = []
      task_standards_save = []
      task_competencies_save = []

      tasks.each do |task_update|
        if task_update[:id]
          existing_task = Task.find(task_update[:id])
          tasks_save.push(existing_task) if existing_task.update(name: task_update[:name])

          if task_update[:standards]
            existing_task.task_standards.each do |ts|
              if !task_update[:standards].keys.include?(ts[:standard_id].to_s) && deletable_t_standard?(existing_task.id, ts[:standard_id])
                task_standards_delete.push(ts)
              end
            end
            task_standards_delete.flatten
          end

          keep_c = []
          unless competency_id.nil? || competency_id.to_s.empty?
            comp = Competency.find(competency_id)
            keep_c.push(comp) if comp
          end

          task_update[:competencies].each do |c|
              if c != competency_id
                comp = Competency.find(c)
                keep_c.push(comp) if comp
              end
          end if task_update[:competencies]

          existing_task.competencies.each do |c|
            # print "\nDeletable? #{c.id} #{deletable_t_competency?(existing_task.id, c.id)}\n"
            if task_update[:competencies].exclude?(c.id) && !deletable_t_competency?(existing_task.id, c.id)
              keep_c.push(c)
            end
          end
          # print "\nAfter, will keep: #{keep_c.map(&:id).uniq}\n\n\n\n\n"
          existing_task.competencies = keep_c.uniq

          if task_update[:standards]
            task_update[:standards].keys.each do |s|
              task_standard = existing_task.task_standards.find{ |ts| ts[:standard_id] == s.to_i }
              # print "\n\n\nBEFORE #{task_standards_save}\n\n"
              if task_standard
                task_standards_save.push(task_standard) if task_standard.update(level: task_update[:standards][s])
                # print "\n\n\nAFTER #{task_standards_save}\n\n"
              else
                task_standard = TaskStandard.new(standard_id: s.to_i, level: task_update[:standards][s], task: existing_task)
                task_standards_save.push(task_standard) if task_standard.valid?
                # print "\n\n\nAFTER #{task_standards_save}\n\n"
              end
            end
          end

        else
          new_task = Task.new(name: task_update[:name], assessment: self)
          if task_update[:standards]
            task_update[:standards].keys.each do |s|
              task_standard = TaskStandard.new(standard_id: s, level: task_update[:standards][s], task: new_task)
              task_standards_save.push(task_standard) if task_standard.valid?
            end
          end
          if task_update[:competencies]
            task_update[:competencies].each do |c|
              task_competency = TaskCompetency.new(competency: Competency.find(c), task: new_task )
              task_competencies_save.push(task_competency) if task_competency.valid?
            end
          end
          if competency_id.present?
            task_competency = TaskCompetency.new(competency: Competency.find(competency_id), task: new_task )
            task_competencies_save.push(task_competency) if task_competency.valid?
          end
          tasks_save.push(new_task) if new_task.valid?
        end
      end
      save_or_destroy(task_competencies_save, task_standards_delete, task_standards_save, tasks_delete, tasks_save)
    end

    updated_assessment = self
    if self.nil?
      updated_assessment = Assessment.find(self.id)
    end
    map_assessment_data()
  end

  def destroy_associations

    t_destroy = []
      self.tasks.each do |task|
      if deletable_task?(task.id)
        t_destroy.push(task)
      end
    end
    result = t_destroy.size == tasks.size
    if t_destroy.size == tasks.size
      ActiveRecord::Base.transaction do
        t_destroy.each do |task|
          task.task_standards.each do |ts|
            ts.destroy
          end
          task.competencies = []
          task.destroy
        end
        self.sections = []
        self.courses = []
        self.destroy
      end
    end
    result
  end

  def deletable_task?(task_id)
    deletable = true
    if StandardObservation.exists?(task_id: task_id) ||
        CompetencyObservation.exists?(task_id: task_id) ||
        Comment.exists?(task_id: task_id)
      deletable = false
    end
    return deletable
  end

  def holistic?()
    return assessment_scoring_type.name == HOLISTIC_SCORING_TYPE
  end

  ##
  # map_return_value maps the assessment and associated tasks to the object expected by the front end.  Tasks
  # are ordered by date created.
  # #
  def map_assessment_data()

    task_ids = tasks.map(&:id)

    observed_tasks_ids = (StandardObservation.distinct(task_id: task_ids).pluck(:task_id) +
        CompetencyObservation.distinct(task_id: task_ids).pluck(:task_id) +
        Comment.distinct(task_id: task_ids).pluck(:task_id)).uniq()

    {name: name,
     id: id,
     competency: competency_id,
     type: {
         id: assessment_type.id,
         name: assessment_type.name,
         description: assessment_type.description
     },
     scoring_type: {
         id: assessment_scoring_type.id,
         name: assessment_scoring_type.name
     },
     sections: sections.map { |s| {id: s.id, name: s.name, courses: s.courses} },
     courses: courses,
     updated_at: updated_at,
     shared: shared,
     tasks: tasks.includes(
         :task_standards,
         :task_competencies,
         :standards,
         :competencies,
         :comments
     ).order!(:created_at).collect do |t|
       standards = {}
       t.task_standards.each do |ts|
         standards[ts.standard_id] = ts.level
       end
       {
           deletable: observed_tasks_ids.exclude?(t.id),
           id: t.id,
           name: t.name,
           standards: standards,
           competencies: t.competencies.map { |c| c.id }.filter { |id| id != competency_id }
       }
     end
    }
  end

  private

  def save_or_destroy(task_competencies_save, task_standards_delete, task_standards_save, tasks_delete, tasks_save)
    ActiveRecord::Base.transaction do
      save
      tasks_save.each do |t|
        t.save
      end
      task_standards_save.each do |ts|
        ts.save
      end

      task_standards_delete.each do |tsd|
        tsd.destroy
      end
      tasks_delete.each do |td|
        td.destroy
      end

      task_competencies_save.each do |tcs|
        tcs.save
      end
    end
  end

  def deletable_t_standard?(task_id, standard_id)
    Rails.logger.info "\n\n Deciding if taskstandard can be deleted \n\n"
    deletable = true
    if StandardObservation.exists?(task_id: task_id, standard_id: standard_id)
      deletable = false
    end
    deletable
  end

  def deletable_t_competency?(task_id, competency_id)
    Rails.logger.info "\n\nDeciding if task competency can be deleted\n\n"
    deletable = true
    if CompetencyObservation.where(task_id: task_id, competency_id: competency_id).exists?
      deletable = false
    end
    deletable
  end
end
