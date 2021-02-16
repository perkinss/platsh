class CreateCompetencies < ActiveRecord::Migration[5.2]
  def change
    create_table :competencies do |t|
      t.references :course, foreign_key: true
      t.references :competency_group, foreign_key: true
      t.string :description

      t.timestamps
    end
  end
end
