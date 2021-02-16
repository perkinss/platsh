class Course < ApplicationRecord
  has_many :contents
  has_and_belongs_to_many :sections
  has_and_belongs_to_many :assessments,:join_table => :assessment_courses
  has_many :standards, through: :contents
  has_many :competencies
  has_many :competency_groups, through: :competencies
  validates :title, presence: true

end
