class AddAssessedAtToStandardObservation < ActiveRecord::Migration[5.2]
  def change
    add_column :standard_observations, :assessed_at, :timestamp, default: -> { 'CURRENT_TIMESTAMP' }, null: false
    add_index :standard_observations, :assessed_at
  end
end
