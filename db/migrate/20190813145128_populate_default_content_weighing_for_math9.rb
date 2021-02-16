class PopulateDefaultContentWeighingForMath9 < ActiveRecord::Migration[5.2]
  def change
    contents =  Content.where(course_id: Course.find_by_title("Math 9").id)

    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'operations' }, weight: 10)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'exponents' }, weight: 15)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'polynomials' }, weight: 10)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'two-variable linear relations' }, weight: 15)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'linear equations' }, weight: 15)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'proportional reasoning' || content.name.downcase == 'scale factors' }, weight: 10)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'statistics' }, weight: 15)
    DefaultContentWeighting.create(:content => contents.find { |content| content.name.downcase == 'financial literacy' }, weight: 10)

  end
end
