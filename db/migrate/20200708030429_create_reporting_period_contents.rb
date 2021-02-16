class CreateReportingPeriodContents < ActiveRecord::Migration[6.0]
  def change
    create_table :reporting_period_contents do |t|
      t.references :reporting_period, null: false, foreign_key: true
      t.references :content, null: false, foreign_key: true
    end
  end
end
