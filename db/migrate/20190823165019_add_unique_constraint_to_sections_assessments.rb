class AddUniqueConstraintToSectionsAssessments < ActiveRecord::Migration[5.2]
  def change
    add_index :sections_assessments, [:section_id, :assessment_id], unique: true
  end
end
