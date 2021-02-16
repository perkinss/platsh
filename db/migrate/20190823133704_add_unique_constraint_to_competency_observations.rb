class AddUniqueConstraintToCompetencyObservations < ActiveRecord::Migration[5.2]
  def change
    add_index :competency_observations, [:task_id, :student_id, :competency_id], unique: true, name: "index_competency_observation_unique_comp_task_stu"
  end
end
