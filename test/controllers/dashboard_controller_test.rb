require 'test_helper'
require 'test_data_factory'
load 'report'

class DashboardControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    # Create the courses and standards and competencies for the courses:
    @courses = [Course.create!(title: "Course 1"),Course.create!(title: "Course 2")]
    @groups = [CompetencyGroup.create!(title: "Group 1"),CompetencyGroup.create!(title: "Group 2") ]
    @competency1 = Competency.create!(competency_group_id: @groups[0].id, description: "demonstrate knowledge", course: @courses[0])
    @competency2 = Competency.create!(competency_group_id: @groups[0].id, description: "do some things", course: @courses[0])
    @competency3 = Competency.create!(competency_group_id: @groups[1].id, description: "be happy", course: @courses[0])
    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "be kind", course: @courses[0])

    # First course will assess all the standards for content and content2, which are: standard, standard2, standard3, standard4
    # # However, the teacher will only create tasks that use standard, standard 2, standard 8.
    @content1 = Content.create!(name: "Content 1", course: @courses[0], description: "Learn things")
    @content2 = Content.create!(name: "Content 2", course: @courses[0], description: "Another")
    # Create standards for content 1 and 2
    @standard = Standard.create!(content: @content1, description: "stan the man")
    @standard2 = Standard.create!(content: @content1, description: "stans a fan")
    @standard3 = Standard.create!(content: @content2, description: "obsequeiously")
    @standard4 = Standard.create!(content: @content2, description: "out standing")

    # Second course is expected to assess all the standards for content3 and content4, which are: standards 5, 6, 7, 8
    @content3 = Content.create!(name: "Content 3", course: @courses[1], description: "Big mucky muck")
    @content4 = Content.create!(name: "Content 4", course: @courses[1], description: "Another")
    # Create standards for content 3 and 4:
    @standard5 = Standard.create!(content: @content3, description: "supah dupah")
    @standard6 = Standard.create!(content: @content3, description: "gary coopah")
    @standard7 = Standard.create!(content: @content4, description: "puttin on the ritz")
    @standard8 = Standard.create!(content: @content4, description: "fred estaire, sounds like a star")

    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    TestDataFactory.setDefaultUser(@user)
    @sections = [Section.create!(name: 'Section 1', user_id: @user.id, courses: @courses), #sections[0] is in both courses
                 Section.create!(name: 'Section 2', user_id: @user.id, courses: [@courses[0]])] #sections[1] is only in the first course

    sign_in @user

    @type = AssessmentType.create!(name: 'badabing', description: 'testing is for lugers')
    @scoring_type = AssessmentScoringType.create!(name: 'badaboom')
    @assessment = Assessment.new(name: 'First Assessment', user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type)
    @tasks = [Task.create!(name:'Question 1', assessment: @assessment),Task.create!(name:'Question TWO', assessment: @assessment)]
    # Each task has one competency from each group:
    @tasks[0].competencies=[@competency1, @competency3]
    @tasks[1].competencies=[@competency2, @competency4]

    # The teacher has only created tasks that use standards 1, 2, 3, 4, and 8.
    # Thus, content 1 is 100%, content 2 is 100%, content 3 is 0%, and content 4 is 50% 'created'
    TaskStandard.create!(task: @tasks[0], standard: @standard, level: 'M')
    TaskStandard.create!(task: @tasks[0], standard: @standard2, level: 'L')
    TaskStandard.create!(task: @tasks[1], standard: @standard2, level: 'H')
    TaskStandard.create!(task: @tasks[1], standard: @standard8, level: 'M')
    TaskStandard.create!(task: @tasks[1], standard: @standard3, level: 'L')
    TaskStandard.create!(task: @tasks[1], standard: @standard4, level: 'L')
    # In rails, how do I prevent someone referencing a competency that doesn't belong to the assessment's courses/sections?

    # All these task_standards are done within one test, used for both sections
    @assessment.tasks = @tasks
    @assessment.sections = @sections
    @assessment.save

    @xena = TestDataFactory.createStudent(name: "Xena", unique_id: "Princess")
    Enrollment.create!(student: @xena, section: @sections[0])

    # The teacher has observed standards 1, 2, 3, and 8
    # Thus content 1 is 100%, content 2 is 50%, content 3 is 0%, and content 4 is 50% observed:
    StandardObservation.create!(student: @xena, task: @tasks[0], user: @user, standard: @standard, level: 'M', score: 1)
    StandardObservation.create!(student: @xena, task: @tasks[1], user: @user, standard: @standard2, level: 'H', score: 1)
    StandardObservation.create!(student: @xena, task: @tasks[1], user: @user, standard: @standard8, level: 'M', score: 1)
    StandardObservation.create!(student: @xena, task: @tasks[1], user: @user, standard: @standard3, level: 'L', score: 1)
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "should determine percentages of standards in assessments and observations within sections for logged-in user" do
    params = { :format => :json }
    get dashboard_list_path params
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result

    course_id_set = [@courses[1].id.to_s, @courses[0].id.to_s].to_set
    assert_equal course_id_set, json_result.keys.to_set

    # Content 1 and 2 are 100% created, content 1 is 100% observed, content 2 is 50% observed:
    course_sections = json_result[@courses[0].id.to_s]['sections']
    section_fake = course_sections[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content1.id }
    assert_equal @content1.name, content['name']
    assert_equal '100', content['percent_included']
    assert_equal '100', content['percent_observed']

    content = fake_stats.find { |stats| stats['id'] === @content2.id }
    assert_equal @content2.name, content['name']
    assert_equal '100', content['percent_included']
    assert_equal '50', content['percent_observed']

    # Content 1 and 2 are the same here because the test was shared.
    # But, the student was only enrolled in the first section, so there should be no observation show up here:
    section_fake_2 = course_sections[@sections[1].id.to_s]
    fake_stats_2 = section_fake_2['content_stats']
    assert_equal 2, fake_stats.length
    content = fake_stats_2.find { |stats| stats['id'] === @content1.id }
    assert_equal @content1.name, content['name']
    assert_equal '100', content['percent_included']
    assert_equal '0', content['percent_observed']

    content = fake_stats_2.find { |stats| stats['id'] === @content2.id }
    assert_equal @content2.name, content['name']
    assert_equal '100', content['percent_included']
    assert_equal '0', content['percent_observed']

    # The second course only has one section.
    # Content 3 should be 0 % created and observed.  Content 4 should be 50% created and observed.
    course_sections_2 = json_result[@courses[1].id.to_s]['sections']
    section_fake = course_sections_2[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    assert_equal 2, fake_stats.length
    content = fake_stats.find { |stats| stats['id'] === @content3.id }
    assert_equal @content3.name, content['name']
    assert_equal '0', content['percent_included']
    assert_equal '0', content['percent_observed']

    content = fake_stats.find { |stats| stats['id'] === @content4.id }
    assert_equal @content4.name, content['name']
    assert_equal '50', content['percent_included']
    assert_equal '50', content['percent_observed']

  end

  test "should determine percentages of created and observed competencies in the competency_groups for logged-in user" do

    # all competencies are used in tasks, but only for the first course, which is used in both sections.
    # Xena is only enrolled in the first section, so only the first section should show up with observations on competencies
    @c1 = CompetencyObservation.create!(student: @xena, task: @tasks[0], user: @user, competency:@competency1, level: '4')
    params = { :format => :json }
    get dashboard_list_path params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    # Section 1: (@sections[0])This is the only section that should have observations
    # Groups 1 and 2 are 50% created, and Group 1 is 50% observed for section 1:
    course_sections = json_result[@courses[0].id.to_s]['sections']
    section_fake = course_sections[@sections[0].id.to_s]

    fake_stats = section_fake['competency_stats']
    group = fake_stats[@groups[0].id.to_s]
    assert_equal @groups[0].title, group['title']
    assert_equal '100', group['percent_included']
    assert_equal '50', group['percent_observed']

    group = fake_stats[@groups[1].id.to_s]
    assert_equal @groups[1].title, group['title']
    assert_equal '100', group['percent_included']
    assert_equal '0', group['percent_observed']

    section_fake_2 = course_sections[@sections[1].id.to_s]
    fake_stats = section_fake_2['competency_stats']
    group = fake_stats[@groups[0].id.to_s]
    assert_equal @groups[0].title, group['title']
    assert_equal '100', group['percent_included']
    assert_equal '0', group['percent_observed']

    group = fake_stats[@groups[1].id.to_s]
    assert_equal @groups[1].title, group['title']
    assert_equal '100', group['percent_included']
    assert_equal '0', group['percent_observed']

    # Zero competencies associated for the second course

  end

  test "should get detailed counts for each standard" do
    params = { :format => :json }
    get dashboard_list_path params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    # print json_result

    # Section 1: (@sections[0])This is the only section that should have observations
    # Groups 1 and 2 are 50% created, and Group 1 is 50% observed for section 1:
    course_sections = json_result[@courses[0].id.to_s]['sections']
    section_fake = course_sections[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content1.id }
    assert_equal @content1.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard.id }
    assert_equal 0, standard_details['l_count']
    assert_equal 1, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    standard_details = details.find { |detail| detail['id'] == @standard2.id }
    assert_equal 1, standard_details['l_count']
    assert_equal 0, standard_details['m_count']
    assert_equal 1, standard_details['h_count']

    content = fake_stats.find { |stats| stats['id'] === @content2.id }
    assert_equal @content2.name, content['name']
    details = content['details']
    assert details
    assert_equal 2, details.size

    standard_details = details.find { |detail| detail['id'] == @standard3.id }
    assert_equal 1, standard_details['l_count']
    assert_equal 0, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    standard_details = details.find { |detail| detail['id'] == @standard4.id }
    assert_equal 1, standard_details['l_count']
    assert_equal 0, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    section_fake = course_sections[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content3.id }
    assert_nil content

    course_sections = json_result[@courses[1].id.to_s]['sections']
    section_fake = course_sections[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content3.id }
    assert_equal @content3.name, content['name']
    details = content['details']
    standard_details = details.find { |detail| detail['id'] == @standard5.id }
    assert_equal 0, standard_details['l_count']
    assert_equal 0, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    standard_details = details.find { |detail| detail['id'] == @standard6.id }
    assert_equal 0, standard_details['l_count']
    assert_equal 0, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    # course_sections = json_result[@courses[1].id.to_s]['sections']
    section_fake = course_sections[@sections[1].id.to_s]

    assert_nil section_fake
    # fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content4.id }

    details = content['details']
    assert details
    assert_equal 2, details.size
    standard_details = details.find { |detail| detail['id'] == @standard7.id }
    assert_equal 0, standard_details['l_count']
    assert_equal 0, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    standard_details = details.find { |detail| detail['id'] == @standard8.id }
    assert_equal 0, standard_details['l_count']
    assert_equal 1, standard_details['m_count']
    assert_equal 0, standard_details['h_count']

    section_fake = course_sections[@sections[1].id.to_s]
    assert_nil section_fake
  end

  test 'should include standard observed averages for each section' do
    params = { :format => :json }
    get dashboard_list_path params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result

    # Section 1: (@sections[0])This is the only section that should have observations
    # Groups 1 and 2 are 50% created, and Group 1 is 50% observed for section 1:
    course_sections = json_result[@courses[0].id.to_s]['sections']
    section_fake = course_sections[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content1.id }
    assert_equal @content1.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard.id }
    assert_equal 70, standard_details['average']
    standard_details = details.find { |detail| detail['id'] == @standard2.id }
    assert_equal 90, standard_details['average']

    content = fake_stats.find { |stats| stats['id'] === @content2.id }
    assert_equal @content2.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard3.id }
    assert_equal 50, standard_details['average']
    standard_details = details.find { |detail| detail['id'] == @standard4.id }
    assert_equal 0, standard_details['average']

    section_fake = course_sections[@sections[1].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content3.id }
    assert_nil content

    content = fake_stats.find { |stats| stats['id'] === @content4.id }
    assert_nil content

    # need to test for courses[0] data for second section -- will all be zero because no one is enrolled in sections[1]

    content = fake_stats.find { |stats| stats['id'] === @content1.id }
    assert_equal @content1.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard.id }
    assert_equal 0, standard_details['average']
    standard_details = details.find { |detail| detail['id'] == @standard2.id }
    assert_equal 0, standard_details['average']

    content = fake_stats.find { |stats| stats['id'] === @content2.id }
    assert_equal @content2.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard3.id }
    assert_equal 0, standard_details['average']
    standard_details = details.find { |detail| detail['id'] == @standard4.id }
    assert_equal 0, standard_details['average']

    course_sections = json_result[@courses[1].id.to_s]['sections']
    section_fake = course_sections[@sections[0].id.to_s]
    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content3.id }
    assert_equal @content3.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard5.id }
    assert_equal 0, standard_details['average']
    standard_details = details.find { |detail| detail['id'] == @standard6.id }
    assert_equal 0, standard_details['average']

    fake_stats = section_fake['content_stats']
    content = fake_stats.find { |stats| stats['id'] === @content4.id }
    assert_equal @content4.name, content['name']
    details = content['details']
    assert details
    standard_details = details.find { |detail| detail['id'] == @standard7.id }
    assert_equal 0, standard_details['average']
    standard_details = details.find { |detail| detail['id'] == @standard8.id }
    assert_equal 70, standard_details['average']

  end

  test 'should get the mode for each competency for a section when mode count <= 5' do
    @farra = TestDataFactory.createStudent(name: "Farra", unique_id: "!")
    @johnarra = TestDataFactory.createStudent(name: "joh", unique_id: "!!")
    @barra = TestDataFactory.createStudent(name: "Barra", unique_id: "!!!")

    observations = [CompetencyObservation.create!(student: @xena, task: @tasks[0], user: @user, competency:@competency1, level: '4'),
    CompetencyObservation.create!(student: @farra, task: @tasks[0], user: @user, competency:@competency1, level: '3'),
    CompetencyObservation.create!(student: @barra, task: @tasks[0], user: @user, competency:@competency1, level: '4'),
    CompetencyObservation.create!(student: @johnarra, task: @tasks[0], user: @user, competency:@competency1, level: '3')]

    Enrollment.create!(student: @farra, section: @sections[0])
    Enrollment.create!(student: @johnarra, section: @sections[0])
    Enrollment.create!(student: @barra, section: @sections[0])

    result = Report.competency_mode(CompetencyObservation.where(id: observations.map(&:id)).load)
    assert_equal 3.5, result

  end

  test 'should get the mode for last 50% of competency when 5 < count < 11' do
    students = create_enrolled_users(@sections[0], 11)
    observations = [
        CompetencyObservation.create!(student: students[0], task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: students[1], task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: students[2], task: @tasks[0], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: students[3], task: @tasks[0], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: students[4], task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: students[5], task: @tasks[0], user: @user, competency:@competency1, level: '1'), # ^^ not counted
        CompetencyObservation.create!(student: students[6], task: @tasks[0], user: @user, competency:@competency1, level: '3'), # counted
        CompetencyObservation.create!(student: students[7], task: @tasks[0], user: @user, competency:@competency1, level: '3'), # counted
        CompetencyObservation.create!(student: students[8], task: @tasks[0], user: @user, competency:@competency1, level: '3'), # counted
        CompetencyObservation.create!(student: students[9], task: @tasks[0], user: @user, competency:@competency1, level: '4'), # counted
        CompetencyObservation.create!(student: students[10], task: @tasks[0], user: @user, competency:@competency1, level: '4'),# counted
    ]
    # Ensure the timestamops for the last 5 have enough of a difference to be sorted properly:
    observations[-1].assessed_at = Time.now + 500
    observations[-2].assessed_at = Time.now + 150
    observations[-3].assessed_at = Time.now + 250
    observations[-4].assessed_at = Time.now + 10
    observations[-5].assessed_at = Time.now + 50
    observations[-1].save
    observations[-2].save
    observations[-3].save
    observations[-4].save
    observations[-5].save
    # observations =  CompetencyObservation.where(student_id: students.map(&:id), task_id: @tasks[0], competency_id: @competency1.id)
    result = Report.competency_mode(CompetencyObservation.where(id: observations.map(&:id)).order(assessed_at: :desc).load)
    assert_equal 3, result

  end

  test 'should get the mode for last 25% of competencies when count >= 11' do
    dashboard = Dashboard.new
    students = create_enrolled_users(@sections[0], 12)
    observations = [
        CompetencyObservation.create!(student: students[0], task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: students[1], task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: students[2], task: @tasks[0], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: students[3], task: @tasks[0], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: students[4], task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: students[5], task: @tasks[0], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: students[6], task: @tasks[0], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: students[7], task: @tasks[0], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: students[8], task: @tasks[0], user: @user, competency:@competency1, level: '3'), # ^^ not counted
        CompetencyObservation.create!(student: students[9], task: @tasks[0], user: @user, competency:@competency1, level: '4'), # counted
        CompetencyObservation.create!(student: students[10], task: @tasks[0], user: @user, competency:@competency1, level: '4'),# counted
        CompetencyObservation.create!(student: students[11], task: @tasks[0], user: @user, competency:@competency1, level: '3') # counted
    ]

    # Ensure the timestamops for the last 5 have enough of a difference to be sorted properly:
    observations[-1].assessed_at = Time.now + 500
    observations[-2].assessed_at = Time.now + 150
    observations[-3].assessed_at = Time.now + 250
    observations[-4].assessed_at = Time.now + 10
    observations[-5].assessed_at = Time.now + 50
    observations[-1].save
    observations[-2].save
    observations[-3].save
    observations[-4].save
    observations[-5].save

    result = Report.competency_mode(CompetencyObservation.where(id: observations.map(&:id)).order(assessed_at: :desc).load)
    assert_equal 4, result

  end
  
  def create_enrolled_users(section, number_of_students)
    students = []
   (0..number_of_students).each {
     stu = TestDataFactory.createStudent(name: rand_string(15), unique_id: rand_string(15))
     students.push(stu)
     Enrollment.create!(student: stu, section: section)
   }
    students
  end

  def rand_string(length)
    if length.nil? || length < 0 || length > 50
      len = 50
    else
      len = length
    end

    o = [('a'..'z'), ('A'..'Z'), ('0'..'9')].map(&:to_a).flatten
    return (0...len).map { o[rand(o.length)] }.join
  end

end
