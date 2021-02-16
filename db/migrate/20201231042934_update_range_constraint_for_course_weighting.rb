class UpdateRangeConstraintForCourseWeighting < ActiveRecord::Migration[6.0]
  def change
    execute "ALTER TABLE course_weightings DROP CONSTRAINT IF EXISTS weighting_range"
    execute "ALTER TABLE course_weightings ADD CONSTRAINT weighting_range check (contents_weight >= 0 AND contents_weight <=100 )"
  end
end
