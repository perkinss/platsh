class TaskCompetency < ApplicationRecord
  belongs_to :task
  belongs_to :competency
  validates :task, uniqueness: { scope: :competency, message: "Each competency on a task must be unique on the task" }

end
