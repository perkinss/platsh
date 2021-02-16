class AssessmentScoringType < ApplicationRecord
  DEFAULT_NAME = 'Analytic'

  validates :name, presence: true
  has_many :assessments
end
