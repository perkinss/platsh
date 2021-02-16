class AddUniqueConstraintToTaskCompetencies < ActiveRecord::Migration[5.2]
  def change
    add_index :task_competencies, [:task_id, :competency_id], unique: true
  end
end
