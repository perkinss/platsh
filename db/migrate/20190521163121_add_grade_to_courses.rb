class AddGradeToCourses < ActiveRecord::Migration[5.2]
  def change
    add_column :courses, :grade, :string
    add_index :courses, :grade
  end
end
