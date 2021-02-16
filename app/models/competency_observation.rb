class CompetencyObservation < ApplicationRecord
  belongs_to :task
  belongs_to :user
  belongs_to :competency
  belongs_to :student
  validates_presence_of :level
  validates :student, uniqueness: { scope: [:task, :competency ], message: "An observation on a student can only be made once per task per competency" }


  def self.update_competency_scores(current_user, assessment, student, incoming_scores, assessed_at, assessment_score = nil)
    existing_observations = CompetencyObservation.where(student_id: student.id.to_i)
    delete_obs = []
    save_obs = []

    assessment.tasks.each do |task|
      task_id_string = task[:id].to_s
      # Find existing observations for task id that aren't in incoming, excluding assessment score unless it's -1:
      if !incoming_scores[task_id_string] || incoming_scores[task_id_string].keys.empty? && ([nil, -1].include? assessment_score)
        to_delete = existing_observations.filter { |o| o.task_id == task.id && incoming_scores[task_id_string].keys.empty?}
        delete_obs.push(to_delete)
      else
        # for each competency on the task,
        # check if there's an existing and update it
        # check if it's missing from incoming and delete it
        # check if there's no existing but its in incoming and create it
        incoming = incoming_scores[task_id_string]

        task.competencies.each do |competency|
          existing = existing_observations.filter { |o| o[:task_id] == task.id && o[:competency_id] == competency.id}
          score = incoming[competency.id.to_s]

          if !score && !existing.empty?
            delete_obs.push(existing[0])
          elsif existing.empty? && score
            n = CompetencyObservation.new(task: task, competency: competency, student: student, user: current_user, level: score, assessed_at: assessed_at)
            save_obs.push(n)

          elsif existing && score
            save_obs.push(existing[0]) if existing[0].update(level: score, assessed_at: assessed_at)
          end
        end

        # check if there's an existing observation on this task for the assessment competency
        if assessment.competency_id
          existing = existing_observations.find { |o| o[:task_id] == task.id && o[:competency_id] == assessment.competency_id }

          if existing && ([-1,nil].include? assessment_score)
            delete_obs.push(existing)
          elsif !existing && ([-1,nil].exclude? assessment_score)
            n = CompetencyObservation.new(task: task, competency: assessment.competency, student: student, user: current_user, level: assessment_score, assessed_at: assessed_at)
            save_obs.push(n)
          elsif existing && assessment_score
            save_obs.push(existing) if existing.update(level: assessment_score, assessed_at: assessed_at)
          end
        end
      end
    end

    CompetencyObservation.transaction do
      delete_obs.flatten.each do |obs|
        obs.destroy
      end
      save_obs.each do |obs|
        obs.save
      end
    end

    student.competency_observations.where(task_id: assessment.tasks.map(&:id))
  end
end
