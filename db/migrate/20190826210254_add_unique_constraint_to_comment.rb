class AddUniqueConstraintToComment < ActiveRecord::Migration[5.2]
  def change
    add_index :comments, [:task_id, :student_id], unique: true
  end
end
