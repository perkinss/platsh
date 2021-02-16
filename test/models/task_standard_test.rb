require 'test_helper'
require 'test_data_factory'

class TaskStandardTest < ActiveSupport::TestCase
  def setup
    @user = TestDataFactory.createUser(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    TestDataFactory.setDefaultUser(@user)
    @assessment = Assessment.create!(name: 'test 1', user: @user, assessment_type: AssessmentType.create!(name: "type 1"), assessment_scoring_type: AssessmentScoringType.create!(name: 'score type 1'))
    @task = Task.create!(name: 'Task 1', assessment: @assessment)

    @student = TestDataFactory.createStudent(name: 'Stu Dent', unique_id: 'S1')
    @content = Content.create!(course: Course.create!(title: "course"), name: "Content", description: "d")
    @standard = Standard.create!(content: @content, description: "should be valid")
    @ts = TaskStandard.new(task: @task, standard: @standard, level: 'H')
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid taskStandard" do
    assert @ts.valid? 'TaskStandard with a standard, a task, and a level was invalid'
  end

  test "invalid taskStandard" do
    @ts.task = nil
    refute @ts.valid? 'Task Standard without a task was valid'
  end

  test "invalid taskstandard with no standard" do
    @ts.standard = nil
    refute @ts.valid? 'Task Standard without a standard was valid'
  end

  test "valid taskstandard with no level" do
    @ts.level = ''
    assert @ts.valid? 'Task Standard without a level was invalid'
  end

  test "task standard should be unique" do
    taskstandard = TaskStandard.new(task: @task, standard: @stan, level: 'H')
    refute taskstandard.valid? 'Non unique Task Standard was valid'
  end

  test "unique task standard should be valid" do
    taskstandard = TaskStandard.new(task: @task, standard: Standard.create!(content: @content, description: "should be valid"), level: 'H')
    assert taskstandard.valid? 'Unique Task Standard was invalid'
  end

  test "unique task standard with a different task should be valid" do
    taskstandard = TaskStandard.new(task: Task.new(name: 'Task 1', assessment: @assessment), standard: @standard, level: 'H')
    assert taskstandard.valid? 'Unique Task Standard was invalid'
  end
end
