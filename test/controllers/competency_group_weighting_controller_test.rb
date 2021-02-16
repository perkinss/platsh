require 'test_helper'

class CompetencyGroupWeightingControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @section = Section.create!(name: "Course 1", user_id: @user.id)
    @course.sections = [@section]
    @competency_groups = [
        CompetencyGroup.create!(title: "Group 1"),
        CompetencyGroup.create!(title: "Group 2"),
        CompetencyGroup.create!(title: "Group 3"),
        CompetencyGroup.create!(title: "Group 4") ]
    @competencies = [
        Competency.create!(description: "Competency 1", course: @course, competency_group: @competency_groups[0]),
        Competency.create!(description: "Competency 2", course: @course, competency_group: @competency_groups[1]),
        Competency.create!(description: "Competency 3", course: @course, competency_group: @competency_groups[2]),
        Competency.create!(description: "Competency 4", course: @course, competency_group: @competency_groups[3])
    ]
  end

  def teardown
    sign_out @user
    @user = nil
    @section = nil
    @course = nil
    @competencies = nil
    @competency_groups = nil
  end

  test "should get get_for_user_course" do
    get competency_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
  end

  test "should get_for_user_course when there are only defaults" do

    # get assessments_get_for_user_path, params: {format: :json}
    get competency_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 1, json_result.length
    assert_equal 4, json_result[0]['competency_weights'].length
    weightings =  json_result[0]['competency_weights']
    (0...@competency_groups.length).each do |index|
      assert_equal 1, weightings.find { |w| w['id'] == @competency_groups[index].id }['weight']
    end
  end

  test "should get right content weights for user_course " do
    
    user_weights = [
       CompetencyGroupWeighting.create!(competency_group: @competency_groups[0], weight: 30, user: @user, course: @course ),
       CompetencyGroupWeighting.create!(competency_group: @competency_groups[2], weight: 200, user: @user, course: @course)
    ]
    # get assessments_get_for_user_path, params: {format: :json}
    get competency_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    json_weights = json_result[0]['competency_weights']
    competency_0_weight = json_weights.find { |group| @competency_groups[0].id == group['id'] }
    assert competency_0_weight 
    weight = competency_0_weight['weight']
    assert weight
    assert_equal 30, weight

    competency_1_weight = json_weights.find { |competency| @competency_groups[1].id == competency['id'] }
    weight = competency_1_weight['weight']
    assert competency_1_weight
    assert weight
    assert_equal 1, weight

    competency_2_weight = json_weights.find { |competency| @competency_groups[2].id == competency['id'] }
    weight = competency_2_weight['weight']
    assert competency_2_weight
    assert weight
    assert_equal 200, weight

    competency_3_weight = json_weights.find { |competency| @competency_groups[3].id == competency['id'] }
    weight = competency_3_weight['weight']
    assert competency_3_weight
    assert weight
    assert_equal 1, weight

  end

  test 'save weightings where none exist' do

    assert_equal 0, CompetencyGroupWeighting.where(competency_group_id: [@competency_groups[3], @competency_groups[2]]).size
    params = { "course"=>@course, "weights"=>[{"group_id"=> @competency_groups[3].id, "weight"=>10},{"group_id"=> @competency_groups[2].id, "weight"=>11}], format: :json }
    post competency_weighting_save_url (params)
    get content_weighting_get_for_user_courses_path, params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    assert_equal 2, CompetencyGroupWeighting.where(competency_group_id: [@competency_groups[3], @competency_groups[2]]).size

  end


end
