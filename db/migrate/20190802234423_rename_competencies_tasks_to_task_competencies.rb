class RenameCompetenciesTasksToTaskCompetencies < ActiveRecord::Migration[5.2]
  def change
    rename_table :competencies_tasks,:task_competencies
  end
end
