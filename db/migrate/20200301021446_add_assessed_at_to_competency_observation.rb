class AddAssessedAtToCompetencyObservation < ActiveRecord::Migration[5.2]
  def change
    add_column :competency_observations, :assessed_at, :timestamp, default: -> { 'CURRENT_TIMESTAMP' }, null: false
    add_index :competency_observations, :assessed_at
  end
end
