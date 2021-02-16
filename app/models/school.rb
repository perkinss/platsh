class School < ApplicationRecord
  has_many :students
  has_and_belongs_to_many :users, :join_table => 'school_users'
  validates :school_code, uniqueness: true
  validates :name, presence: true
end
