class SchoolUser < ApplicationRecord
  belongs_to :school
  belongs_to :user
  validates :user, uniqueness: { scope: :school, message: "User is already part of this school" }

end
