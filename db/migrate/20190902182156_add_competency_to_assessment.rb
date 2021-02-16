class AddCompetencyToAssessment < ActiveRecord::Migration[5.2]
  def change
    add_reference :assessments, :competency, foreign_key: true
  end
end
