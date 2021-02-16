class AddSubjectToCourses < ActiveRecord::Migration[5.2]
  def change
    add_column :courses, :subject, :string
    add_index :courses, :subject
  end
end
