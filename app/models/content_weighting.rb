class ContentWeighting < ApplicationRecord
  belongs_to :user
  belongs_to :content
  validates :content, uniqueness: { scope: :user, message: "user can only have one weight per course topic" }
end
