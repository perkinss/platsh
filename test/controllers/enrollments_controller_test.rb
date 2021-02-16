require 'test_helper'
require 'test_data_factory'

class EnrollmentsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
    TestDataFactory.setDefaultUser(@user)

    @student = TestDataFactory.createStudent(name: "Jon", unique_id: "Jon")
    @section = Section.create!(name:'Section 1', user_id: @user.id)
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "should get new" do
    params = { student: @student, section: @section, :format => :json }
    post enroll_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert_equal @student.id, json_result['student_id']
    assert_equal @section.id, json_result['section_id']
  end

  # test "should get list" do
  #   get enrollments_list_url
  #   assert_response :success
  # end

end
