class CreateCompetencyObservations < ActiveRecord::Migration[5.2]
  def change
    create_table :competency_observations do |t|
      t.references :task, foreign_key: true
      t.references :user, foreign_key: true
      t.references :competency, foreign_key: true
      t.references :student, foreign_key: true
      t.text :comment
      t.integer :level

      t.timestamps
    end
  end
end
