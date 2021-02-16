class CreateTasksCompetencies < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks_competencies , id: false do |t|
      t.belongs_to :competency, index: true
      t.belongs_to :task, index: true
    end
  end
end
