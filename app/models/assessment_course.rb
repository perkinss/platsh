class AssessmentCourse < ApplicationRecord
  belongs_to :course
  belongs_to :assessment
  validates :course, uniqueness: { scope: :assessment, message: "user can only add an assessment to a course once" }

end
