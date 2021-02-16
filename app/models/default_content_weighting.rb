class DefaultContentWeighting < ApplicationRecord

  # TODO remove this model and turn it into a column in content.
  belongs_to :content
  validates_uniqueness_of :content
  has_one :course, through: :content

  def get_default_weighting_for_course course
    DefaultContentWeighting.where(content_id: course.contents.pluck(:id))
  end
end
