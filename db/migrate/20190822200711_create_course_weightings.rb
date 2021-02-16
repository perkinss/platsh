class CreateCourseWeightings < ActiveRecord::Migration[5.2]
  def change
    create_table :course_weightings do |t|
      t.references :user, foreign_key: true
      t.integer :contents_weight
      t.references :course, foreign_key: true

      t.timestamps
    end
  end
end
