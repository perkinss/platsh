class Standard < ApplicationRecord
  validates :description, presence: true
  belongs_to :content
  has_many :task_standards
  has_many :tasks, through: :task_standards
  has_many :standard_observations
end
