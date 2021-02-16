class CreateStudents < ActiveRecord::Migration[5.2]
  def change
    create_table :students do |t|
      t.string :name, :null => false
      t.string :UUID
      t.index :UUID, unique: true

      t.timestamps
    end
  end
end
