require 'test_helper'
require 'test_data_factory'

class SectionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    TestDataFactory.setDefaultUser(@user)
    @section = Section.create!(name: 'fake', user_id: @user.id)
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "should post new section" do
    params = { :name => "A new section", format: :json }
    post sections_new_url (params)

    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert_not_nil json_result['id']
    assert_equal params[:name], json_result['name']
    assert_equal @user.id, json_result['user_id']
  end

  test "should find sections for user" do

    get find_sections_for_user_path ,  params: {format: :json}

    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)
    assert_equal json_result.size, 1
    assert_equal json_result[0]['name'], 'fake'
  end

  test "should post new section with courses" do
    courses = [Course.create!(title: "Test course", grade: '9', subject: 'math'), Course.create!(title: "Another Test course", grade: '10', subject: 'math') ]
    params = { :user_id => @user.id, :name => "A new section", format: :json, courses: [courses[0].title, courses[1].title]}
    post sections_new_url (params)

    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert_not_nil json_result['id']
    assert_equal params[:name], json_result['name']
    assert_equal @user.id, json_result['user_id']
    assert_equal 2, json_result['courses'].size
    assert_includes [json_result['courses'][0]['title'],json_result['courses'][1]['title']], courses[0].title
    assert_includes [json_result['courses'][0]['title'],json_result['courses'][1]['title']], courses[1].title
  end

  test "should save with enrollments" do
    students = TestDataFactory.createStudents([{ name: "joh", unique_id: "ho" }, { name:"su", unique_id:"so" }]).map(&:id)
    params = { students: students, :user_id => @user.id, :name => "Enrolled section", format: :json }
    post sections_new_url (params)

    assert_response :success
    json_result = JSON.parse(response.body)

    section = Section.find(json_result['id'])
    assert section.enrollments
    assert section.students

    enrolled_students = section.students.map { |s| s.id }
    assert_includes enrolled_students, students[0]
    assert_includes  enrolled_students,students[1]

    assert json_result['students']
    assert_includes students, json_result['students'][0]['id']
    assert_includes students, json_result['students'][1]['id']
  end

  test "should fetch sections for user with enrollments" do
    stu = TestDataFactory.newStudent(name: 'stu', unique_id: 'dent')
    sec = Section.create(name: "Section", user_id: @user.id)
    enrollment = Enrollment.create!(student: stu, section: sec)


    get find_sections_for_user_path ,  params: {format: :json}

    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)
    # 2 because it includes the fixture-generated one

    assert_equal json_result.size, 2
    the_section = json_result.find { |s| s['id'] == sec.id }
    assert the_section
    assert the_section['students']
    assert_equal stu.id, the_section['students'][0]['id']
  end

  test "should fetch sections for student user with sections" do
    stu = TestDataFactory.newStudent(name: 'stu', unique_id: 'dent', email: 'stu@example.com')
    sec = Section.create(name: "Section", user_id: @user.id)
    Enrollment.create!(student: stu, section: sec)
    stu_user = TestDataFactory.createUser(roles: [:student], students: [stu], name: 'stu', email: 'stu@example.com')
    sign_in stu_user

    get find_sections_for_student_user_path ,  params: {format: :json}

    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert_equal 1, json_result.size
    the_section = json_result[0]
    assert the_section['students']
    assert_equal stu.id, the_section['students'][0]['id']
  end

  test "should update sections for user with enrollments" do
    stu = TestDataFactory.createStudent(name: 'stu', unique_id: 'dent')
    assert stu.id
    sec = Section.new(name: "Section", user_id: @user.id)
    courses = [Course.create!(title: "Test course", grade: '9', subject: 'math')]
    sec.courses = courses
    sec.save

    params = { students: [stu.id], user: @user.id, courses: [courses[0].title], name: "Better Name", format: :json }

    post sections_update_url(@section), params: params

    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    json_courses = json_result['courses']

    assert_equal courses[0].id, json_courses[0]['id']
    assert_equal json_result['name'], "Better Name"
    assert_equal json_result['students'][0]['id'], stu.id
    assert_empty json_result['assessments']
  end

  test "should delete sections with no assessments" do
    sec = Section.create!(name: "Deleteable section", user_id: @user.id)
    assert Section.find(sec.id)

    courses = [Course.create!(title: "Test course", grade: '9', subject: 'math')]
    sec.courses = courses

    params = { format: :json }

    delete sections_delete_url(sec.id), params: params

    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert_empty Section.where(id: sec.id)
    assert_equal 'Successfully deleted',json_result['msg']
  end

  test "should not delete sections with assessments" do
    sec = Section.create!(name: "NON deleteable section", user_id: @user.id)
    assert Section.find(sec.id)

    courses = [Course.create!(title: "Test course", grade: '9', subject: 'math')]
    sec.courses = courses
    asmt = Assessment.create!(name:"Test 1", user: @user, assessment_type: AssessmentType.create!(name: "TYPE !"), assessment_scoring_type: AssessmentScoringType.create!(name: 'S TYPE !'))
    sec.assessments = [asmt]
    sec.save

    params = { format: :json }

    delete sections_delete_url(sec.id), params: params

    # TODO: change the response type!
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert Section.find(sec.id)
    assert_equal "Unable to delete #{sec.id}",json_result['msg']
  end

  test "should delete associated enrollments for sections with students" do
    sec = Section.create!(name: "deleteable section", user_id: @user.id)
    assert Section.find(sec.id)

    stu = TestDataFactory.createStudent(name: 'stu', unique_id: 'dent')
    assert stu.id

    courses = [Course.create!(title: "Test course", grade: '9', subject: 'math')]
    sec.courses = courses
    sec.students = [stu]
    sec.save

    assert_not_empty Enrollment.where(section: sec)

    params = { format: :json }

    delete sections_delete_url(sec.id), params: params

    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    assert_empty Section.where(id: sec.id)
    assert Student.find(stu.id)
    assert_empty Enrollment.where(section: sec)
    assert_empty Enrollment.where(student: stu)
    assert_equal 'Successfully deleted',json_result['msg']
  end

  test 'it should fetch the contents for the section' do
    sec = Section.create!(name: "bisection", user_id: @user.id)
    assert Section.find(sec.id)

    stu = TestDataFactory.createStudent(name: 'stu', unique_id: 'dent')
    assert stu.id

    course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    contents = [Content.create!(name: 'Topic one', course: course), Content.create!(name: 'Topic two', course: course)]

    course.contents = contents
    course.sections = [sec]
    sec.courses = [course]
    sec.save!
    course.save!

    get section_contents_url(id: sec.id), params: { format: :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result

    assert json_result[0]['title'] == course.title
    assert_equal 2,  json_result[0]['contents'].length
  end

  test 'fetches contents for multiple course sections' do
    sec = Section.create!(name: "intersection", user_id: @user.id)
    assert Section.find(sec.id)

    stu = TestDataFactory.createStudent(name: 'stu', unique_id: 'dent')
    assert stu.id

    courses = [Course.create!(title: "Course 1", grade: '9', subject: 'math'),
              Course.create!(title: "Course 2", grade: '10', subject: 'math')]
    contents_1 = [Content.create!(name: 'Topic one', course: courses[0]), Content.create!(name: 'Topic two', course: courses[0])]
    contents_2 = [Content.create!(name: 'Topic three', course: courses[0]), Content.create!(name: 'Topic four', course: courses[0])]

    courses[0].contents = contents_1
    courses[1].contents = contents_2
    sec.courses = courses
    sec.save!

    get section_contents_url(id: sec.id), params: { format: :json }
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result

    course_titles = json_result.map { |c| c['title'] }
    assert_includes course_titles, courses[0].title
    assert_includes course_titles, courses[1].title

    json_contents = json_result.find { |c| c['title'] == courses[0].title }['contents'].map { |t| t['name']}

    assert_includes json_contents, contents_1[0].name
    assert_includes json_contents, contents_1[1].name

    json_contents = json_result.find { |c| c['title'] == courses[1].title }['contents'].map { |t| t['name']}
    assert_includes json_contents, contents_2[0].name
    assert_includes json_contents, contents_2[1].name
  end
end
