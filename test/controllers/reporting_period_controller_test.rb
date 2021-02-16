require 'test_helper'
require 'time'

class ReportingPeriodControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save

    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @contents = [Content.create!(name: 'Topic 1', course: @course),Content.create!(name: 'Topic 2', course: @course)]
    @section = Section.create!(name: "Section of Test", user_id: @user.id, courses: [@course])

    sign_in @user
  end

  test 'can respond to json reporting periods' do
    get reporting_periods_path, params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result
  end

  test 'retrieves a users reporting period' do
    reporting_period = ReportingPeriod.create!(user: @user, section: @section, name: "First report", contents: [@contents[0]])
    get reporting_periods_path, params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result[0]['id']
    assert json_result[0]['name'] == reporting_period.name
  end

  test 'retrieves all of users reporting periods' do
    reporting_periods = [
        ReportingPeriod.create!(user: @user, section: @section, name: "First report", contents: [@contents[0]]),
        ReportingPeriod.create!(user: @user, section: @section, name: "Second report", contents: [@contents[0]])]
    get reporting_periods_path, params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result
    assert_equal 2, json_result.size
    res = json_result.map { |s| s['name']}
    assert res.include? reporting_periods[0].name
    assert res.include? reporting_periods[1].name
  end

  test 'can respond to json reporting periods for section' do
    get reporting_periods_for_section_path(@section.id), params: { :format => :json, }
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result
  end

  test "retrieves a section's reporting period" do
    reporting_period = ReportingPeriod.create!(user: @user, section: @section, name: "First report", contents: [@contents[0]])
    get reporting_periods_for_section_path(@section.id), params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result[0]['id']
    assert json_result[0]['name'] == reporting_period.name
  end

  test "retrieves all of section's reporting periods" do
    reporting_periods = [
        ReportingPeriod.create!(user: @user, section: @section, name: "First report", contents: [@contents[0]]),
        ReportingPeriod.create!(user: @user, section: @section, name: "Second report", contents: [@contents[0]])]
    get reporting_periods_for_section_path(@section.id), params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 2, json_result.size
    res = json_result.map { |s| s['name']}
    assert res.include? reporting_periods[0].name
    assert res.include? reporting_periods[1].name
  end

  test 'can create a new reporting period' do
    topic_ids = @contents.map(&:id)

    post reporting_period_create_path, params: { :format => :json, topics: topic_ids, name: "Period uno", section: @section.id }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal "Period uno", json_result['name']

    topic_names = @contents.map(&:name).sort
    assert topic_names.include? json_result['contents'][0]['name']
    assert topic_names.include? json_result['contents'][1]['name']
  end

  test 'can delete a reporting period' do
    reporting_periods = [
        ReportingPeriod.create!(user: @user, section: @section, name: "First report", contents: [@contents[0]]),
        ReportingPeriod.create!(user: @user, section: @section, name: "Second report", contents: [@contents[0]])]

    assert_equal 2, ReportingPeriod.count

    delete reporting_period_delete_path(reporting_periods[0].id), params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert json_result['deleted']['name'] == reporting_periods[0].name
    assert json_result['deleted']['id'] == reporting_periods[0].id
    assert_equal 1, ReportingPeriod.count
  end

  test 'can create a new reporting period with start and end dates' do
    topic_ids = @contents.map(&:id)
    period_start = Time.now - 200000
    period_end = Time.now
    expected_end = period_end.change(:usec => 0).getutc
    expected_start = period_start.change(:usec => 0).getutc

    post reporting_period_create_path, params: {
        :format => :json,
        topics: topic_ids,
        name: "Period uno",
        section: @section.id,
        period_start: period_start,
        period_end: period_end,
    }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal "Period uno", json_result['name']

    actual_start = Time.strptime(json_result['period_start'], "%Y-%m-%dT%H:%M:%S.%L%Z", now=Time.now).getutc
    actual_end = Time.strptime(json_result['period_end'], "%Y-%m-%dT%H:%M:%S.%L%Z", now=Time.now).getutc
    assert_equal expected_start, actual_start
    assert_equal expected_end, actual_end
  end

  test 'can update an existing reporting period' do
    reporting_period = ReportingPeriod.create!(user: @user, section: @section, name: "First report", contents: [@contents[0]])
    assert_equal 1, reporting_period.contents.length

    post reporting_period_update_path(id: reporting_period.id), params: {
        :format => :json,
        name: "Period tres",
        section: @section.id,
        topics: [@contents[1].id, @contents[0].id]
    }
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    contents = json_result['contents']
    assert_equal 2, contents.length #successfully added one topic
    assert_equal "Period tres", json_result['name']
  end

end
