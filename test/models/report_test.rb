require 'test_helper'
require 'test_data_factory'
load 'report'
class ReportTest < ActiveSupport::TestCase

  def setup
    @user = TestDataFactory.createUser(name: "Test User", email: "user@example.com",
                         password: "apassword", password_confirmation: "apassword")
    TestDataFactory.setDefaultUser(@user)
    @course = Course.create!(title: "Test course", grade: '9', subject: 'math')
    @type = AssessmentType.create!(name: "Type 1")
    @scoring_type = AssessmentScoringType.create!(name: 'Scoring Type 1')
    @holistic_scoring_type = AssessmentScoringType.create!(name: 'Holistic')

    @section = Section.create!(name: "Section of Test", user_id: @user.id)
    @assessments = [Assessment.create!(name: "Assessment", assessment_type: @type, assessment_scoring_type: @scoring_type, user: @user),
                    Assessment.create!(name: "Assessment2", assessment_type: @type, assessment_scoring_type: @scoring_type, user: @user),
                    Assessment.create!(name: "Assessment2", assessment_type: @type, assessment_scoring_type: @holistic_scoring_type, user: @user)]

    @student = TestDataFactory.createStudent(name: "stu", unique_id: 'student')
    @student2 = TestDataFactory.createStudent(name: "dent", unique_id: 'dentstu')
    @section.students = [@student, @student2]
    @content = Content.create!(course: @course, name: "Content", description: "d")
    @tasks = [
        Task.create!(name: 'Task 1', assessment: @assessments[0]),
        Task.create!(name: 'Task 2',assessment: @assessments[1]),
        Task.create!(name: 'Task 3',assessment: @assessments[2])]

    @section.assessments = @assessments

    @standards = [Standard.create!(content: @content, description: "standard 1"), Standard.create!(content: @content, description: "standard 2")]

    @task_standards = [
        TaskStandard.create!(task: @tasks[0], standard: @standards[0], level: 'L'),
        TaskStandard.create!(task: @tasks[1], standard: @standards[1], level: 'M'),
        TaskStandard.create!(task: @tasks[2], standard: @standards[1]),
    ]
    @courses = [Course.create!(title: "Course 1"),Course.create!(title: "Course 2"),@course]
    @section.courses = @courses
    @groups = [CompetencyGroup.create!(title: "Group 1"),CompetencyGroup.create!(title: "Group 2") ]
    @competency1 = Competency.create!(competency_group_id: @groups[0].id, description: "demonstrate knowledge", course: @courses[0])
    @competency2 = Competency.create!(competency_group_id: @groups[0].id, description: "do some things", course: @courses[0])
    @competency3 = Competency.create!(competency_group_id: @groups[1].id, description: "be happy", course: @courses[0])

    @observation = StandardObservation.create!(task: @tasks[0], user: @user, standard: @standards[0], student: @student)
    @report = Report.new
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test 'Observed assessments only gets assessments in which student had one observation' do
    relevant_assessments = @report.observed_assessments(@section, @student)
    assert relevant_assessments.length == 1
    assert relevant_assessments[0][:id] == @assessments[0].id
  end

  test 'Observed assessments only gets assessments that student had one observation' do
    student2 = TestDataFactory.createStudent(name: "stu", unique_id: 'stu2')
    @section.students.push(student2)
    observation2 = StandardObservation.create!(task: @tasks[1], user: @user, standard: @standards[0], student: student2)
    assert observation2

    # still only gets the one task for the student
    relevant_assessments = @report.observed_assessments(@section, @student)
    assert relevant_assessments.length == 1
    assert relevant_assessments[0][:id] == @assessments[0].id

    relevant_assessments = @report.observed_assessments(@section, student2)
    assert relevant_assessments.length == 1
    assert relevant_assessments[0][:id] == @assessments[1].id
  end

  test 'Observed assessments only gets assessments that student had an observation between dates' do
    now = Time.now
    latest_time = now - 10000
    second_latest_time = now - 20000
    second_earliest_time = now - 30000
    earliest_time = now - 40000

    StandardObservation.delete_all

    StandardObservation.create!(task: @tasks[1], user: @user, standard: @standards[0], student: @student, assessed_at: latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0', assessed_at: second_latest_time)

    # still only gets the one task for the student
    relevant_assessments = @report.observed_assessments(@section, @student)

    assert_equal 2, relevant_assessments.length
    assert_equal @assessments[0].id, relevant_assessments[0][:id]
    assert_equal @assessments[1].id, relevant_assessments[1][:id]

    relevant_assessments = @report.observed_assessments(@section, @student, earliest_time, second_earliest_time)
    assert relevant_assessments.length == 0

    relevant_assessments = @report.observed_assessments(@section, @student, second_earliest_time, second_latest_time)
    assert relevant_assessments.length == 0

    relevant_assessments = @report.observed_assessments(@section, @student, second_latest_time, latest_time)
    assert relevant_assessments.length == 1
    assert_equal @assessments[0].id, relevant_assessments[0][:id]

    relevant_assessments = @report.observed_assessments(@section, @student, latest_time, Time.now)
    assert relevant_assessments.length == 1
    assert_equal @assessments[1].id, relevant_assessments[0][:id]
  end

  test 'Heat map correctly groups observations by time' do
    @tasks.push(Task.create!(name: 'Task 3', assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 4',assessment: @assessments[1]))

    observations = [
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency2, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency1, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency3, level: '3')
    ]

    # Distribute the observations over a two week period
    observations.each_with_index do |o, i|
      o.update(assessed_at: Time.now - 60*60*24*(14 - i))
    end

    result = @report.student_heat_map(@student, @section)
    assert_equal 12, result[0][:dates].size
    assert_equal 3, result[0][:data].size
  end

  test 'Heat map correctly groups observations by week if there are more than 45 days' do
    @tasks.push(Task.create!(name: 'Task 3', assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 4',assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 5',assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 6',assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task7', assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 8',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 9',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 10',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 11',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 12',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 13',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 14',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 15',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 16',assessment: @assessments[1]))

    observations = [
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency2, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency1, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency2, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency3, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency2, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[4], user: @user, competency:@competency1, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[4], user: @user, competency:@competency2, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[4], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[5], user: @user, competency:@competency1, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[5], user: @user, competency:@competency2, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[5], user: @user, competency:@competency3, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[6], user: @user, competency:@competency1, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[6], user: @user, competency:@competency2, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[6], user: @user, competency:@competency3, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[7], user: @user, competency:@competency1, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[7], user: @user, competency:@competency2, level: '2'),
        CompetencyObservation.create!(student: @student, task: @tasks[7], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[8], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[8], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[8], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[9], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[9], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[9], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[10], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[10], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[10], user: @user, competency:@competency3, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[11], user: @user, competency:@competency1, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[11], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[11], user: @user, competency:@competency3, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[12], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[12], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[12], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[13], user: @user, competency:@competency1, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[13], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[13], user: @user, competency:@competency3, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[14], user: @user, competency:@competency1, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[14], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[14], user: @user, competency:@competency3, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[15], user: @user, competency:@competency1, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[15], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[15], user: @user, competency:@competency3, level: '4'),
    ]

    #15 * 3 is 45 observations.  each on a different day.  Should group and average them by weeks, which will result in 7 or 8 weeks of observations

    # Distribute the observations over a two month period
    observations.each_with_index do |o, i|
      o.update(assessed_at: Time.now.middle_of_day - (60*120) - 60*60*24*(60 - i))
    end

    result = @report.student_heat_map(@student, @section)

    assert_includes [7,8], result[0][:dates].size
    assert_equal 3, result[0][:data].size
  end

  test 'Heat map correctly groups observations by course' do
    @tasks.push(Task.create!(name: 'Task 3', assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 4',assessment: @assessments[1]))
    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "hakuna mutata", course: @courses[1])

    observations = [
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency4, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency4, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency3, level: '3')
    ]

    # Distribute the observations over a two week period
    observations.each_with_index do |o, i|
      o.update(assessed_at: Time.now - 60*60*24*(14 - i))
    end

    result = @report.student_heat_map(@student, @section)

    course1data = result.find{ |course| course[:id] == @courses[0].id }

    assert_equal 10, course1data[:dates].size
    assert_equal 3, course1data[:data].size

    course1data = result.find{ |course| course[:id] == @courses[1].id }

    assert_equal 2, course1data[:dates].size
    assert_equal 1, course1data[:data].size
  end

  test 'Student standard report returns all the standards even the ones that were not marked' do
    @tasks.push(Task.create!(name: 'Task 3', assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task7', assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 8',assessment: @assessments[1]))
    @tasks.push(Task.create!(name: 'Task 9',assessment: @assessments[1]))

    course2 = Course.create!(title: "Second course", grade: '9', subject: 'geometry')
    content2 = Content.create!(course: course2, name: "Geometry 1", description: "euclid")
    @standards.push(Standard.create!(content: content2, description: "standard 3"))
    @section.courses = [@course, course2]
    @section.save

    TaskStandard.create!(task: @tasks[0], standard: @standards[1], level: 'M')
    TaskStandard.create!(task: @tasks[0], standard: @standards[2], level: 'H')
    TaskStandard.create!(task: @tasks[1], standard: @standards[0], level: 'L')
    TaskStandard.create!(task: @tasks[1], standard: @standards[2], level: 'H')
    TaskStandard.create!(task: @tasks[3], standard: @standards[0], level: 'L')
    TaskStandard.create!(task: @tasks[3], standard: @standards[1], level: 'M')
    TaskStandard.create!(task: @tasks[3], standard: @standards[2], level: 'H')

    StandardObservation.create!(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'M', score: 1)
    StandardObservation.create!(task: @tasks[0], standard: @standards[2], student: @student, user: @user, level: 'H', score: 1)
    StandardObservation.create!(task: @tasks[1], standard: @standards[0], student: @student, user: @user, level: 'L', score: 1)
    StandardObservation.create!(task: @tasks[1], standard: @standards[1], student: @student, user: @user, level: 'M', score: 1)
    StandardObservation.create!(task: @tasks[1], standard: @standards[2], student: @student, user: @user, level: 'H', score: 1)
    StandardObservation.create!(task: @tasks[3], standard: @standards[0], student: @student, user: @user, level: 'L', score: 1)
    StandardObservation.create!(task: @tasks[3], standard: @standards[1], student: @student, user: @user, level: 'M', score: 1)
    StandardObservation.create!(task: @tasks[3], standard: @standards[2], student: @student, user: @user, level: 'H', score: 1)

    result = @report.student_standard_report(@student, @section)
    assert result
    assert_equal 2, result.size
    report_1 = result.find { |course| course[:id] == @course.id }

    assert_equal 1, report_1[:course_marks].size
    marks = report_1[:course_marks][0][:marks]
    assert marks
    assert_equal 60, marks.find { |standard| standard[:id] == @standards[0].id }[:mark]
    assert_equal 80, marks.find { |standard| standard[:id] == @standards[1].id }[:mark]

    report_2 = result.find { |course| course[:id] == course2.id }
    marks = report_2[:course_marks][0][:marks]
    assert marks
    assert_equal 100, marks.find { |standard| standard[:id] == @standards[2].id }[:mark]
  end

  test 'student_competency_report gets right mode percentage' do
    @tasks.push(Task.create!(name: 'Task 3', assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 4',assessment: @assessments[1]))

    observations = [
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency1, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '0'),
        CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency3, level: '1'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency1, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency2, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency3, level: '3'),
        CompetencyObservation.create!(student: @student, task: @tasks[4], user: @user, competency:@competency2, level: '4'),
        CompetencyObservation.create!(student: @student, task: @tasks[4], user: @user, competency:@competency3, level: '3')
    ]

    expected_averages = {
        @groups[0].id => 58, # 0, 0, 1, 1, 3,3,4 -> average of 0, 1, 3 -> 1.333 -> 54%
        @groups[1].id => 83, # 0, 1, 3, 3 -> 3 -> average of 3 -> 3 -> 83%
    }
    expected_modes = {
        @groups[0].id => 1.33, # 0, 0, 1, 1, 3,3,4 -> average of 0, 1, 3 -> 1.333
        @groups[1].id => 3, # 0, 1, 3, 3 -> 3 -> average of 3 -> 3
    }

    report = @report.student_competency_report(@section, @student)

    course_data = report[:competency_report].find { |course| course[:id] == @courses[0].id }
    group_1_data = course_data[:course_competencies].find { |group| group[:id] == @groups[0].id }
    assert_equal expected_averages[@groups[0].id], group_1_data[:percentage]
    assert_equal expected_modes[@groups[0].id], group_1_data[:competency_mark].round(2)

    group_2_data = course_data[:course_competencies].find { |group| group[:id] == @groups[1].id }
    assert_equal expected_averages[@groups[1].id], group_2_data[:percentage]
    assert_equal expected_modes[@groups[1].id], group_2_data[:competency_mark].round(2)

  end

  test 'get_mark_from_observations determines mark for holistic assessments' do
    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 6)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 100, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 5)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 90, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 4)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 80, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 3)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 70, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 2)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 60, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 50, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 0)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 33, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: -1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_nil mark
  end

  test 'get_mark_from_observations provides highest mark when multiples present' do
    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 2),
                    StandardObservation.new(task: @tasks[1], standard: @standards[1], student: @student, user: @user, level: nil , score: 5),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: nil , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 90, mark
  end

  test 'get_mark_from_observations ignores scores from other standards' do
    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 2),
                    StandardObservation.new(task: @tasks[2], standard: @standards[0], student: @student, user: @user, level: nil , score: 5)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 60, mark
  end

  test 'get_mark_from_observations takes high score between holistic and non-holistic observations' do
    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 6),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'H' , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 100, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 4),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'H' , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 90, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 5),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'M' , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 90, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 3),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'M' , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 70, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 5),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'L' , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 90, mark

    observations = [StandardObservation.new(task: @tasks[2], standard: @standards[1], student: @student, user: @user, level: nil , score: 0),
                    StandardObservation.new(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'L' , score: 1)]
    mark = @report.get_mark_from_observations(observations, @standards[1])
    assert_equal 50, mark
  end

  test 'get_marks with date gets only the date after the start and before the end dates' do
    
    now_minus_10000 = Time.now - 10000
    now_minus_20000 = Time.now - 20000
    now_minus_30000 = Time.now - 30000
    now_minus_40000 = Time.now - 40000

    @section.courses = [@course]
    @section.save!
    @observation.update!(task: @tasks[0], standard: @standards[0], student: @student, user: @user, level: 'M' ,score:1, assessed_at: now_minus_10000)
    StandardObservation.create!(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'H' ,score:1, assessed_at: now_minus_30000)

    StandardObservation.create!(task: @tasks[1], standard: @standards[0], student: @student2, user: @user, level: 'L', score:1, assessed_at: now_minus_20000)
    StandardObservation.create!(task: @tasks[1], standard: @standards[1], student: @student2, user: @user, level: 'M', score:1, assessed_at: now_minus_40000)
    mark = @report.section_content_report(@section, @user)

    assert mark

    stu_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student.name}
    dent_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student2.name}

    assert_equal 80, stu_marks[:mark]
    assert_equal 60, dent_marks[:mark]

    # Date range excludes second_earliest_time and earliest_time, so stu has one M and dent has one L
    mark = @report.section_content_report(@section, @user, now_minus_20000, Time.now)

    stu_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student.name}
    dent_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student2.name}

    assert_equal 70, stu_marks[:mark]
    assert_equal 50, dent_marks[:mark]

    # Date range excludes second_earliest_time and earliest_time, so stu has one M and dent has one L
    mark = @report.section_content_report(@section, @user, now_minus_20000, Time.now)

    stu_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student.name}
    dent_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student2.name}

    assert_equal 70, stu_marks[:mark]
    assert_equal 50, dent_marks[:mark]
  end

  test 'get_marks with dates calculates based on data for inclusive date from, and exclusive date to' do

    now = Time.now
    latest_time = now - 10000
    second_latest_time = now - 20000
    just_after_second_latest = now - 19900
    second_earliest_time = now - 30000
    earliest_time = now - 40000

    @section.courses = [@course]
    @section.save!
    @observation.update!(task: @tasks[0], standard: @standards[0], student: @student, user: @user, level: 'M' ,score:nil, assessed_at: latest_time)
    StandardObservation.create!(task: @tasks[1], standard: @standards[1], student: @student, user: @user, level: 'H' ,score:nil, assessed_at: second_earliest_time)

    StandardObservation.create!(task: @tasks[0], standard: @standards[0], student: @student2, user: @user, level: 'H', score:nil, assessed_at: second_latest_time)
    StandardObservation.create!(task: @tasks[1], standard: @standards[1], student: @student2, user: @user, level: 'M', score:nil, assessed_at: earliest_time)
    mark = @report.section_content_report(@section, @user, earliest_time,  second_latest_time)

    assert mark
    stu_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student.name}
    dent_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student2.name}

    # one observation made at earliest_time, for stu, and one made at second_earliest_time ... we don't include the one second_latest_time
    assert_equal 90, stu_marks[:mark]
    assert_equal 70, dent_marks[:mark]

    mark = @report.section_content_report(@section, @user, earliest_time,  just_after_second_latest)
    assert mark
    stu_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student.name}
    dent_marks = mark[:section_content_overview][0][:course_marks][0][:content_marks].find {|m| m[:name] == @student2.name}

    # now same query but include the one at second_latest_time, so dent has 1 H == '80'
    assert_equal 90, stu_marks[:mark]
    assert_equal 80, dent_marks[:mark]

  end

  test 'section_competency_report returns only data within time range' do
    now = Time.now
    latest_time = now - 10000
    second_latest_time = now - 20000
    just_after_second_latest = now - 19900
    second_earliest_time = now - 30000
    earliest_time = now - 40000

    @section.courses = @courses
    @section.save!
    @section.students = [@student]
    @tasks.push(Task.create!(name: 'Task 3', assessment: @assessments[0]))
    @tasks.push(Task.create!(name: 'Task 4',assessment: @assessments[1]))

    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "hakuna mutata", course: @courses[1])

    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)

    # Only fetch observations for competency1 because all other competencies were observed later than that:
    score = @report.section_competency_report(@section, @user, earliest_time,  second_earliest_time)

    assert score

    # the way we set the dates, only the first compentency in the first group should have a score, with mode 0:
    course1_group1_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[0][:title]}
    course1_group2_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    course2_group2_score = score[:section_competency_overview][1][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    assert_equal 0, course1_group1_score[:competency_mark][0][:mark]
    assert_nil course1_group2_score[:competency_mark][0][:mark]
    assert_nil course2_group2_score[:competency_mark][0][:mark]

    score = @report.section_competency_report(@section, @user, earliest_time,  second_latest_time)
    course1_group1_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[0][:title]}
    course1_group2_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    course2_group2_score = score[:section_competency_overview][1][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    assert_equal 0.5, course1_group1_score[:competency_mark][0][:mark]
    assert_nil course1_group2_score[:competency_mark][0][:mark]
    assert_nil course2_group2_score[:competency_mark][0][:mark]

    score = @report.section_competency_report(@section, @user, earliest_time,  just_after_second_latest)
    course1_group1_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[0][:title]}
    course1_group2_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    course2_group2_score = score[:section_competency_overview][1][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    assert_equal 0.5, course1_group1_score[:competency_mark][0][:mark]
    assert_equal 3, course1_group2_score[:competency_mark][0][:mark]
    assert_nil course2_group2_score[:competency_mark][0][:mark]

    score = @report.section_competency_report(@section, @user, earliest_time + 1,  latest_time)
    course1_group1_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[0][:title]}
    course1_group2_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    course2_group2_score = score[:section_competency_overview][1][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    assert_equal 1, course1_group1_score[:competency_mark][0][:mark]
    assert_equal 3, course1_group2_score[:competency_mark][0][:mark]
    assert_nil course2_group2_score[:competency_mark][0][:mark]

    score = @report.section_competency_report(@section, @user, earliest_time,  Time.now)
    course1_group1_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[0][:title]}
    course1_group2_score = score[:section_competency_overview][0][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    course2_group2_score = score[:section_competency_overview][1][:course_competencies].find {|m| m[:title] == @groups[1][:title]}
    assert_equal 0.5, course1_group1_score[:competency_mark][0][:mark]
    assert_equal 3, course1_group2_score[:competency_mark][0][:mark]
    assert_equal 4, course2_group2_score[:competency_mark][0][:mark]

  end

  test 'student_content_report returns only data within time range' do
    now = Time.now
    latest_time = now - 10000
    second_latest_time = now - 20000
    just_after_second_latest = now - 19900
    second_earliest_time = now - 30000
    earliest_time = now - 40000

    @section.courses = [@course]
    @section.save!
    @observation.update!(task: @tasks[0], standard: @standards[0], student: @student, user: @user, level: 'H' ,score:1, assessed_at: latest_time)
    StandardObservation.create!(task: @tasks[1], standard: @standards[0], student: @student, user: @user, level: 'H', score:1, assessed_at: second_latest_time)
    StandardObservation.create!(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'M' ,score:1, assessed_at: second_earliest_time)
    StandardObservation.create!(task: @tasks[1], standard: @standards[1], student: @student, user: @user, level: 'L', score:1, assessed_at: earliest_time)
    mark = @report.content_report_for_student(@section, @student)
    assert_equal mark[:name], @student.name
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # All marks are the average of content1 standards[0] (2 H = 100) and content1 standards[1] (1 M = 70): (70 + 100)/2 = 85
    assert_equal 85, stu_mark

    mark = @report.content_report_for_student(@section, @student, earliest_time, Time.now)
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # All marks included in time span and average is still 85
    assert_equal 85, stu_mark

    mark = @report.content_report_for_student(@section, @student, earliest_time, latest_time)
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # All but latest mark, the H on standards[0], (70 + 90)/2 = 80
    assert_equal 80, stu_mark

    mark = @report.content_report_for_student(@section, @student, earliest_time, second_earliest_time)
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # standards[1], first observation times only: the one L on standards[1], 50
    assert_equal 50, stu_mark

    mark = @report.content_report_for_student(@section, @student, second_earliest_time, just_after_second_latest)
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # standards[1], second observation time, the M on standards[1], standards[0] at second latest time, H (70 + 90)/2 = 80
    assert_equal 80, stu_mark

    mark = @report.content_report_for_student(@section, @student, second_earliest_time, Time.now)
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # standards[1] at second observation time M, standards[0] at second latest time, H*2: (70 + 100)/2 = 85
    assert_equal 85, stu_mark

    mark = @report.content_report_for_student(@section, @student, second_latest_time, Time.now)
    stu_mark = mark[:content_report][0][:course_marks][0][:mark]
    # standards[1], last two observation times H*2 : 100
    assert_equal 100, stu_mark
  end

  test 'student_content_report returns only data for requested contents' do
    content2 = Content.create!(course: @course, name: "Geometry 1", description: "euclid")
    @standards.push(Standard.create!(content: content2, description: "standard 3"))
    @section.courses = [@course]
    @section.save!
    @observation.update!(task: @tasks[0], standard: @standards[0], student: @student, user: @user, level: 'H' ,score:1)
    StandardObservation.create!(task: @tasks[1], standard: @standards[0], student: @student, user: @user, level: 'H', score:1)
    StandardObservation.create!(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'M' ,score:1)
    # And one observation for the standard in the second content
    StandardObservation.create!(task: @tasks[1], standard: @standards[2], student: @student, user: @user, level: 'L', score:1)


    mark = @report.content_report_for_student(@section, @student, nil, nil, [@content.id])
    assert_equal mark[:name], @student.name
    stu_mark = mark[:content_report][0][:course_marks]
    assert_equal 1, stu_mark.length
    assert_equal @content.name, stu_mark[0][:name]

    mark = @report.content_report_for_student(@section, @student, nil, nil, [@content.id, content2.id])
    assert_equal mark[:name], @student.name
    stu_mark = mark[:content_report][0][:course_marks]
    assert_equal 2, stu_mark.length
  end

  test 'student_competency_report returns only data within time range' do
    now = Time.now
    latest_time = now - 10000
    second_latest_time = now - 20000
    just_after_second_latest = now - 19900
    second_earliest_time = now - 30000
    earliest_time = now - 40000

    @section.courses = @courses
    @section.save!
    @section.students = [@student]
    @tasks.push(Task.create!(name: 'Task 4', assessment: @assessments[0]))

    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "hakuna mutata", course: @courses[1])
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[2], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[3], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[1], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)
    score = @report.student_competency_report(@section, @student)

    stu_course1_group1_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[0].title }[:competency_mark]
    stu_course1_group2_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    stu_course2_group2_score = score[:competency_report][1][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    assert stu_course1_group1_score
    assert_equal 0.5, stu_course1_group1_score
    assert stu_course1_group2_score
    assert_equal 3, stu_course1_group2_score
    assert stu_course2_group2_score
    assert_equal 4, stu_course2_group2_score

    score = @report.student_competency_report(@section, @student, earliest_time, latest_time + 1)
    stu_course1_group1_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[0].title }[:competency_mark]
    stu_course1_group2_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    stu_course2_group2_score = score[:competency_report][1][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    assert_equal 0.5, stu_course1_group1_score
    assert_equal 3, stu_course1_group2_score
    assert_equal 4, stu_course2_group2_score

    score = @report.student_competency_report(@section, @student, second_earliest_time, latest_time)
    stu_course1_group1_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[0].title }[:competency_mark]
    stu_course1_group2_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    stu_course2_group2_score = score[:competency_report][1][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    assert_equal 1, stu_course1_group1_score
    assert_equal 3, stu_course1_group2_score
    assert_nil stu_course2_group2_score

    score = @report.student_competency_report(@section, @student, earliest_time, just_after_second_latest)
    stu_course1_group1_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[0].title }[:competency_mark]
    stu_course1_group2_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    stu_course2_group2_score = score[:competency_report][1][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    assert_equal 0.5, stu_course1_group1_score
    assert_equal 3, stu_course1_group2_score
    assert_nil stu_course2_group2_score

    score = @report.student_competency_report(@section, @student, second_latest_time, latest_time + 1)
    stu_course1_group1_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[0].title }[:competency_mark]
    stu_course1_group2_score = score[:competency_report][0][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    stu_course2_group2_score = score[:competency_report][1][:course_competencies].find { |c| c[:title] == @groups[1].title }[:competency_mark]
    assert_nil stu_course1_group1_score
    assert_equal 3, stu_course1_group2_score
    assert_equal 4, stu_course2_group2_score
  end

  test 'heat_map gets data within date range only' do
    now = Time.now
    latest_time = now - 100000
    second_latest_time = now - 200000
    just_after_second_latest = now - 199900
    second_earliest_time = now - 300000
    earliest_time = now - 400000

    @tasks.push(Task.create!(name: 'Task 4',assessment: @assessments[1]))
    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "hakuna mutata", course: @courses[1])

    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency1, level: '0', assessed_at: earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency2, level: '1', assessed_at: second_earliest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency3, level: '3', assessed_at: second_latest_time)
    CompetencyObservation.create!(student: @student, task: @tasks[0], user: @user, competency:@competency4, level: '4', assessed_at: latest_time)

    result = @report.student_heat_map(@student, @section)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 3 dates for first course, and 1 for second course:
    assert_equal 3, course_1_dates.length
    assert_equal 1, course_2_dates.length

    result = @report.student_heat_map(@student, @section, earliest_time, latest_time + 1)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 3 dates for first course, and 1 for second course:
    assert_equal 3, course_1_dates.length
    assert_equal 1, course_2_dates.length

    result = @report.student_heat_map(@student, @section, earliest_time, latest_time)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 3 dates for first course, and none for second course:
    assert_equal 3, course_1_dates.length
    assert_equal 0, course_2_dates.length

    result = @report.student_heat_map(@student, @section, second_earliest_time, latest_time + 1)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 2 dates for first course, and 1 for second course:
    assert_equal 2, course_1_dates.length
    assert_equal 1, course_2_dates.length

    result = @report.student_heat_map(@student, @section, second_earliest_time, latest_time + 1)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 2 dates for first course, and 1 for second course:
    assert_equal 2, course_1_dates.length
    assert_equal 1, course_2_dates.length

    result = @report.student_heat_map(@student, @section, second_latest_time, latest_time + 1)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 1 dates for first course, and 1 for second course:
    assert_equal 1, course_1_dates.length
    assert_equal 1, course_2_dates.length

    result = @report.student_heat_map(@student, @section, second_latest_time, just_after_second_latest)
    assert result
    course_1_dates = result.find { |d| d[:id] == @courses[0].id }[:dates]
    course_2_dates = result.find { |d| d[:id] == @courses[1].id }[:dates]

    # should have 1 dates for first course, and 1 for second course:
    assert_equal 1, course_1_dates.length
    assert_equal 0, course_2_dates.length
  end

  test 'student_standard_report returns marks only within date range' do
    now = Time.now
    latest_time = now - 10000
    second_latest_time = now - 20000
    just_after_second_latest = now - 19900
    second_earliest_time = now - 30000
    earliest_time = now - 40000

    @standards.push(Standard.create!(content: @content, description: "standard 3"))
    @standards.push(Standard.create!(content: @content, description: "standard 4"))

    StandardObservation.create!(task: @tasks[1], standard: @standards[0], student: @student, user: @user, level: 'M', assessed_at: earliest_time)
    StandardObservation.create!(task: @tasks[0], standard: @standards[1], student: @student, user: @user, level: 'L', assessed_at: second_earliest_time)
    StandardObservation.create!(task: @tasks[0], standard: @standards[2], student: @student, user: @user, level: 'M', assessed_at: second_latest_time)
    StandardObservation.create!(task: @tasks[1], standard: @standards[3], student: @student, user: @user, level: 'H', assessed_at: latest_time)

    result = @report.student_standard_report(@student, @section)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert course_marks
    assert_equal 4, course_marks.length
    assert_equal 90, course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

    result = @report.student_standard_report(@student, @section, earliest_time, latest_time + 1)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert_equal 90, course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

    result = @report.student_standard_report(@student, @section, earliest_time, second_latest_time)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert course_marks
    assert_nil course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_nil course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

    result = @report.student_standard_report(@student, @section, second_earliest_time, latest_time + 1)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert course_marks
    assert_equal 90, course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_nil course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

    result = @report.student_standard_report(@student, @section, second_earliest_time, latest_time)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert course_marks
    assert_nil course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_nil course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

    result = @report.student_standard_report(@student, @section, second_earliest_time, second_latest_time)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert course_marks
    assert_nil course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_nil course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_nil  course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

    result = @report.student_standard_report(@student, @section, second_earliest_time, just_after_second_latest)
    assert result
    course_marks = result.find { |c| c[:id] == @course.id }[:course_marks][0][:marks]
    assert course_marks
    assert_nil course_marks.find { |m| m[:id] == @standards[3].id }[:mark]
    assert_equal 70, course_marks.find { |m| m[:id] == @standards[2].id }[:mark]
    assert_equal 50, course_marks.find { |m| m[:id] == @standards[1].id }[:mark]
    assert_nil  course_marks.find { |m| m[:id] == @standards[0].id }[:mark]

  end

end
