require 'test_helper'

class CourseWeightingTest < ActiveSupport::TestCase
  def setup
    @user = User.new(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @first = CourseWeighting.create(contents_weight: 50, user: @user, course: @course)
  end

  def teardown
    @course = nil
    @group = nil
  end

  test 'User can have a valid course weighting' do
    assert @first.valid? 'Valid course topic vs competenc weighting was invalid'
  end

  test 'Weighting with value below range should be invalid' do
    second = CourseWeighting.create(contents_weight: -1, user: @user, course: Course.new(title: "bah"))
    refute second.valid? 'Course weighting with contents weight below 0 was valid :('
  end

  test 'Weighting with value above range should be invalid' do
    second = CourseWeighting.create(contents_weight: 102, user: @user, course: Course.new(title: "bah"))
    refute second.valid? 'Course weighting with contents weight above 100 was valid :('
  end

  test "Duplicate course weighting should be invalid" do
    second = CourseWeighting.create(contents_weight: 50, user: @user, course: @course)
    refute second.valid? 'Duplicate course weighting was valid'
  end
end
