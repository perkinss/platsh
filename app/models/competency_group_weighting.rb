class CompetencyGroupWeighting < ApplicationRecord
  belongs_to :user
  belongs_to :competency_group
  belongs_to :course

  validates :competency_group, uniqueness: { scope: [:user, :course ], message: "user can only have one weight per competency category per course" }
end
