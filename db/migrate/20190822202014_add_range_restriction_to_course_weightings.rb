class AddRangeRestrictionToCourseWeightings < ActiveRecord::Migration[5.2]
    # ALTER TABLE measurement_y2008m02 ADD CONSTRAINT y2008m02
    # CHECK ( logdate >= DATE '2008-02-01' AND logdate < DATE '2008-03-01' );
    def self.up
      execute "ALTER TABLE course_weightings ADD CONSTRAINT weighting_range check (contents_weight >= 5 AND contents_weight <=95 )"
    end

    def self.down
      execute "ALTER TABLE course_weightings DROP CONSTRAINT weighting_range"
    end
end
