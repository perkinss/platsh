require 'test_helper'

class CompetenciesControllerTest < ActionDispatch::IntegrationTest

  def setup
    @courses = [Course.create!(title: "Course 1"),Course.create!(title: "Course 2")]
    @groups = [CompetencyGroup.create!(title: "Group 1"),CompetencyGroup.create!(title: "Group 2") ]
    @competency1 = Competency.create!(competency_group_id: @groups[0].id, description: "bah humbug", course: @courses[0])
    @competency2 = Competency.create!(competency_group_id: @groups[0].id, description: "bah humbug 2", course: @courses[0])
    @competency3 = Competency.create!(competency_group_id: @groups[1].id, description: "bah humbug 3 ", course: @courses[0])
    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "bah humbug 4", course: @courses[0])

    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    @section = Section.create!(name: 'fake', user_id: @user.id, courses: @courses)

    # sign_in @user
  end


  test "should get get_by_section" do

    get get_by_section_path(@section), params: {format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    groups = json_result[0]['groups']
    assert_equal 2, groups.size

    competencies = groups.find {|g| g['id'] == @groups[0].id}['competencies']
    assert_equal 2, competencies.size

    descriptions = competencies.map { |c| c.values[1]}
    assert descriptions.include?(@competency1.description)
    assert descriptions.include?(@competency2.description)
  end

  test "should get only those competencies in the section" do

    get get_by_section_path(@section), params: {format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result.size
    groups = json_result[0]['groups']
    assert_equal 2, groups.size

    # second course has no competencies referenced.  We want no groups in this case.
    groups2 = json_result[1]
    assert_nil groups2
  end

  test "should get get_by_course" do
    get get_by_course_path, params: {course: [@courses[0].id, @courses[1].id], format: :json}
    assert_response :success
  end

  test "should get all courses when getting multiple get_by_course" do
    competencies =  [Competency.create!(competency_group_id: @groups[0].id, description: "It goes like this", course: @courses[1]),
                     Competency.create!(competency_group_id: @groups[0].id, description: "a fourth a fifth", course: @courses[1]),
                     Competency.create!(competency_group_id: @groups[1].id, description: "a minor fall a major lift", course: @courses[1]),
                     Competency.create!(competency_group_id: @groups[1].id, description: "a baffled king composing hallelujah", course: @courses[01])]

    get get_by_course_path, params: {course: [@courses[0].id, @courses[1].id], format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result

    assert_equal 2,  json_result.size
    course1data = json_result.find { |c| c['id'] == @courses[0].id}
    assert course1data
    assert course1data['groups']
    assert_equal 2, course1data['groups'].size
    assert  course1data['groups'].find { |g| g['title'] == 'Group 1' }
    assert course1data['groups'].find { |g| g['title'] == 'Group 2' }

    course2data = json_result.find { |c| c['id'] == @courses[1].id}
    assert course2data
    assert course2data['groups']
    assert_equal 2, course2data['groups'].size
    g1 = course2data['groups'].find { |g| g['title'] == 'Group 1' }
    g2 = course2data['groups'].find { |g| g['title'] == 'Group 2' }
    assert g1
    assert g2

    assert g1['competencies'].find { |c| c['description'] == 'It goes like this' }
    assert g1['competencies'].find { |c| c['description'] == 'a fourth a fifth' }
    assert g2['competencies'].find { |c| c['description'] == 'a minor fall a major lift' }
    assert g2['competencies'].find { |c| c['description'] == 'a baffled king composing hallelujah' }

  end

  test "should get get_by_assessment" do
    assessment = Assessment.create!(name: 'A1', assessment_type: AssessmentType.create!(name: 'T1'), assessment_scoring_type: AssessmentScoringType.create!(name: 'ST1'), user: @user, courses: @courses)
    get get_by_assessment_path(assessment), params: {format: :json}
    assert_response :success
  end

  test "should get all the competencies for the assessment" do
    competencies =  [Competency.create!(competency_group_id: @groups[0].id, description: "It goes like this", course: @courses[1]),
                     Competency.create!(competency_group_id: @groups[0].id, description: "a fourth a fifth", course: @courses[1]),
                     Competency.create!(competency_group_id: @groups[1].id, description: "a minor fall a major lift", course: @courses[1]),
                     Competency.create!(competency_group_id: @groups[1].id, description: "a baffled king composing hallelujah", course: @courses[01])]
    assessment = Assessment.create!(name: 'A1', assessment_type: AssessmentType.create!(name: 'T1'), assessment_scoring_type: AssessmentScoringType.create!(name: 'ST1'), user: @user, courses: @courses)
    get get_by_assessment_path(assessment), params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result

    assert_equal 2,  json_result.size
    course1data = json_result.find { |c| c['id'] == @courses[0].id}
    assert course1data
    assert course1data['groups']
    assert_equal 2, course1data['groups'].size
    assert  course1data['groups'].find { |g| g['title'] == 'Group 1' }
    assert course1data['groups'].find { |g| g['title'] == 'Group 2' }

    course2data = json_result.find { |c| c['id'] == @courses[1].id}
    assert course2data
    assert course2data['groups']
    assert_equal 2, course2data['groups'].size
    g1 = course2data['groups'].find { |g| g['title'] == 'Group 1' }
    g2 = course2data['groups'].find { |g| g['title'] == 'Group 2' }
    assert g1
    assert g2

    assert g1['competencies'].find { |c| c['description'] == 'It goes like this' }
    assert g1['competencies'].find { |c| c['description'] == 'a fourth a fifth' }
    assert g2['competencies'].find { |c| c['description'] == 'a minor fall a major lift' }
    assert g2['competencies'].find { |c| c['description'] == 'a baffled king composing hallelujah' }

  end

end
