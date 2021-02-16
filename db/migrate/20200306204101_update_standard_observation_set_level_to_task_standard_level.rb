class UpdateStandardObservationSetLevelToTaskStandardLevel < ActiveRecord::Migration[5.2]
  def change
    StandardObservation.connection.execute("
          UPDATE standard_observations
            SET level = task_standards.level
            FROM task_standards
            WHERE task_standards.standard_id = standard_observations.standard_id
              and task_standards.task_id = standard_observations.task_id;")
  end
end
