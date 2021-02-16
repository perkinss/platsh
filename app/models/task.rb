class Task < ApplicationRecord
  belongs_to :assessment
  has_many :task_standards
  has_many :standards, through: :task_standards
  has_many :task_competencies
  has_and_belongs_to_many :competencies, :join_table => :task_competencies
  has_many :comments
  validates :name, presence: true
end
