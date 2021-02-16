require 'test_helper'
require 'test_data_factory'

class CommentControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = TestDataFactory.createUser(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save!
    TestDataFactory.setDefaultUser(@user)

    sign_in @user
    @type = AssessmentType.create!(name: "Type 1")
    @scoring_type = AssessmentScoringType.create!(name: "Scoring Type 1")
    @assessment = Assessment.create!(name: "Name of assessment", assessment_type: @type, assessment_scoring_type: @scoring_type, user: @user)
    @task = Task.create!(name: "I like figs", assessment: @assessment)
    @stu = TestDataFactory.createStudent(name: "stu", unique_id: "dent")

    assert @user.valid?
    assert @type.valid?
    assert @assessment.valid?
    assert @task.valid?
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test 'should save comments' do
    params = { comments: [{student_id: @stu.id, task_id: @task.id, comment: "This should be saved"}], format: :json}
    post comments_save_url(@assessment), params: params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result

    assert json_result['comments']
    assert json_result['comments'].size == 1
    assert json_result['comments'][0]['comment'] == 'This should be saved'
  end

  test 'should update comments' do
    params = {  comments: [{student_id: @stu.id, task_id: [@task.id], comment: "This should be saved"}], format: :json}
    post comments_save_url(@assessment), params: params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result['comments']
    assert json_result['comments'][0]['comment'] == 'This should be saved'

    params = {  comments: [{student_id: @stu.id, task_id: [@task.id], comment: "This should overwrite it"}], format: :json}
    post comments_save_url(@assessment), params: params
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result
    assert json_result['comments']
    assert json_result['comments'][0]['comment'] == 'This should overwrite it'
  end

  test 'should be able to clear task comment' do
    params = {  comments: [{student_id: @stu.id, task_id: [@task.id], comment: "This should be saved"}], format: :json}
    post comments_save_url(@assessment), params: params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result['comments']
    assert json_result['comments'][0]['comment'] == 'This should be saved'

    params = {  comments: [{id: json_result['comments'][0]['id'], student_id: @stu.id, task_id: [@task.id], comment: ""}], format: :json}
    post comments_save_url(@assessment), params: params
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result['comments']
    assert json_result['comments'].length == 0
  end

  test 'should fail to create empty comment' do
    post comments_save_url(@assessment), params: {  comments: [{student_id: @stu.id, task_id: [@task.id], comment: ""}], format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result['comments']
    assert json_result['comments'].length == 0
  end

  test 'should fetch assessment task comment' do
    comment = Comment.create!(task: @task, comment: "This is fun", student: @stu)
    assert comment.valid?
    assert Comment.where(id: comment.id)[0]

    get comments_fetch_for_assessment_url(@assessment.id),  params: { format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    assert json_result[0]['task_id'] == @task.id
    assert json_result[0]['comment'] == "This is fun"
  end

  test 'should fetch all assessment task comments' do
    comment1 = Comment.create!(task: @task, comment: "This is fun", student: @stu)
    task2 =  Task.create!(name: "I also like figs", assessment: @assessment)
    comment2 = Comment.create!(task: task2, comment: "Soooooo much fun", student: @stu)
    assert comment1.valid?
    assert Comment.where(id: comment1.id)[0]
    assert comment2.valid?
    assert Comment.where(id: comment2.id)[0]

    get comments_fetch_for_assessment_url(@assessment.id),  params: { format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    first = json_result.filter { |item| item['task_id'] == @task.id }[0]
    assert first
    assert first['comment'] == "This is fun"

    second = json_result.filter { |item| item['task_id'] == task2.id }[0]
    assert second
    assert second['comment'] == "Soooooo much fun"
  end


  test 'should fetch all section student comments' do

    course = Course.create!(:title => 'Commentary course')
    section = Section.create!(user_id: @user.id, name: 'Section of comments')
    @assessment.courses = [course]
    @assessment.sections = [section]
    course.sections = [section]
    @assessment.save
    course.save

    comment1 = Comment.create!(task: @task, comment: "This is fun", student: @stu)
    task2 =  Task.create!(name: "I also like figs", assessment: @assessment)
    comment2 = Comment.create!(task: task2, comment: "Soooooo much fun", student: @stu)
    assert comment1.valid?
    assert Comment.where(id: comment1.id)[0]
    assert comment2.valid?
    assert Comment.where(id: comment2.id)[0]

    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    first = json_result.filter { |item| item['task'] == @task.name }[0]
    assert first
    assert first['comment'] == "This is fun"

    second = json_result.filter { |item| item['task'] == task2.name }[0]
    assert second
    assert second['comment'] == "Soooooo much fun"
  end

  test 'should fetch only the logged-in teacher\'s comments for student' do

    course = Course.create!(:title => 'Commentary course')
    section = Section.create!(user_id: @user.id, name: 'Section of comments')
    @assessment.courses = [course]
    @assessment.sections = [section]
    course.sections = [section]
    @assessment.save
    course.save

    user2 = User.create!(name: 'other teacher', email: 'boo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword', customers: [@user.customers[0]])
    user2.confirmed_at = Date.today
    user2.save!
    section2 = Section.create!(user_id: user2.id, name: 'Another set of comments')
    assessment2 = Assessment.create!(name: "Another assessment", assessment_type: @type, assessment_scoring_type: @scoring_type, user: user2)
    assessment2.courses = [course]
    assessment2.sections = [section2]
    assessment2.save!
    section2.save!
    task3 = Task.create!(name: "I prefer pomegranates", assessment: assessment2)

    # The logged in teacher's comments:
    comment1 = Comment.create!(task: @task, comment: "This is fun", student: @stu)
    task2 =  Task.create!(name: "I also like figs", assessment: @assessment)
    comment2 = Comment.create!(task: task2, comment: "Soooooo much fun", student: @stu)
    assert comment1.valid?
    assert Comment.where(id: comment1.id)[0]
    assert comment2.valid?
    assert Comment.where(id: comment2.id)[0]

    # Other teacher's comment on same course and student, but in their own tasks:
    comment3 = Comment.create!(task: task3, comment: "Such an eggsellent show", student: @stu)
    assert comment3.valid?
    assert Comment.where(id: comment3.id)[0]

    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result
    first = json_result.filter { |item| item['task'] == @task.name }[0]
    assert first
    assert first['comment'] == "This is fun"
    assert first['assessment'] == @assessment.name

    second = json_result.filter { |item| item['task'] == task2.name }[0]
    assert second
    assert second['comment'] == "Soooooo much fun"
    assert second['assessment'] == @assessment.name

    should_not_be_there = json_result.filter { |item| item['task'] == task3.name }
    assert_empty should_not_be_there

    # Sign in the other teacher and confirm we only get their comments:
    sign_in user2
    get comments_fetch_for_report_url(section2.id, @stu.id),  params: { format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    first = json_result.filter { |item| item['task'] == task3.name }[0]
    assert first
    assert_equal first['comment'], "Such an eggsellent show"
    assert_equal first['assessment'], assessment2.name
  end

  test 'should fetch all section student comments for date range' do
    # Use UTC so times match db times:
    now = Time.now.utc
    late = now - 10000
    early = now - 300000

    course = Course.create!(:title => 'Commentary course')
    section = Section.create!(user_id: @user.id, name: 'Section of comments')
    @assessment.courses = [course]
    @assessment.sections = [section]
    course.sections = [section]
    @assessment.save
    course.save

    Comment.delete_all
    comment1 = Comment.create!(task: @task, comment: "This is fun", student: @stu)
    task2 =  Task.create!(name: "I also like figs", assessment: @assessment)
    comment2 = Comment.create!(task: task2, comment: "Soooooo much fun", student: @stu)
    comment1.updated_at = late
    comment2.updated_at = early
    comment1.save!
    comment2.save!

    # No filtering:
    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json }
    assert_response :success
    json_result = JSON.parse(response.body)
    assert_equal 2, json_result.length

    # Filtering with zero range:
    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json, from: now, to: now }
    assert_response :success
    json_result = JSON.parse(response.body)
    assert_empty json_result

    # Filtering for inclusive time range:
    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json, from: early, to: now }
    assert_response :success
    json_result = JSON.parse(response.body)
    assert_equal 2, json_result.length

    # Filtering includes early but not late:
    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json, from: early, to: late }
    assert_response :success
    json_result = JSON.parse(response.body)
    assert_equal 1, json_result.length
    assert_equal comment2.comment, json_result[0]['comment']

    # Filtering includes late but not early:
    get comments_fetch_for_report_url(section.id, @stu.id),  params: { format: :json, from: late, to: now }
    assert_response :success
    json_result = JSON.parse(response.body)
    assert_equal 1, json_result.length
    assert_equal comment1.comment, json_result[0]['comment']

  end
end
