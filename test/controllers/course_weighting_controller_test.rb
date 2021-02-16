require 'test_helper'

class CourseWeightingControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @section = Section.create!(name: "My section", user_id: @user.id)
    @section.courses = [@course]
    @section.save

  end

  def teardown
    sign_out @user
    @user = nil
    @section = nil
    @course = nil
    @contents = nil
  end

  test "should get get_for_user" do
    get course_weighting_for_user_path, params: {format: :json}
    assert_response :success
  end

  test "should get default weightings get_for_user_course when there are no user weightings" do

    get course_weighting_for_user_path, params: {format: :json}
    json_result = JSON.parse(response.body)
    assert json_result

    json_result
    assert_equal 1, json_result.length
    # only one course:
    assert_equal 1, json_result['course_weights'].length
    assert_equal 50,  json_result['course_weights'][0]['contents_weight']
  end

  test "should right content weights for user_course " do

    weight = CourseWeighting.create!(course: @course, contents_weight: 75, user: @user)
    assert weight.valid?
    # get assessments_get_for_user_path, params: {format: :json}
    get course_weighting_for_user_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    assert_equal 1, json_result.length
    # only one course:
    assert json_result['course_weights']
    assert json_result['course_weights'][0]
    assert_equal 75, json_result['course_weights'][0]['contents_weight']
  end

  test 'save weighting where none exists' do

    refute CourseWeighting.where(course_id: @course.id, user_id: @user.id).exists?
    params = { :course => @course.id, :contents_weight => 35, :format => :json }
    result = post course_weighting_save_url(@course.id), params: params

    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    assert_equal 2, json_result.length
    assert_equal 35, json_result['contents_weight']
  end
  
end
