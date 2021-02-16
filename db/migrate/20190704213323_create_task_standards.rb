class CreateTaskStandards < ActiveRecord::Migration[5.2]
  def change
    create_table :task_standards do |t|
      t.belongs_to :task, index: true
      t.belongs_to :standard, index: true
      t.string :level

      t.timestamps
    end
  end
end
