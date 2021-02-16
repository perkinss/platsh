class TaskStandard < ApplicationRecord
  belongs_to :task
  belongs_to :standard
  validates :task, uniqueness: { scope: :standard, message: "Each standard on a task must be unique on the task" }

end
