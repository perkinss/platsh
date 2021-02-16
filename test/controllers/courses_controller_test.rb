require 'test_helper'
require 'test_data_factory'

class CoursesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    TestDataFactory.setDefaultUser(@user)
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
  end

  test "should get course json" do
    get courses_index_url, params: {format: :json}

    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert(json_result[0]['title']).equal?('Course 1')
    assert(json_result[1]['title']).equal?('Course 2')
  end

  test "should get complete course content" do
    get courses_all_content_path, params: {format: :json}

    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert(json_result.size == 2)
    course1 = json_result.select{|course| course['title'] == 'Course 1'}
    assert course1.size == 1
    assert_equal course1[0]['contents'][0]["name"], "MyString"
  end

  test "should get users courses with sections" do
    @section = Section.create!(name: 'fake', user_id: @user.id)
    courses = [Course.create!(title: "Test course", grade: '9', subject: 'math'), Course.create!(title: "Another Test course", grade: '10', subject: 'math') ]
    @section.courses = courses

    @section2 = Section.create!(name: 'fake', user_id: @user.id)
    @section2.courses = [courses[0]]

    get course_sections_list_for_user_url, params: {format: :json}

    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert(json_result.size == 2)
    assert json_result[courses[0].id.to_s]['sections'].size == 2
    assert json_result[courses[1].id.to_s]['sections'].size == 1
    assert json_result[courses[0].id.to_s]['sections'].find { |section| section['id'] == @section.id }
    assert json_result[courses[0].id.to_s]['sections'].find { |section| section['id'] == @section2.id }
    assert json_result[courses[1].id.to_s]['sections'].find { |section| section['id'] == @section.id }
  end

end
