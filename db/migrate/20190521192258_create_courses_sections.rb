class CreateCoursesSections < ActiveRecord::Migration[5.2]
  def change
    create_table :courses_sections, id: false do |t|
      t.belongs_to :course, index: true
      t.belongs_to :section, index: true
    end
  end
end
