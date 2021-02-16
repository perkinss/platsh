class AddUniquenessConstraintToAssessmentCourses < ActiveRecord::Migration[5.2]
  def change
    add_index :assessment_courses, [:course_id, :assessment_id], unique: true
  end
end
