require 'test_helper'

class DefaultContentWeightingTest < ActiveSupport::TestCase

  def setup
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @contents = [
        Content.create!(name: "Content 1", description: "", course: @course),
        Content.create!(name: "Content 2", description: "", course: @course),
        Content.create!(name: "Content 3", description: "", course: @course),
        Content.create!(name: "Content 4", description: "", course: @course) ]
  end

  def teardown
    @course = nil
    @contents = nil
    DefaultContentWeighting.destroy_all
  end

  test "should be able to have default weightings course" do

    weighting = DefaultContentWeighting.new
    weights = [
        DefaultContentWeighting.create(content: @contents[0], weight: 1),
        DefaultContentWeighting.create(content: @contents[1], weight: 2) ,
        DefaultContentWeighting.create(content: @contents[2], weight: 3) ,
        DefaultContentWeighting.create(content: @contents[3], weight: 50)]

    assert_equal 4, @contents.size

    results = weighting.get_default_weighting_for_course @course
    assert_equal 4, results.size
    first = results.find { |weight| weight.id == weights[0].id }
    assert_not_nil first
    assert_equal first.content, @contents[0]
    assert_equal first.weight, weights[0].weight

    second = results.find { |weight| weight.id == weights[1].id }
    assert_not_nil second
    assert_equal second.content, @contents[1]
    assert_equal second.weight, weights[1].weight

    third = results.find { |weight| weight.id == weights[2].id }
    assert_not_nil third
    assert_equal third.content, @contents[2]
    assert_equal third.weight, weights[2].weight

    fourth = results.find { |weight| weight.id == weights[3].id }
    assert_not_nil fourth
    assert_equal fourth.content, @contents[3]
    assert_equal fourth.weight, weights[3].weight
  end

  test "Default content weighting should be unique" do

    weights = [
        DefaultContentWeighting.create(content: @contents[0], weight: 1),
        DefaultContentWeighting.create(content: @contents[0], weight: 1)]

    assert_not_nil weights[0].id
    assert_nil weights[1].id
  end
end
