class Enrollment < ApplicationRecord
  belongs_to :section
  belongs_to :student
  validates :student, uniqueness: { scope: :section, message: "Student can only be enrolled once in a section" }

end
