class Customer < ApplicationRecord
  has_many :students
  has_and_belongs_to_many :users
  validates :name, presence: true
end
