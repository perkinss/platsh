require 'test_helper'
require 'test_data_factory'

class UsersControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = TestDataFactory.createUser
    sign_in @user
  end

  test "should set schools to provided id" do
    school = TestDataFactory.createSchool

    put user_schools_update_url, params: { :schoolIds => [school.id],:format => :json }

    assert_equal [school], @user.schools
  end

  test "should forbid school update when roles excludes teacher" do
    @user = TestDataFactory.createUser(email: 'test_forbidden@test.com', roles: [:student])
    sign_in @user
    school = TestDataFactory.createSchool

    put user_schools_update_url, params: { :schoolIds => [school.id],:format => :json }

    assert_response :forbidden
    assert_empty @user.schools
  end
end
