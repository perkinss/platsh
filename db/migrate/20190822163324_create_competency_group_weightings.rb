class CreateCompetencyGroupWeightings < ActiveRecord::Migration[5.2]
  def change
    create_table :competency_group_weightings do |t|
      t.references :user, foreign_key: true
      t.references :competency_group, foreign_key: true
      t.integer :weight
      t.references :course, foreign_key: true

      t.timestamps
    end
  end
end
