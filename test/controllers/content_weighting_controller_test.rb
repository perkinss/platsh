require 'test_helper'

class ContentWeightingControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @section = Section.create!(name: "Course 1", user_id: @user.id)
    @course.sections = [@section]
    @contents = [
        Content.create!(name: "Content 1", description: "", course: @course),
        Content.create!(name: "Content 2", description: "", course: @course),
        Content.create!(name: "Content 3", description: "", course: @course),
        Content.create!(name: "Content 4", description: "", course: @course) ]
  end

  def teardown
    sign_out @user
    @user = nil
    @section = nil
    @course = nil
    @contents = nil
  end

  test "should get get_for_user_course" do
    get content_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
  end

  test "should get_for_user_course when there are only defaults" do

    weights = [
        DefaultContentWeighting.create!(content: @contents[0], weight: 1),
        DefaultContentWeighting.create!(content: @contents[1], weight: 2) ,
        DefaultContentWeighting.create!(content: @contents[2], weight: 3) ,
        DefaultContentWeighting.create!(content: @contents[3], weight: 50)]
    # get assessments_get_for_user_path, params: {format: :json}
    get content_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

  end

  test "should right content weights for user_course " do

    default_weights = [
        DefaultContentWeighting.create!(content: @contents[0], weight: 1),
        DefaultContentWeighting.create!(content: @contents[1], weight: 2) ,
        DefaultContentWeighting.create!(content: @contents[2], weight: 3) ,
        DefaultContentWeighting.create!(content: @contents[3], weight: 50)]
    user_weights = [
        ContentWeighting.create!(content: @contents[0], weight: 30, user: @user),
        ContentWeighting.create!(content: @contents[2], weight: 200, user: @user)
    ]
    # get assessments_get_for_user_path, params: {format: :json}
    get content_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    json_weights = json_result[0]['content_weights']
    content_0_weight = json_weights.find { |content| @contents[0].id == content['id'] }
    weight = content_0_weight['weight']

    assert content_0_weight
    assert weight
    assert_equal 30, weight

    content_1_weight = json_weights.find { |content| @contents[1].id == content['id'] }
    weight = content_1_weight['weight']
    assert content_1_weight
    assert weight
    assert_equal 2, weight

    content_2_weight = json_weights.find { |content| @contents[2].id == content['id'] }
    weight = content_2_weight['weight']
    assert content_2_weight
    assert weight
    assert_equal 200, weight

    content_3_weight = json_weights.find { |content| @contents[3].id == content['id'] }
    weight = content_3_weight['weight']
    assert content_3_weight
    assert weight
    assert_equal 50, weight

  end

  test 'weights are all 1 by default' do
    get content_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    json_weights = json_result[0]['content_weights']
    assert_equal 4, json_weights.size
    json_weights.each do |weighting|
      assert_equal 1, weighting['weight']
    end
  end

  test 'save weightings where none exist' do

    assert_equal 0, ContentWeighting.where(content_id: [@contents[3], @contents[2]]).size
    params = { "course"=>@course.id, "weights"=>[{"content_id"=> @contents[3].id, "weight"=>10}, {"content_id"=>@contents[2], "weight"=>11}], format: :json }
    post content_weighting_save_url (params)
    get content_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    assert_equal 2, ContentWeighting.where(content_id: [@contents[3], @contents[2]]).size

  end


end
