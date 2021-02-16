class AddUniqueConstraintToTaskStandards < ActiveRecord::Migration[5.2]
  def change
    add_index :task_standards, [:task_id, :standard_id], unique: true
  end
end
