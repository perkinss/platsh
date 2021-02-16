class DropTasksStandards < ActiveRecord::Migration[5.2]
  def change
    drop_table :tasks_standards
  end
end
