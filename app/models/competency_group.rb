class CompetencyGroup < ApplicationRecord
  validates_presence_of :title
  has_many :competencies
  has_many :courses, through: :competencies
end
