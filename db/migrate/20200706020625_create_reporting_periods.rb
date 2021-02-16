class CreateReportingPeriods < ActiveRecord::Migration[6.0]
  def change
    create_table :reporting_periods do |t|
      t.string :name
      t.timestamps
    end

    add_reference :reporting_periods, :user, foreign_key: true
    add_reference :reporting_periods, :section, foreign_key: true
  end
end
