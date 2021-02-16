require 'test_helper'
require 'test_data_factory'

class ReportsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @section = Section.create!(name: 'fake', user_id: @user.id)
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user
    TestDataFactory.setDefaultUser(@user)

    @stu = TestDataFactory.createStudent(name: "stu", unique_id: "dent")

    @course = Course.create!(title: "Math 9")
    @section = Section.create!(name: "Section of Test", user_id: @user.id)
    @section.courses = [@course]
    @section.students = [@stu]

    @content = Content.create!(name: "connie", description: "holy", course: @course)
    @stan = Standard.create!(content: @content, description:"Know things")
    @competency = Competency.create!(course: @course, description: "The first competency", competency_group: CompetencyGroup.create!(title:"Hah") )

    @type = AssessmentType.create!(name: "Huh", description: "aint that funky now")
    @scoring_type = AssessmentScoringType.create!(name: "Yup")
    @assessment = Assessment.create!(name: "hello", assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)
    @task = Task.create!(name: 'q1', assessment: @assessment)

    @standard2 = Standard.create!(content: @content, description:"Know even more things")
    @task2 = Task.create!(name: 'q2', assessment: @assessment)
    @competency2 = Competency.create!(course: @course, description: "The second competency ", competency_group: CompetencyGroup.find_by_title("Hah"))

    @section.assessments = [@assessment]
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test 'section_content_overview should get marks for user\'s section' do
    get reports_section_overview_path(@section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']
  end

  test 'section content overview should get marks only for enrolled student' do
    new_section = Section.create!(name: "Section Two", user_id: @user.id)
    new_section.courses = [@course]
    wabbit = TestDataFactory.createStudent(name: "second", unique_id: "student")
    new_section.students = [wabbit]
    new_assessment = Assessment.create!(name: "a test for section two", assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)
    new_section.assessments.push(new_assessment)
    tasks = [ Task.create!(name: 'dance', assessment: new_assessment), Task.create!(name: 'q5', assessment: new_assessment)]
    TaskStandard.create!(task: tasks[0], standard: @stan, level: 'M')
    TaskStandard.create!(task: tasks[1], standard: @standard2, level: 'H')
    # wabbit will have 2 standards that create an average of 80% (1M => 70, 1H => 90, avg = 80)

    TaskStandard.create!(task: @task2, standard: @standard2, level: 'L')
    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: @stu, level: 'L', score: 1)
    # stu's mark won't be counted for the section, because he's not enrolled, if it were counted, the number of marks
    # would be 2.

    # Nothing observed for stu in new_section, even though it's the same course:
    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: wabbit, level: 'L', score: 1)
    StandardObservation.create!(standard: @stan, task: @task, user: @user, student: wabbit, level: 'L', score: 1)
    StandardObservation.create!(standard: @standard2, task: tasks[1], user: @user, student: wabbit, level: 'H', score: 1)
    StandardObservation.create!(standard: @stan, task:tasks[0], user: @user, student: wabbit, level: 'M', score: 1)
    get reports_section_overview_path(new_section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']

    course_marks = json_result['section_content_overview'][0]['course_marks']
    assert course_marks

    assert_equal 1, course_marks.size
    student_marks = course_marks[0]['content_marks']
    assert student_marks
    assert_equal 1, student_marks.size
    assert_equal 80, student_marks[0]['mark']
  end

  test 'section content overview should get all enrolled student marks' do
    wabbit = TestDataFactory.createStudent(name: "bugs bunny", unique_id: "student")
    TaskStandard.create!(task: @task2, standard: @standard2, level: 'L')
    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: wabbit, level: 'L', score: 1)
    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: @stu, level: 'L', score: 1)
    @section.students.push(wabbit)

    get reports_section_overview_path(@section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']

    course_marks = json_result['section_content_overview'][0]['course_marks']
    assert course_marks
    assert_equal 1, course_marks.size
    student_marks = course_marks[0]['content_marks']
    assert student_marks
    assert_equal 2, student_marks.size

  end

  test 'section content overview should include only the  marks from assessments which the student participated' do
    new_assessment = Assessment.create!(name: 'the other test that was missed by stu', assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)
    wabbit = TestDataFactory.createStudent(name: 'bugs bunny', unique_id: 'student')
    # have to associate the tasks with standards for the observations to be counted, because the association determines the difficulty:
    TaskStandard.create!(task: @task, standard: @stan, level: 'M')
    TaskStandard.create!(task: @task2, standard: @standard2, level: 'H')
    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: @stu, level: 'H', score: 1)
    StandardObservation.create!(standard: @stan, task: @task, user: @user, student: @stu, level: 'M', score: 1)
    CompetencyObservation.create!(competency: @competency2, task: @task2, student: @stu, user: @user, level: 4 )
    CompetencyObservation.create!(competency: @competency, task: @task2, student: @stu, user: @user, level: 2 )
    next_content = Content.create!(name: 'next content', description: 'holy', course: @course)
    s3 = Standard.create!(content: next_content, description: 'Know more things')
    s4 = Standard.create!(content: next_content, description: 'Know more things')
    s5 = Standard.create!(content: @content, description: 'Know more things')
    s6 = Standard.create!(content: @content, description: 'Know more things')
    # enroll Bugsy in the section:
    @section.students.push(wabbit)
    @section.assessments.push(new_assessment)
    tasks = [ Task.create!(name: 'dance', assessment: new_assessment), Task.create!(name: 'q5', assessment: new_assessment)]
    TaskStandard.create!(task: tasks[0], standard: s3, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s4, level: 'H')
    TaskStandard.create!(task: tasks[0], standard: s5, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s6, level: 'H')

    StandardObservation.create!(standard: s3, task: tasks[0], user: @user, student: wabbit, level: 'H', score: 1)
    StandardObservation.create!(standard: s4, task:tasks[1], user: @user, student: wabbit, level: 'H', score: 1)

    StandardObservation.create!(standard: s5, task: tasks[0], user: @user, student: @stu, level: 'H', score: 1)
    StandardObservation.create!(standard: s6, task: tasks[1], user: @user, student: @stu, level: 'H', score: 1)

    get reports_section_overview_path(@section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']

    # print "\n\n#{JSON.pretty_generate(json_result)}"
    course_marks = json_result['section_content_overview'][0]['course_marks']
    assert course_marks
    assert_equal 2, course_marks.size
    student_marks = course_marks[0]['content_marks']
    assert student_marks
    assert_equal 2, student_marks.size

    student_marks = course_marks[1]['content_marks']
    assert student_marks
    assert_equal 2, student_marks.size
  end

  test 'section content overview should get zero on a content if a student did an assessment but missed getting a mark for the content on the test.' do

    new_assessment = Assessment.create!(name: 'the other test that was missed by stu', assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)
    wabbit = TestDataFactory.createStudent(name: 'bugs bunny', unique_id: 'student')
    next_content = Content.create!(name: 'next content', description: 'holy', course: @course)
    s3 = Standard.create!(content: next_content, description: 'Know more things')
    s4 = Standard.create!(content: next_content, description: 'Know more things')
    s5 = Standard.create!(content: @content, description: 'Know more things')
    s6 = Standard.create!(content: @content, description: 'Know more things')
    # enroll Bugsy in the section:
    @section.students.push(wabbit)
    @section.assessments.push(new_assessment)
    tasks = [ Task.create!(name: 'dance', assessment: new_assessment), Task.create!(name: 'q5', assessment: new_assessment)]
    TaskStandard.create!(task: tasks[0], standard: s3, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s4, level: 'H')
    TaskStandard.create!(task: tasks[0], standard: s5, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s6, level: 'H')
    # have to associate the tasks with standards for the observations to be counted, because the association determines the difficulty:
    TaskStandard.create!(task: @task, standard: @stan, level: 'M')
    TaskStandard.create!(task: @task2, standard: @standard2, level: 'H')


    CompetencyObservation.create!(competency: @competency2, task: @task2, student: @stu, user: @user, level: 4 )
    CompetencyObservation.create!(competency: @competency, task: @task2, student: @stu, user: @user, level: 2 )

    StandardObservation.create!(standard: s3, task: tasks[0], user: @user, student: wabbit, level: 'H', score: 1) # wabbit gets an H 90% in one standard,
    StandardObservation.create!(standard: s4, task:tasks[1], user: @user, student: wabbit, level: 'H', score: 1) # wabbit gets an H in another standard,
    # Wabbit's mark for next_content will be 90%

    StandardObservation.create!(standard: s5, task: tasks[0], user: @user, student: @stu, level: 'H', score: 1) # stu gets an H in one standard, 90%
    StandardObservation.create!(standard: s6, task: tasks[1], user: @user, student: @stu, level: 'H', score: 1) # stu gets H in another standard, 90% for @content
    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: @stu, level: 'H', score: 1) # stu gets an H for another standard in @content.
    StandardObservation.create!(standard: @stan, task: @task, user: @user, student: @stu, level: 'M', score: 1) #stu gets an M, so 70% for this standard
    # Stu's mark for @content will be 90 + 90 + 90 + 70 /4 = 85

    get reports_section_overview_path(@section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']

    course_marks = json_result['section_content_overview'][0]['course_marks']
    assert course_marks
    assert_equal 2, course_marks.size
    student_marks = course_marks.find { |mark| mark['id'] == @content.id }['content_marks']

    # as noted above, we expect 85 for stu's mark on @content
    stu_mark1 = student_marks.find { |mark| mark['id'] == @stu.id }
    assert stu_mark1
    assert_equal 85, stu_mark1['mark']

    # wabbit was not marked on @content ... thus nil.
    wabbit_mark1 = student_marks.find{ |mark| mark['id'] == wabbit.id }
    assert wabbit_mark1
    assert_nil wabbit_mark1['mark']

    # stu's mark for next_content... he wasn't marked in next_content so nil
    student_marks = course_marks.find { |mark| mark['id'] == next_content.id }['content_marks']
    stu_mark2 = student_marks.find { |mark| mark['id'] == @stu.id }
    assert stu_mark2
    assert_nil stu_mark2['mark']

    # wabbit's mark for next_content should be 90, as noted above.
    wabbit_mark2 = student_marks.find{ |mark| mark['id'] == wabbit.id }
    assert wabbit_mark2
    assert_equal 90, wabbit_mark2['mark']

    averages = json_result['section_content_overview'][0]['averages']
    stu_index = student_marks.index { |student| student['id'] == @stu.id }
    wab_index = student_marks.index { |student| student['id'] == wabbit.id }

    assert_equal 85.0, averages[stu_index]
    assert_equal 90.0, averages[wab_index]
  end

  test 'section content overview should include only the marks from requested topics' do

    StandardObservation.create!(standard: @standard2, task: @task2, user: @user, student: @stu, level: 'H', score: 1)
    included_content = Content.create!(name: 'included content', description: 'holy', course: @course)
    s3 = Standard.create!(content: included_content, description: 'next content Know things')
    s5 = Standard.create!(content: @content, description: '@content know things')
    tasks = [ Task.create!(name: 'dance', assessment: @assessment), Task.create!(name: 'q5', assessment: @assessment)]
    StandardObservation.create!(standard: s3, task: tasks[0], user: @user, student: @stu, level: 'H', score: 1)
    StandardObservation.create!(standard: s5, task: tasks[0], user: @user, student: @stu, level: 'H', score: 1)

    # We get all if we don't specify, or if we specify all:
    get reports_section_overview_path(@section), params: { format: :json, topic: [included_content.id, @content.id] }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']
    section_marks = json_result['section_content_overview']
    assert section_marks
    # only one course:
    assert_equal 1, section_marks.size
    course_marks = section_marks[0]['course_marks']
    # but we have two contents included:
    assert_equal 2, course_marks.size

    # we will only get included_content specified:
    get reports_section_overview_path(@section), params: { format: :json, topic: [included_content.id] }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['section_content_overview']

    section_marks = json_result['section_content_overview']
    assert section_marks
    assert_equal 1, section_marks.size
    course_marks = section_marks[0]['course_marks']
    assert_equal 1, course_marks.size
    assert_equal included_content.name, course_marks[0]['name']
  end

  test 'section competency overview should get marks for user\'s section' do
    get reports_competency_overview_path(@section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    overview = json_result['section_competency_overview']
    assert overview
    assert_equal 1, overview.length
  end

  test 'section competency overview should get marks and competency group averages for many users' do
    wabbit = TestDataFactory.createStudent(name: 'bugs bunny', unique_id: 'smart')
    coyote = TestDataFactory.createStudent(name: 'Wiley Coyote', unique_id: 'clever')
    # enroll only the test students.  So long stu
    @section.students = [wabbit, coyote]
    groupon = CompetencyGroup.create!(title: 'falling rocks')
    competency = Competency.create!(course: @course, description: 'The latest greatest competency', competency_group: groupon )

    CompetencyObservation.create!(competency: @competency, task: @task2, student: wabbit, user: @user, level: 0 )
    CompetencyObservation.create!(competency: @competency, task: @task2, student: coyote, user: @user, level: 1 )
    CompetencyObservation.create!(competency: competency, task: @task2, student: wabbit, user: @user, level: 3 )
    CompetencyObservation.create!(competency: competency, task: @task2, student: coyote, user: @user, level: 2 )

    get reports_competency_overview_path(@section), params: { format: :json }
    json_result = JSON.parse(response.body)

    assert(json_result)

    overview = json_result['section_competency_overview']
    assert overview
    assert_equal 1, overview.length
    marks = overview[0]['course_competencies']
    assert_equal 2, marks.size
    group_mark = marks.find{ |group| group['id'] == groupon.id}
    assert group_mark['competency_mark']
    assert_equal 2, group_mark['competency_mark'].size
    assert_equal 3.0, group_mark['competency_mark'].find{ |mark| mark['id'] == wabbit.id }['mark']
    assert_equal 2.0, group_mark['competency_mark'].find{ |mark| mark['id'] == coyote.id }['mark']

    group_mark = marks.find{ |group| group['id'] == @competency2.competency_group.id}
    assert_equal 2, group_mark['competency_mark'].size
    assert_equal 0.0, group_mark['competency_mark'].find{ |mark| mark['id'] == wabbit.id }['mark']
    assert_equal 1.0, group_mark['competency_mark'].find{ |mark| mark['id'] == coyote.id }['mark']

    assert_equal [58, 58], overview[0]['averages']
  end

  test 'student competency report should get competency average for all time.' do
    groupon = CompetencyGroup.create!(title: 'falling rocks')
    competency = Competency.create!(course: @course, description: 'The latest greatest competency', competency_group: groupon )
    c2 = Competency.create!(course: @course, description: 'But wait, there\'s more', competency_group: groupon )

    CompetencyObservation.create!(competency: @competency2, task: @task2, student: @stu, user: @user, level: 4 )
    CompetencyObservation.create!(competency: @competency, task: @task2, student: @stu, user: @user, level: 2 )

    CompetencyObservation.create!(competency: c2, task: @task, student: @stu, user: @user, level: 0 )
    CompetencyObservation.create!(competency: c2, task: @task2, student: @stu, user: @user, level: 1 )
    CompetencyObservation.create!(competency: competency, task: @task2, student: @stu, user: @user, level: 3 )
    CompetencyObservation.create!(competency: competency, task: @task, student: @stu, user: @user, level: 4 )
    assert @stu
    assert @section
    get reports_student_competency_path(@stu, @section), params: {format: :json }
    json_result = JSON.parse(response.body)

    assert(json_result)
    overview = json_result['competency_report']
    assert overview
    assert_equal 1, overview.length
    marks = overview[0]['course_competencies']
    assert_equal 2, marks.size
    group_mark = marks.find{ |group| group['id'] == groupon.id}
    assert_equal 2.0, group_mark['competency_mark']
    assert_equal 67, group_mark['percentage']

    group_mark = marks.find{ |group| group['id'] == @competency.competency_group.id}
    assert_equal 83, group_mark['percentage']
    assert_equal 3.0, group_mark['competency_mark']

    assert_equal 75, overview[0]['course_average']
  end

  test 'student content report should get content marks and course averages for all time.' do
    new_assessment = Assessment.create!(name: 'the other test that was missed by stu', assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)
    wabbit = TestDataFactory.createStudent(name: 'bugs bunny', unique_id: 'student')
    course = Course.create!(title: "T")
    assert course.valid?
    next_content = Content.create!(name: 'next content', description: 'holy', course: course )
    another_content = Content.create!(name: 'another content', description: 'holy', course: course)
    section = Section.create!(user_id: @user.id, name: 'S1')
    section.courses = [course]
    s3 = Standard.create!(content: next_content, description: 'Know more things')
    s4 = Standard.create!(content: next_content, description: 'Know more things')
    s5 = Standard.create!(content: another_content, description: 'Know more things')
    s6 = Standard.create!(content: another_content, description: 'Know more things')
    # enroll Bugsy in the section:
    section.students = [wabbit]
    section.assessments.push(new_assessment)
    section.save
    tasks = [ Task.create!(name: 'dance', assessment: new_assessment), Task.create!(name: 'q5', assessment: new_assessment)]

    TaskStandard.create!(task: tasks[0], standard: s3, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s4, level: 'H')
    TaskStandard.create!(task: tasks[0], standard: s5, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s6, level: 'H')

    # one H observation for each standard, that's 90% each standard.
    StandardObservation.create!(standard: s3, task: tasks[0], user: @user, student: wabbit, level: 'H', score: 1)
    StandardObservation.create!(standard: s4, task:tasks[1], user: @user, student: wabbit, level: 'H', score: 1)

    get reports_student_content_path(wabbit, section), params: { format: :json }
    json_result = JSON.parse(response.body)

    assert(json_result)
    report = json_result['content_report']
    assert report

    # expect size of number of courses
    assert_equal 1, report.size
    # expect size of number of contents _that were observed_ and no others!
    assert_equal 2, report[0]['course_marks'].size

    assert_equal 90, report[0]['course_marks'].find { |m| m['id'] == next_content.id }['mark']
    assert_nil report[0]['course_marks'].find { |m| m['id'] == another_content.id }['mark']
    assert_equal 90, report[0]['average']
  end

  test 'student competency heatmap responds with success' do

    get student_competency_heat_map_path(@stu, @section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result[0]['data']
    assert json_result[0]['dates']
  end

  test 'student competency heatmap responds with observations' do
    groupon = CompetencyGroup.create!(title: 'falling rocks')
    competency = Competency.create!(course: @course, description: 'The third competency', competency_group: groupon )
    c2 = Competency.create!(course: @course, description: 'The fourth more', competency_group: groupon )

    observations = [
        CompetencyObservation.create!(competency: @competency2, task: @task2, student: @stu, user: @user, level: 4 ),
        CompetencyObservation.create!(competency: @competency, task: @task2, student: @stu, user: @user, level: 2 ),
        CompetencyObservation.create!(competency: c2, task: @task, student: @stu, user: @user, level: 0 ),
        CompetencyObservation.create!(competency: c2, task: @task2, student: @stu, user: @user, level: 1 ),
        CompetencyObservation.create!(competency: competency, task: @task2, student: @stu, user: @user, level: 3 ),
        CompetencyObservation.create!(competency: competency, task: @task, student: @stu, user: @user, level: 4 ),
    ]

    # Ensure the timestamops for the last 5 have enough of a difference to be sorted properly:
    observations[-1].updated_at = Time.now + 15000
    observations[-2].updated_at = Time.now + 31500
    observations[-3].updated_at = Time.now + 62500
    observations[-4].updated_at = Time.now + 101000
    observations[-5].updated_at = Time.now + 257050
    observations[-1].save
    observations[-2].save
    observations[-3].save
    observations[-4].save
    observations[-5].save

    get student_competency_heat_map_path(@stu, @section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result[0]['data']
    assert json_result[0]['dates']
  end

  test 'student competency heatmap has observations in the right order' do
    groupon = CompetencyGroup.create!(title: 'falling rocks')
    competency = Competency.create!(course: @course, description: 'The third competency', competency_group: groupon )
    c2 = Competency.create!(course: @course, description: 'The fourth more', competency_group: groupon )

    observations = [
        CompetencyObservation.create!(competency: @competency2, task: @task2, student: @stu, user: @user, level: 4 ),
        CompetencyObservation.create!(competency: @competency, task: @task2, student: @stu, user: @user, level: 2 ),
        CompetencyObservation.create!(competency: c2, task: @task, student: @stu, user: @user, level: 0 ),
        CompetencyObservation.create!(competency: c2, task: @task2, student: @stu, user: @user, level: 1 ),
        CompetencyObservation.create!(competency: competency, task: @task2, student: @stu, user: @user, level: 3 ),
        CompetencyObservation.create!(competency: competency, task: @task, student: @stu, user: @user, level: 4 ),
    ]

    year = Time.now.year
    expected_dates = [
        Time.parse("10-01-#{year}"),
        Time.parse("01-03-#{year}"),
        Time.parse("29-09-#{year}"),
        Time.parse("31-10-#{year}"),
        Time.parse("11-11-#{year}"),
        Time.parse("25-11-#{year}"),
    ]

    # Set the assessment dates to a scrambled order:
    observations[-6].assessed_at = expected_dates[5]
    observations[-1].assessed_at = expected_dates[0]
    observations[-2].assessed_at = expected_dates[4]
    observations[-3].assessed_at = expected_dates[2]
    observations[-4].assessed_at = expected_dates[1]
    observations[-5].assessed_at = expected_dates[3]
    observations[-1].save
    observations[-2].save
    observations[-3].save
    observations[-4].save
    observations[-5].save
    observations[-6].save

    get student_competency_heat_map_path(@stu, @section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result[0]['data']
    assert json_result[0]['dates']

    dates = json_result[0]['dates']
    assert_equal expected_dates[0], Time.parse(dates[0])
    assert_equal expected_dates[1], Time.parse(dates[1])
    assert_equal expected_dates[2], Time.parse(dates[2])
    assert_equal expected_dates[3], Time.parse(dates[3])
    assert_equal expected_dates[4], Time.parse(dates[4])
    assert_equal expected_dates[5], Time.parse(dates[5])
  end

  test 'student competency heat map allows student user to get their own data' do
    stu_user = TestDataFactory.createUser(roles: [:student], students: [@stu], email: 'stu@example.com')
    sign_in stu_user

    get student_competency_heat_map_path(@stu, @section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result[0]['data']
    assert json_result[0]['dates']
  end

  test 'student standard details report fetches the student\'s data' do
    new_assessment = Assessment.create!(name: 'the other test that was missed by stu', assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)

    course = Course.create!(title: "T")
    assert course.valid?
    next_content = Content.create!(name: 'next content', description: 'holy', course: course )
    another_content = Content.create!(name: 'next content', description: 'holy', course: course)
    section = Section.create!(user_id: @user.id, name: 'S1')
    section.courses = [course]
    s3 = Standard.create!(content: next_content, description: 'Know more things')
    s4 = Standard.create!(content: next_content, description: 'Know more things')
    s5 = Standard.create!(content: another_content, description: 'Know more things')
    s6 = Standard.create!(content: another_content, description: 'Know more things')
    # enroll Bugsy in the section:
    section.students = [@stu]
    section.assessments.push(new_assessment)
    section.save
    tasks = [ Task.create!(name: 'dance', assessment: new_assessment), Task.create!(name: 'q5', assessment: new_assessment)]

    TaskStandard.create!(task: tasks[0], standard: s3, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s4, level: 'H')
    TaskStandard.create!(task: tasks[0], standard: s5, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s6, level: 'H')

    # one H observation for each standard, that's 90% each standard.
    StandardObservation.create!(standard: s3, task: tasks[0], user: @user, student: @stu, level: 'H', score: 1)
    StandardObservation.create!(standard: s4, task:tasks[1], user: @user, student: @stu, level: 'H', score: 1)

    get student_standard_report_path(@stu, section), params: { format: :json, topics: [next_content.id, another_content.id] }
    json_result = JSON.parse(response.body)
    assert_response :success

    assert_equal 1, json_result.size
    course_marks = json_result[0]['course_marks']
    assert_equal 2, course_marks.length
  end

  test 'student standard details report fetches only standards belonging to requested contents' do
    new_assessment = Assessment.create!(name: 'the other test that was missed by stu', assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)

    course = Course.create!(title: "T")
    assert course.valid?
    next_content = Content.create!(name: 'next content', description: 'holy', course: course )
    another_content = Content.create!(name: 'another content', description: 'holy', course: course)
    section = Section.create!(user_id: @user.id, name: 'S1')
    section.courses = [course]
    s3 = Standard.create!(content: next_content, description: 'Know more things')
    s4 = Standard.create!(content: next_content, description: 'Know more things')
    s5 = Standard.create!(content: another_content, description: 'Know more things')
    s6 = Standard.create!(content: another_content, description: 'Know more things')
    # enroll Bugsy in the section:
    section.students = [@stu]
    section.assessments.push(new_assessment)
    section.save
    tasks = [ Task.create!(name: 'dance', assessment: new_assessment), Task.create!(name: 'q5', assessment: new_assessment)]

    TaskStandard.create!(task: tasks[0], standard: s3, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s4, level: 'H')
    TaskStandard.create!(task: tasks[0], standard: s5, level: 'H')
    TaskStandard.create!(task: tasks[1], standard: s6, level: 'H')

    # one H observation for each standard, that's 90% each standard.
    StandardObservation.create!(standard: s3, task: tasks[0], user: @user, student: @stu, level: 'H', score: 1)
    StandardObservation.create!(standard: s4, task:tasks[1], user: @user, student: @stu, level: 'H', score: 1)

    get student_standard_report_path(@stu, section), params: { format: :json, topic: [another_content.id] }
    json_result = JSON.parse(response.body)
    assert_response :success

    assert_equal 1, json_result.size
    course_marks = json_result[0]['course_marks']
    assert_equal 1, course_marks.length
    assert_equal another_content.name, course_marks[0]['name']
  end

  test 'student standard details report allows student user to get their own data' do
    stu_user = TestDataFactory.createUser(roles: [:student], students: [@stu], email: 'stu@example.com')
    sign_in stu_user

    get student_standard_report_path(@stu, @section), params: { format: :json }
    json_result = JSON.parse(response.body)
    assert(json_result)
  end

end
