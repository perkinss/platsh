class SectionsAssessment < ApplicationRecord
  belongs_to :section
  belongs_to :assessment
  validates :assessment, uniqueness: { scope: :section, message: "user can only add an assessment to a section once" }

end
