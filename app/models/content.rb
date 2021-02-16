class Content < ApplicationRecord
  belongs_to :course
  has_many :standards
  has_one :default_content_weighting
  has_many :content_weightings, :dependent => :destroy
  validates :name, :course, presence: true
  has_and_belongs_to_many :reporting_periods, :join_table => :reporting_period_contents
end
