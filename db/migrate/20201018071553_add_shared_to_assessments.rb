class AddSharedToAssessments < ActiveRecord::Migration[6.0]
  def change
    add_column :assessments, :shared, :boolean, default: false
  end
end
