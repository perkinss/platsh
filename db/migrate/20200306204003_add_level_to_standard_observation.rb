class AddLevelToStandardObservation < ActiveRecord::Migration[5.2]
  def change
    add_column :standard_observations, :level, :string
  end
end
