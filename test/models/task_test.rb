require 'test_helper'

class TaskTest < ActiveSupport::TestCase
  def setup
    assessment = Assessment.new(name: 'An Invalid Assessment')
    assessment.save
    @task = Task.new(name: 'Testing', assessment: assessment)
    @task.save
  end

  test "valid task" do
    assert @task.valid? 'Task with a name was invalid'
  end

  test "invalid task" do
    @task.name = ''
    refute @task.valid? 'Task without a name was valid'
  end

  test "invalid assessmentless task" do
    @task.assessment = nil
    refute @task.valid? 'Task without an assessment was valid'
  end

end
