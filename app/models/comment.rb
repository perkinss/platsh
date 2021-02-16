class Comment < ApplicationRecord
  belongs_to :task
  validates_presence_of :comment
  belongs_to :student
  validates :student, uniqueness: { scope: :task, message: "You can only have one comment per a task for a student" }
end
