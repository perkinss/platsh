class CreateAssessments < ActiveRecord::Migration[5.2]
  def change
    create_table :assessments do |t|
      t.string :name
      t.references :user, foreign_key: true
      t.references :assessment_type, foreign_key: true

      t.timestamps
    end
  end
end
