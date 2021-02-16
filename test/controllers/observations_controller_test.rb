require 'test_helper'
require 'test_data_factory'

class ObservationsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup

    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    TestDataFactory.setDefaultUser(@user)
    @section = Section.create!(name: 'fake', user_id: @user.id)
    @user.confirmed_at = Date.today
    @user.save
    sign_in @user

    @stu = TestDataFactory.createStudent(name: "stu", unique_id: "dent")

    @course = Course.create!(title: "Math 9")
    @content = Content.create!(name: "connie", description: "holy", course: @course)
    @stan = Standard.create!(content: @content, description:"Know things")
    @competency = Competency.create!(course: @course, description: "Has abilities", competency_group: CompetencyGroup.create!(title:"Hah") )

    @type = AssessmentType.create!(name: "Huh", description: "aint that funky now")
    @scoring_type = AssessmentScoringType.create!(name: 'Uhh')
    @assessment = Assessment.create!(name: "hello", assessment_type_id: @type.id, assessment_scoring_type_id: @scoring_type.id, user: @user)
    @task = Task.create!(name: 'q1', assessment: @assessment)
    @task.standards = [@stan]
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "should save marks" do
    assessment_date = "2020-02-01T03:43:00.000Z"
    standard2 = Standard.create!(content: @content, description:"Know even more things")
    task2 = Task.create!(name: 'q2', assessment: @assessment)
    competency2 = Competency.create!(course: @course, description: "Has abilities", competency_group: CompetencyGroup.find_by_title("Hah"))

    task2.standards = [standard2]
    task2.competencies = [competency2, @competency]
    task2.save

    @task.standards = [standard2, @stan]
    @task.save
    @task.competencies = [@competency]
    @section.students = [@stu]
    @section.save
    assert @assessment.tasks.size == 2

    params =  {
        assessment: @assessment.id,
        assessed_at: assessment_date,
        student: @stu.id,
        assessment_score: 3,
        marks: {
            student_competencies: {
                @task.id=> {@competency.id=> 2}, task2.id=>{@competency.id=> 2, competency2.id => 4}
            },
            standard_marks: {
                @task.id=> [@stan.id], task2.id=>[standard2.id]
            },
        },
        format: :json
    }
    post save_marks_path, params: params
    assert_response :success

    json_result = JSON.parse(response.body)

    standard_observations = json_result['standard_observations']
    competency_observations = json_result['competency_observations']
    assert_equal 2, standard_observations.size
    assert_equal 3, competency_observations.size

    assert_equal assessment_date, standard_observations[0]['assessed_at']
    assert_equal assessment_date, competency_observations[0]['assessed_at']
  end

  test "should retrieve existing marks" do

    standard2 = Standard.create!(content: @content, description:"Know even more things")
    task2 = Task.create!(name: 'q2', assessment: @assessment)
    competency2 = Competency.create!(course: @course, description: "Has abilities", competency_group: CompetencyGroup.find_by_title("Hah"))

    task2.standards = [standard2]
    task2.competencies = [competency2, @competency]
    task2.save

    @task.standards = [standard2]
    @task.save
    @section.students = [@stu]
    @section.save

    observation1 = StandardObservation.create!(standard: standard2, task: task2, user: @user, student: @stu, score: 1)
    observation2 = StandardObservation.create!(standard: standard2, task: @task, user: @user, student: @stu, score: 3)

    assert @assessment.tasks.size == 2

    assert StandardObservation.exists?(observation1.id)
    assert StandardObservation.exists?(observation2.id)

    get list_marks_url(@section, @assessment), params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result
    assert json_result['student_marks'].size == 1
    assert json_result['student_marks']
    assert json_result['student_marks'][@stu.id.to_s].size == 2
    assert json_result['student_marks'][@stu.id.to_s][@task.id.to_s]
    assert json_result['student_marks'][@stu.id.to_s][@task.id.to_s].size == 1
    assert json_result['student_marks'][@stu.id.to_s][@task.id.to_s][standard2.id.to_s] == 3
    assert json_result['student_marks'][@stu.id.to_s][task2.id.to_s]
    assert json_result['student_marks'][@stu.id.to_s][task2.id.to_s].size == 1
    assert json_result['student_marks'][@stu.id.to_s][task2.id.to_s][standard2.id.to_s] == 1
    # observations with no assessment date are saved with today's date as the assessment date, not nil
    assert json_result['assessed_date']
  end

  test "should retrieve existing competencies" do

    competency2 = Competency.create!(competency_group: @competency.competency_group, description:"Show some skillz", course: @course)
    task2 = Task.create!(name: 'q2', assessment: @assessment)
    @section.students = [@stu]

    task2.competencies = [@competency, competency2]
    @task.competencies = [@competency, competency2]
    @task.save

    CompetencyObservation.create!(task: task2, student: @stu, competency: @competency, level: 0, user: @user)
    CompetencyObservation.create!(task: task2, student: @stu, competency: competency2, level: 2, user: @user)
    CompetencyObservation.create!(task: @task, student: @stu, competency: @competency, level: 3, user: @user)
    CompetencyObservation.create!(task: @task, student: @stu, competency: competency2, level: 4, user: @user)

    get list_scores_url(@section, @assessment), params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result['student_competencies'].size == 1

    assert json_result['student_competencies'][@stu.id.to_s].size == 2
    assert json_result['student_competencies'][@stu.id.to_s].size == 2

    assert json_result['student_competencies'][@stu.id.to_s][task2.id.to_s].size == 2
    assert json_result['student_competencies'][@stu.id.to_s][@task.id.to_s].size == 2

    assert json_result['student_competencies'][@stu.id.to_s][task2.id.to_s][@competency.id.to_s] == 0
    assert json_result['student_competencies'][@stu.id.to_s][task2.id.to_s][competency2.id.to_s] == 2
    assert json_result['student_competencies'][@stu.id.to_s][@task.id.to_s][@competency.id.to_s] == 3
    assert json_result['student_competencies'][@stu.id.to_s][@task.id.to_s][competency2.id.to_s] == 4
  end
end
