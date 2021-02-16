class AddUniquenessConstraintToCourseWeightings < ActiveRecord::Migration[5.2]
  def change
    add_index :course_weightings, [:user_id, :course_id], unique: true
  end
end
