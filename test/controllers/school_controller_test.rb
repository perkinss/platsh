require 'test_helper'

class SchoolControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
  end

  test 'can list schools' do
    get school_list_get_for_user_path params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 2, json_result.size
  end

  test "get_for_user fetches only the user's schools" do
    schools = [
        School.create!(name: "hohohoh", school_code: '123123'),
        School.create!(name: "nononon", school_code: '456456'),
        School.create!(name: "yesyesy", school_code: '789789')
    ]
    @user.schools = [schools[0], schools[2]]
    @user.save

    get school_list_get_for_user_path params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 2, json_result.size
    assert_equal ['hohohoh', 'yesyesy'], json_result.map{ |school| school['name'] }.sort
  end

  test 'get_for_user fetches all schools when the user has no schools' do
    get school_list_get_for_user_path params: { :format => :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 2, json_result.size
  end

  test 'get_for_user fetches no schools when the user has no schools and strict parameter is provided' do
    get school_list_get_for_user_path params: { :format => :json, :strict => "true" }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 0, json_result.size
  end

end
