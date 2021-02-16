class CreateTasksStandards < ActiveRecord::Migration[5.2]
  def change
    create_table :tasks_standards, id: false do |t|
      t.belongs_to :task, index: true
      t.belongs_to :standard, index: true
    end
  end
end
