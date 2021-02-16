class RenameTasksCompetenciesToCompetenciesTasks < ActiveRecord::Migration[5.2]
  def change
    rename_table :tasks_competencies, :competencies_tasks
  end
end
