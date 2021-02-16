require 'test_helper'

class ContentWeightingTest < ActiveSupport::TestCase
  def setup
    @user = User.new(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @content = Content.create!(name: "Content 1", description: "", course: @course)
    @first = ContentWeighting.create(content: @content, weight: 1, user: @user)
  end

  def teardown
    @course = nil
    @content = nil
    ContentWeighting.destroy_all
  end

  test "should be able to have user weightings course" do
    assert @first.valid? 'Competency with content and weight was invalid'
  end

  test "User content weighting should be unique" do

    dup = ContentWeighting.create(content: @content, weight: 1, user: @user)
    refute dup.valid? 'Duplicate content weighting was valid'
  end
end
