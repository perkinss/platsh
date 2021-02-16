class Section < ApplicationRecord
  validates :name, presence: true
  has_and_belongs_to_many :courses
  has_and_belongs_to_many :assessments, :join_table => :sections_assessments
  has_many :enrollments, dependent: :destroy
  has_many :students, through: :enrollments
  has_many :tasks, through: :assessments
  has_many :reporting_periods
  belongs_to :user

end
