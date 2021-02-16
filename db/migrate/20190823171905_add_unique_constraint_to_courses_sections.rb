class AddUniqueConstraintToCoursesSections < ActiveRecord::Migration[5.2]
  def change
    add_index :courses_sections, [:section_id, :course_id], unique: true
  end
end
