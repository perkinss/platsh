class CoursesSection < ApplicationRecord
  belongs_to :course
  belongs_to :section
  validates :course, uniqueness: { scope: :section, message: "user can only add a course to a section once" }

end
