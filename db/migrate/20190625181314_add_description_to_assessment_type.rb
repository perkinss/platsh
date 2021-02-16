class AddDescriptionToAssessmentType < ActiveRecord::Migration[5.2]
  def up
    add_column :assessment_types, :description, :string
  end

  def down
    remove_column :assessment_types, :description
  end
end
