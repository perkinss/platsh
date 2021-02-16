require 'test_helper'

class CompetencyGroupWeightingTest < ActiveSupport::TestCase

  def setup
    @user = User.new(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @group = CompetencyGroup.create!(title: "Group 1")
    @first = CompetencyGroupWeighting.create(competency_group: @group, weight: 1, user: @user, course: @course)
  end

  def teardown
    @course = nil
    @group = nil
  end

  test "should be able to have user weightings course" do
    assert @first.valid? 'Competency with content and weight and course and user was invalid'
  end

  test "User Competency weighting should be unique" do
    dup = CompetencyGroupWeighting.create(competency_group: @group, weight: 3, user: @user, course: @course)
    refute dup.valid? 'Duplicate content weighting was valid'
  end

  test "User Competency weighting should be not be unique for different coures" do
    course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    uniq = CompetencyGroupWeighting.create(competency_group: @group, weight: 3, user: @user, course: course)
    assert uniq.valid? 'Unique content weighting with a different course was invalid'
  end

  test "User Competency weighting should be not be unique for different users" do
    user = User.new(name: 'A teacher', email: "a2@b.c", password: "ohcrapapassword")
    uniq = CompetencyGroupWeighting.create(competency_group: @group, weight: 3, user: user, course: @course)
    assert uniq.valid? 'Unique content weighting with a different user was invalid'
  end

  test "User Competency weighting should be not be unique for different competency groups" do
    group = CompetencyGroup.create!(title: "Group 1")
    uniq = CompetencyGroupWeighting.create(competency_group: group, weight: 3, user: @user, course: @course)
    assert uniq.valid? 'Unique content weighting on a different group was invalid'
  end
end
