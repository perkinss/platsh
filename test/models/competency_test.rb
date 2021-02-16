require 'test_helper'

class CompetencyTest < ActiveSupport::TestCase
  def setup
    competencyGroup = CompetencyGroup.new(title: 'Competency Group 1')
    competencyGroup.save
    course = Course.new(title: "C1")
    @competency = Competency.new(description: 'Some new competency.  I hope you can cope', competency_group: competencyGroup, course: course)
  end

  test "valid competency" do
    assert @competency.valid? 'Competency with description and grouping was invalid'
  end

  test "invalid competency without description" do
    @competency.description = ''
    refute @competency.valid? 'Competency without description was valid'
  end

  test "invalid competency without grouping" do
    @competency.competency_group = nil
    refute @competency.valid? 'Competency without group was valid'
  end

  test "invalid competency without course" do
    @competency.course = nil
    refute @competency.valid? 'Competency without course was valid'
  end
end
