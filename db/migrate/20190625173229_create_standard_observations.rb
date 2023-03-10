class CreateStandardObservations < ActiveRecord::Migration[5.2]
  def change
    create_table :standard_observations do |t|
      t.references :task, foreign_key: true
      t.references :user, foreign_key: true
      t.references :standard, foreign_key: true
      t.references :student, foreign_key: true

      t.timestamps
    end
  end
end
