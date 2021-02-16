require 'test_helper'
require 'test_data_factory'

class CommentTest < ActiveSupport::TestCase
 def setup
   @user = TestDataFactory.createUser(name: "Tester", email: "a@b.c", password: "ohcrapapassword")
   @student = TestDataFactory.createStudent(name: 'A Valid Student', unique_id: "S1", customer: @user.customers[0])
   @type = AssessmentType.create!(name: "Type 1")
   @scoring_type = AssessmentScoringType.create!(name: 'Scoring Type 1')
   @assessment = Assessment.create!(name: "Name of assessment", assessment_type: @type, assessment_scoring_type: @scoring_type, user: @user)
   @task = Task.create!(name: "I like figs", assessment: @assessment)
   @comment = Comment.create(comment: "I like them so much I could write a book about them.  The were seen as a common fruit
                        in greek times, but they are so much more than that.", task: @task, student: @student)
 end

 def teardown
   TestDataFactory.setDefaultUser(nil)
 end

 test 'Comment with text is valid' do
    assert @comment.valid?
  end

 test 'Comment without text is invalid' do
   @comment.comment = ''
   refute @comment.valid? 'Comment with empty string was valid'
 end

 test 'Comment without task is invalid' do
   @comment.task = nil
   refute @comment.valid? 'Comment without a task was valid'
 end

 test 'Comment without student is invalid' do
   @comment.student = nil
   refute @comment.valid? 'Comment without a student was valid'
 end

 test 'Duplicate comment is invalid' do
   dup = Comment.new(comment: "I like them so much I could write a book about them.  The were seen as a common fruit
                        in greek times, but they are so much more than that.", task: @task, student: @student)
   refute dup.valid? 'Duplicate comment on same task for same student was valid'
 end

end
