require 'test_helper'
require 'test_data_factory'

class ReportingPeriodTest < ActiveSupport::TestCase
  def setup
    @user = TestDataFactory.createUser(name: "Test User", email: "user@example.com",
                                       password: "apassword", password_confirmation: "apassword")
    TestDataFactory.setDefaultUser(@user)
    @courses = [Course.create!(title: "Test course", grade: '9', subject: 'math'), Course.create!(title: "Another Test course", grade: '10', subject: 'math') ]
    @section = Section.create!(name: "Section of Test", user_id: @user.id, courses: @courses)

    @reporting_period = ReportingPeriod.create!(name: "Fall report", section_id: @section.id, user_id: @user.id)
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid reporting period" do
    assert @reporting_period.valid? 'Valid reporting period turned out to be invalid.'
  end

  test "valid reporting period with one content" do
    content = Content.create!(name: "foo", course: @courses[1])
    @reporting_period.contents = [content]
    assert @reporting_period.valid? 'Valid reporting period with content turned out to be invalid.'
  end

  test "valid reporting period with multiple contents" do
    contents = [Content.create!(name: "foo", course: @courses[1]), Content.create!(name: "bar", course: @courses[1])]
    @reporting_period.contents = contents
    assert @reporting_period.valid? 'Valid reporting period with content turned out to be invalid.'
  end

  test "valid reporting period with start date" do
    @reporting_period.period_start = Time.now - 2000
    assert @reporting_period.valid? 'Valid reporting period with start date turned out to be invalid.'
  end

  test "valid reporting period with end date" do
    @reporting_period.period_end = Time.now + 2000
    assert @reporting_period.valid? 'Valid reporting period with start date turned out to be invalid.'
  end

  test "valid reporting period with start and end dates" do
    @reporting_period.period_start = Time.now - 2000
    @reporting_period.period_end = Time.now + 2000
    assert @reporting_period.valid? 'Valid reporting period with start date turned out to be invalid.'
  end

end
