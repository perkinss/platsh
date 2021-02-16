class CreateAssessmentCourses < ActiveRecord::Migration[5.2]
  def change
    create_table :assessment_courses, id: false do |t|
      t.references :course, foreign_key: true
      t.references :assessment, foreign_key: true
    end
  end
end
