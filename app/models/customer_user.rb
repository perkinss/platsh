class CustomerUser < ApplicationRecord
  belongs_to :customer
  belongs_to :user
  validates :customer, uniqueness: { scope: :user, message: "User is already associated with this customer" }
end
