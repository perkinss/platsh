class UpdateCompetencyObservationSetAssessedAtToUpdatedAt < ActiveRecord::Migration[5.2]
  def change
    CompetencyObservation.connection.execute("UPDATE competency_observations SET assessed_at = updated_at")
  end
end
