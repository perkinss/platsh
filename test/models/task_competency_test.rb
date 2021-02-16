require 'test_helper'
require 'test_data_factory'

class TaskCompetencyTest < ActiveSupport::TestCase
  def setup
    @user = TestDataFactory.createUser(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    TestDataFactory.setDefaultUser(@user)
    @assessment = Assessment.create!(name: 'test 1', user: @user, assessment_type: AssessmentType.create!(name: "type 1"), assessment_scoring_type: AssessmentScoringType.create!(name: 'score type 1'))
    @task = Task.create!(name: 'Task 1', assessment: @assessment)
    @course = Course.create!(title: "Great course")
    @student = TestDataFactory.createStudent(name: 'Stu Dent', unique_id: 'S1')
    @competency_group = CompetencyGroup.create!(title: "Group of competencies")
    @competency = Competency.create!(competency_group: @competency_group, description: "should be valid", course: @course)
    assert @user.valid?
    assert @assessment.valid?
    assert @task.valid?
    assert @course.valid?
    assert @student.valid?
    assert @competency_group.valid?
    assert @competency.valid?
    @tc = TaskCompetency.create!(task: @task, competency: @competency)
    @task.save
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid taskCompetency" do
    assert @task.competencies.size == 1 ? 'Task does not have valid Competency expected' : ''
  end

  test "invalid duplicate taskCompetency does not get created" do
    tc2 = TaskCompetency.create(task: @task, competency: @competency)
    @task.save
    refute @task.competencies.size == 2
    assert @task.competencies.size == 1
    assert TaskCompetency.where(task: @task, competency: @competency).size == 1
  end

  test "removing competency from task should remove the association" do
    @task.competencies = []
    assert @task.competencies.size == 0
    assert TaskCompetency.where(task: @task, competency: @competency).empty?
  end


  test "unique task competency with different competency should be valid" do
    taskcompetency = TaskCompetency.create(task: @task, competency:Competency.create!(competency_group: @competency_group, description: "should be valid", course: @course))
    assert @task.competencies.size == 2
    assert TaskCompetency.where(task: @task, competency: @competency).size == 1
  end

  test "unique task competency with a different task should be valid" do
    new_task = Task.create(name: 'Task 1', assessment: @assessment)
    TaskCompetency.create(task: new_task, competency: @competency)
    assert  new_task.competencies.size == 1
    assert TaskCompetency.where(task: new_task, competency: @competency).size == 1
  end
end
