class AddScoreToStandardObservations < ActiveRecord::Migration[6.0]
  def change
    add_column :standard_observations, :score, :integer, default: 1
  end
end
