class AddDateRangeToReportingPeriods < ActiveRecord::Migration[6.0]
  def change
    add_column :reporting_periods, :period_start, :timestamp
    add_column :reporting_periods, :period_end, :timestamp
  end
end
