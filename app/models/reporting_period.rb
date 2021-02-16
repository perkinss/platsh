class ReportingPeriod < ApplicationRecord
  belongs_to :section
  belongs_to :user
  has_and_belongs_to_many :contents, :join_table => :reporting_period_contents
end
