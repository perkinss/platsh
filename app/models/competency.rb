class Competency < ApplicationRecord
  belongs_to :course
  belongs_to :competency_group
  has_and_belongs_to_many :tasks, :join_table => 'task_competencies'
  validates_presence_of :description
end
