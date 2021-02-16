require 'test_helper'
require 'test_data_factory'

class CompetencyObservationTest < ActiveSupport::TestCase
  # Task: one
  #  User: one
  #  Competency: one
  #  Student: one
  #  level: 1
  def setup
    @assessment_date = "2020-02-01T03:43:00.000Z"
    @user = TestDataFactory.createUser(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    TestDataFactory.setDefaultUser(@user)
    @assessment = Assessment.create!(name: 'test 1', user: @user, assessment_type: AssessmentType.new(name: 'name'), assessment_scoring_type: AssessmentScoringType.new(name: 'ST name'))
    @task = Task.create!(name: 'Task 1', assessment: @assessment)


    @competency_group = CompetencyGroup.create!(title: 'Competency Group 1')
    @course = Course.create!(title: "C1")
    @standard = Standard.create!(description: "stuff", content: Content.new(name: "A day int the life", course: @course))
    @competency = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @student = TestDataFactory.createStudent(name: 'Stu Dent', unique_id: 'S1')
    @competency_observation = CompetencyObservation.new(task: @task, user: @user, competency: @competency, student: @student, level: 3)
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid competency observation" do
    assert @competency_observation.valid? 'Competency Observation with all the things (teacher, student, task, competency, level) was invalid'
  end

  test "invalid task-less observation" do
    @competency_observation.task = nil
    refute @competency_observation.valid? 'Competency Observation without a task was valid'
  end


  test "invalid user-less observation" do
    @competency_observation.user = nil
    refute @competency_observation.valid? 'Competency Observation without a user was valid'
  end

  test "invalid student-less observation" do
    @competency_observation.student = nil
    refute @competency_observation.valid? 'Competency Observation without a student was valid'
  end

  test "invalid competency-less observation" do
    @competency_observation.competency = nil
    refute @competency_observation.valid? 'Competency Observation without a competency was valid'
  end

  test "valid competency observation with comment" do
    @competency_observation.comment = "This comment could be much much larger because it is actually a text field, not a char field"
    assert @competency_observation.valid? 'Competency Observation with a comment was invalid'
  end

  test "invalid competency observation with no level" do
    @competency_observation.level = nil
    refute @competency_observation.valid? 'Competency Observation with no level was valid'
  end

  test "duplicate observation should be invalid" do
    dup = CompetencyObservation.new(task: @task, competency: @competency, student: @student, user: @user)
    refute dup.valid? 'Duplicate Standard Observation was valid'
  end

  test "unique observation with different competency should be valid" do
    crusher = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    assert crusher.valid?
    snowflake = CompetencyObservation.new(task: @task, competency: crusher, student: @student, user: @user, level: 'H')
    assert snowflake.valid? 'Unique Competency Observation with different competency was invalid'
  end

  test "unique observation within different task should be valid" do
    t2 = Task.create!(name: 'Task 12', assessment: @assessment)
    snowflake = CompetencyObservation.new(task: t2, competency: @competency, student: @student, user: @user,level: 'H')
    assert snowflake.valid? 'Unique Competency Observation on different task was invalid'
  end

  test "unique observation on different student should be valid" do
    jj = TestDataFactory.createStudent(name: 'newstudent', unique_id: 'thing')
    assert jj.valid?
    snowflake = CompetencyObservation.new(task: @task, competency: @competency, student: jj, user: @user, level: 'H')
    assert snowflake.valid? 'Unique Competency Observation on different student was invalid'
  end

  test "update scores creates new scores" do
    competency2 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    competency3 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @task.competencies = [competency2, competency3, @competency]
    @task.save

    CompetencyObservation.destroy_all
    assert CompetencyObservation.count == 0

    scores = {"#{@task.id}" => {"#{@competency.id}" => 4, "#{competency2.id}" => 0, "#{competency3.id}" => 3} }
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores, @assessment_date)

    assert CompetencyObservation.count == 3
  end

  test 'update scores with an assessment competency creates task competency observations' do
    competency2 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    competency3 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @task.competencies = [competency2, @competency]
    @task.save
    @assessment.competency_id = competency3.id
    @assessment.save

    #have to delete the ones from the fixture tests.
    CompetencyObservation.destroy_all
    assert CompetencyObservation.count == 0

    scores = {"#{@task.id}" => { "#{@competency.id}" => 4, "#{competency2.id}" => 0 } }
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores,  @assessment_date,4)

    assert CompetencyObservation.count == 3
  end

  test 'update scores missing assessment competency removes task assessment-competency observations' do
    competency2 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    competency3 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @task.competencies = [competency2, @competency]
    @task.save
    @assessment.competency_id = competency3.id
    @assessment.save

    #have to delete the ones from the fixture tests.
    CompetencyObservation.destroy_all
    assert CompetencyObservation.count == 0

    scores = {"#{@task.id}" => { "#{@competency.id}" => 4, "#{competency2.id}" => 0 } }
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores,  @assessment_date, 4)

    assert CompetencyObservation.count == 3
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores, @assessment_date)

    assert CompetencyObservation.count == 2
  end

  # Handy to have nearby:
  # print "\n\n#{JSON.pretty_generate(something.as_json)}"
  test 'update scores with different assessment competency score changes task assessment-competency observations' do
    competency2 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    competency3 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @task.competencies = [competency2, @competency]
    @task.save
    @assessment.competency_id = competency3.id
    @assessment.save

    #have to delete the ones from the fixture tests.
    CompetencyObservation.destroy_all
    assert CompetencyObservation.count == 0

    scores = {"#{@task.id}" => { "#{@competency.id}" => 4, "#{competency2.id}" => 0 } }
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores,  @assessment_date, 4)

    assert CompetencyObservation.count == 3

    assessment_obs = CompetencyObservation.find_by_competency_id(competency3.id)
    assert assessment_obs
    assert assessment_obs.level == 4

    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores,  @assessment_date, 3)

    assert CompetencyObservation.count == 3

    assessment_obs = CompetencyObservation.find_by_competency_id(competency3.id)
    assert assessment_obs
    assert assessment_obs.level == 3

  end

  test 'an assessment competency saves as an observation on each task' do
    competency2 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    competency3 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @task.competencies = [competency2, @competency]
    @task.save
    task2 = Task.new(name: 'Task 2', assessment: @assessment)
    task2.competencies = [competency2]
    task2.save

    @assessment.competency_id = competency3.id
    @assessment.save

    #have to delete the ones from the fixture tests.
    CompetencyObservation.destroy_all
    assert CompetencyObservation.count == 0

    scores = {
        "#{@task.id}" => { "#{@competency.id}" => 4, "#{competency2.id}" => 0 } ,
        "#{task2.id}" => { "#{competency2.id}" => 3 }
    }
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores,  @assessment_date, 4)

    assert CompetencyObservation.count == 5

    assessment_obs = CompetencyObservation.where(competency_id: competency3.id)
    assert assessment_obs.size == 2

    assessment_obs.each do |o|
      assert o.level == 4
    end
  end

  test 'removing an assessment competency removes assessment observations on each task' do
    competency2 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    competency3 = Competency.create!(description: 'Some new competency.  I hope you can cope', competency_group: @competency_group, course: @course)
    @task.competencies = [competency2, @competency]
    @task.save
    task2 = Task.new(name: 'Task 2', assessment: @assessment)
    task2.competencies = [competency2]
    task2.save

    @assessment.competency_id = competency3.id
    @assessment.save

    #have to delete the ones from the fixture tests.
    CompetencyObservation.destroy_all
    assert CompetencyObservation.count == 0

    scores = {
        "#{@task.id}" => { "#{@competency.id}" => 4, "#{competency2.id}" => 0 } ,
        "#{task2.id}" => { "#{competency2.id}" => 3 }
    }
    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores, @assessment_date, 4)

    assert CompetencyObservation.count == 5

    assessment_obs = CompetencyObservation.where(competency_id: competency3.id)
    assert assessment_obs.size == 2

    assessment_obs.each do |o|
      assert o.level == 4
    end

    CompetencyObservation.update_competency_scores(@user, @assessment, @student, scores, @assessment_date)
    assert CompetencyObservation.count == 3

    assessment_obs = CompetencyObservation.where(competency_id: competency3.id)
    assert_empty assessment_obs
  end
end
