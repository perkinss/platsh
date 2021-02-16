class StandardObservation < ApplicationRecord
  belongs_to :task
  belongs_to :user
  belongs_to :standard
  belongs_to :student
  validates :student, uniqueness: { scope: [:task, :standard ], message: "An observation on a student can only be made once per task per standard" }

  def self.update_standard_marks (current_user, assessment, student, standard_marks, assessed_at)

    assessment_task_ids = assessment.tasks.map(&:id)
    existing_marks = student.standard_observations.where(task_id: assessment_task_ids )
    task_standards = TaskStandard.where(task_id: assessment_task_ids)

    destroy_obs = []
    save_obs = []

    assessment.tasks.each do |task|
      current_task_standards = task_standards.where(task_id: task.id)
      # find any in the existing for this task that aren't in this update and delete them.
      existing_marks.where(task_id: task.id).each do |existing_mark|

        if !standard_marks || !standard_marks[task.id.to_s] || standard_marks[task.id.to_s].keys.exclude?(existing_mark.standard_id)
          destroy_obs.push(existing_mark)
        end
      end

      # create new ones from the list if they don't exist already.
      # NOTE: won't be able to update a task standard and change the observation for a student unless the
      # original observation is deleted.  Because this doesn't change existing observations.
      if standard_marks && standard_marks[task.id.to_s]
        standard_marks[task.id.to_s].each do |standard_id, score|
          level = current_task_standards.where(standard_id: standard_id, task_id: task.id)[0].level unless assessment.holistic?
          existing_mark = existing_marks.find { |observation| observation.task_id == task.id && observation.standard_id == standard_id }
          if !existing_mark
            save_obs.push(StandardObservation.new(
                student: student,
                task: task,
                user: current_user,
                standard: Standard.find(standard_id),
                assessed_at: assessed_at,
                level: level,
                score: score
            ))
          elsif existing_mark.score != score
            existing_mark.score = score
            existing_mark.level = level
            existing_mark.assessed_at = assessed_at
            existing_mark.user = current_user
            save_obs.push(existing_mark)
          end
        end
      end
    end

    StandardObservation.transaction do
      destroy_obs.each { |observation| observation.destroy }
      save_obs.each { |observation| observation.save }
    end
    student.standard_observations.where(task_id: assessment_task_ids )
  end

end
