class CourseWeighting < ApplicationRecord
  belongs_to :user
  belongs_to :course
  validates :contents_weight, :inclusion => {:in => (0..100)}
  validates :course, uniqueness: { scope: :user, message: "User can only have one weighting for a course" }
end
