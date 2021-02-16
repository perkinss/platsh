require 'test_helper'

class StandardControllerTest < ActionDispatch::IntegrationTest

  def setup
    @course = Course.create!(title: "Course 1")
    @content = Content.create!(name: "Content 1", course: @course, description: "Big mucky muck")
    @standard = Standard.create!(content: @content, description: "bah humbug")
    @standard2 = Standard.create!(content: @content, description: "bah humbug 2")

    @course2 = Course.create!(title: "Course 2")
    @content2 = Content.create!(name: "Content 2", course: @course2, description: "Big mucky muck")
    @standard3 = Standard.create!(content: @content2, description: "bah humbug 3")
    @standard4 = Standard.create!(content: @content2, description: "bah humbug 4")

    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'asswordmore', password_confirmation: 'asswordmore')
    @section1 = Section.create!(name: 'Section groovy', user_id: @user.id, courses: [@course, @course2])
  end

  test "should get_all_for_course" do
    course2 = Course.create!(title: "Course 2")
    content2 = Content.create!(name: "Content TWO", course: course2, description: "not needed")
    s2 = Standard.create!(content: content2, description: "the first of content two")
    s3 = Standard.create!(content: content2, description: "the second of content 2")

    get get_standards_for_course_path, params: {course: [@course.id, course2.id], format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert_equal 2, json_result.size
    assert_equal 2, json_result[0]['contents'][0]['standards'].size
    assert_equal 2, json_result[1]['contents'][0]['standards'].size

    standards = json_result.find { |c| c['id'] == @course.id }['contents'][0]['standards']
    assert_equal 2, standards.size

    descriptions = standards.map { |st| st.values[1]}
    assert descriptions.include?(@standard.description)
    assert descriptions.include?(@standard2.description)

    standards = json_result.find { |c| c['id'] == course2.id }['contents'][0]['standards']
    assert_equal 2, standards.size

    descriptions = standards.map { |st| st.values[1]}
    assert descriptions.include?(s2.description)
    assert descriptions.include?(s3.description)
  end

  test "should get get_all_for_section" do
    get get_standards_for_section_path(@section1), params: {format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)

    assert(json_result)
    assert_equal 2, json_result.size
    assert_equal 2, json_result[0]['contents'][0]['standards'].size
    assert_equal 2, json_result[1]['contents'][0]['standards'].size
  end

  test "should arrive in order" do
    standard5 = Standard.create!(content: @content2, description: "ALWAYS FIRST")
    standard6 = Standard.create!(content: @content, description: "ALWAYS FIRST")

    standard7 = Standard.create!(content: @content2, description: "Zxzz Last")
    standard8 = Standard.create!(content: @content, description: "zxxzz Last")

    get get_standards_for_section_path(@section1), params: {format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert_equal 2, json_result.size
    assert_equal 4, json_result[0]['contents'][0]['standards'].size
    assert_equal 4, json_result[1]['contents'][0]['standards'].size

    first_standard = json_result[0]['contents'][0]['standards'][0]
    assert_equal standard6.description, first_standard['description']
    last_standard = json_result[0]['contents'][0]['standards'][3]
    assert_equal standard8.description, last_standard['description']

    first_standard = json_result[1]['contents'][0]['standards'][0]
    assert_equal standard5.description, first_standard['description']
    last_standard = json_result[1]['contents'][0]['standards'][3]
    assert_equal standard7.description, last_standard['description']
  end

  test "should get get_all_for_assessment" do
    assessment = Assessment.create!(name: 'test one', courses: [@course, @course2], user_id: @user.id, assessment_type: AssessmentType.create!(name: 'T1'), assessment_scoring_type: AssessmentScoringType.create!(name: 'ST1'))
    get get_all_for_assessment_path(assessment), params: {format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)

    assert(json_result)
    assert_equal 2, json_result.size
    assert_equal 2, json_result[0]['contents'][0]['standards'].size
    assert_equal 2, json_result[1]['contents'][0]['standards'].size
  end

end
