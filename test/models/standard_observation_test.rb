require 'test_helper'
require 'test_data_factory'

class StandardObservationTest < ActiveSupport::TestCase

    def setup
      @assessment_date = "2020-02-01T03:43:00.000Z"
      @user = TestDataFactory.createUser(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
      TestDataFactory.setDefaultUser(@user)
      @assessment = Assessment.create!(name: 'test 1', user: @user, assessment_type: AssessmentType.create!(name: "type 1"), assessment_scoring_type: AssessmentScoringType.create!(name: 'score type 1'))
      @task = Task.create!(name: 'Task 1', assessment: @assessment)

      @student = TestDataFactory.createStudent(name: 'Stu Dent', unique_id: 'S1')
      @content = Content.create!(course: Course.create!(title: "course"), name: "Content", description: "d")
      @standard = Standard.create!(content: @content, description: "should be valid")
      @standardObservation = StandardObservation.create!(task: @task, user: @user, standard:@standard, student: @student)
    end

    def teardown
      TestDataFactory.setDefaultUser(nil)
    end

    test "valid competency observation" do
      assert @standardObservation.valid? 'Standard Observation with all the things (teacher, student, task, standard) was invalid'
    end

    test "invalid task-less observation" do
      @standardObservation.task = nil
      refute @standardObservation.valid? 'Standard Observation without a task was valid'
    end


    test "invalid user-less observation" do
      @standardObservation.user = nil
      refute @standardObservation.valid? 'Standard Observation without a user was valid'
    end

    test "invalid student-less observation" do
      @standardObservation.student = nil
      refute @standardObservation.valid? 'Standard Observation without a student was valid'
    end

    test "invalid standard-less observation" do
      @standardObservation.standard = nil
      refute @standardObservation.valid? 'Standard Observation without a standard was valid'
    end

    test "duplicate observation should be invalid" do
      dup = StandardObservation.new(task: @task, standard:@standard, student: @student, user: @user)
      refute dup.valid? 'Duplicate Standard Observation was valid'
    end

    test "unique observation with different standard should be valid" do
      newstan = Standard.create!(description: "s1", content: @content)
      snowflake = StandardObservation.new(task: @task, standard: newstan, student: @student, user: @user)
      assert snowflake.valid? 'Unique Standard Observation with different standard was invalid'
    end

    test "unique observation within different task should be valid" do
      t2 = Task.create!(name: 'Task 12', assessment: @assessment)
      snowflake = StandardObservation.new(task: t2, standard:@standard, student: @student, user: @user)
      assert snowflake.valid? 'Unique Standard Observation on different task was invalid'
    end

    test "unique observation within different student should be valid" do
      jj = TestDataFactory.createStudent(name: 'newstudent', unique_id: 'thing')
      assert jj.valid?
      snowflake = StandardObservation.new(task: @task, standard:@standard, student: jj, user: @user )
      assert snowflake.valid? 'Unique Standard Observation on different student was invalid'
    end

    test "update marks creates new marks" do
      standard2 = Standard.create!(description: 'Some new knowledge', content: @content )
      standard3 = Standard.create!(description: 'Some new knowldge.  I hope you can cope', content: @content)
      @task.standards = [standard2, standard3, @standard]
      @task.save

      StandardObservation.destroy_all
      assert StandardObservation.count == 0

      marks = {"#{@task.id}" => {standard2.id => 1, standard3.id => 1 , @standard.id => 1} }
      StandardObservation.update_standard_marks(@user, @assessment, @student, marks, @assessment_date)

      assert StandardObservation.count == 3
    end

end
