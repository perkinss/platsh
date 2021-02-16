class AddUniqueConstraintToStandardObservations < ActiveRecord::Migration[5.2]
  def change
    add_index :standard_observations, [:task_id, :student_id, :standard_id], unique: true, name: "index_standard_observation_unique_stan_task_stu"
  end
end
