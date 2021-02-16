class UpdateStandardObservationSetAssessedAtToUpdatedAt < ActiveRecord::Migration[5.2]
  def change
    StandardObservation.connection.execute("UPDATE standard_observations SET assessed_at = updated_at")
  end
end
