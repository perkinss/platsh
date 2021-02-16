require 'test_helper'

class AssessmentsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @courses = [Course.create!(title: "Course 1"),Course.create!(title: "Course 2")]
    @groups = [CompetencyGroup.create!(title: "Group 1"),CompetencyGroup.create!(title: "Group 2") ]
    @competency1 = Competency.create!(competency_group_id: @groups[0].id, description: "bah humbug", course: @courses[0])
    @competency2 = Competency.create!(competency_group_id: @groups[0].id, description: "bah humbug 2", course: @courses[0])
    @competency3 = Competency.create!(competency_group_id: @groups[1].id, description: "bah humbug 3 ", course: @courses[0])
    @competency4 = Competency.create!(competency_group_id: @groups[1].id, description: "bah humbug 4", course: @courses[0])
    @content = Content.create!(name: "Content 1", course: @courses[0], description: "Big mucky muck")
    @standard = Standard.create!(content: @content, description: "stan the man")
    @standard2 = Standard.create!(content: @content, description: "stans a fan")

    @user = User.create!(name: 'aname', email: 'goo@goo.gle', password: 'somepassword', password_confirmation: 'somepassword')
    @user.confirmed_at = Date.today
    @user.save
    @sections = [Section.create!(name: 'fake', user_id: @user.id, courses: @courses),
                 Section.create!(name: 'fake 2', user_id: @user.id, courses: [@courses[0]])]

    sign_in @user

    @type = AssessmentType.create!(name: 'badabing', description: 'testing is for lugers')
    @scoring_type = AssessmentScoringType.create!(name: 'badaboom')
    @assessment = Assessment.new(name: 'First Assessment', user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type)
    @tasks = [Task.create!(name:'Question 1', assessment: @assessment),Task.create!(name:'Question TWO', assessment: @assessment)]
    @tasks[0].competencies=[@competency1, @competency3]
    @tasks[1].competencies=[@competency2, @competency4]

    TaskStandard.create!(task: @tasks[0], standard: @standard, level: 'M')
    TaskStandard.create!(task: @tasks[0], standard: @standard2, level: 'L')
    TaskStandard.create!(task: @tasks[1], standard: @standard2, level: 'H')
    # In rails, how do I prevent someone referencing a competency that doesn't belong to the assessment's courses/sections?

    @assessment.tasks = @tasks
    @assessment.sections = @sections
    @assessment.save
  end

  test "Should call update with success" do
    post assessments_update_path(@assessment), params: {:format => :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert json_result
  end

  test "Should update with new name" do
    post assessments_update_path(@assessment), params: {name: 'Foo', :format => :json}
    assert_response :success
    json_result = JSON.parse(response.body)
    assert_equal 'Foo', json_result['assessment']['name']
  end

  test "should get new" do
    task_params = [{
        name: "Task 1",
        competencies: [@competency1.id, @competency2.id],
        standards: { [@standard.id] => 'H' , [@standard2.id] => 'L' }
    }]
    params = { :name => "Assessment 1", courses: @courses, sections: [@sections[0].id],:tasks => task_params, :format => :json, type: @type.name, scoring: @scoring_type.name}

    post assessments_new_path  params: params

    assert_response :success
    json_result = JSON.parse(response.body)

    assert json_result['courses'].length == @courses.length
    type = json_result['type']
    assert type['name']
    assert json_result['type']['id'] == @type.id
    assert json_result['scoring_type']['id'] == @scoring_type.id
    assessment = Assessment.find(json_result['id'])
    assert assessment.courses
    tasks = assessment.tasks
    assert_equal 1, tasks.size
    task_standards = tasks[0].task_standards
    assert_equal 2, task_standards.size
    standardids = [@standard.id, @standard2.id]
    assert_includes standardids, task_standards[0].standard.id
    assert_includes standardids, task_standards[1].standard.id
    task_standards.each do |t|
      assert_includes ['L','H'], t.level
    end

    competencies = tasks[0].competencies
    assert_equal 2, competencies.size
    assert_includes task_params[0][:competencies], competencies[0].id
    assert_includes task_params[0][:competencies], competencies[1].id

    sections = json_result['sections']
    assert_equal 1, sections.size
    assert_equal @sections[0].id, sections[0]['id']

  end

  test "should get_for_user" do
    get assessments_get_for_user_path, params: {format: :json}
    assert_response :success

    json_result = JSON.parse(response.body)

    assert json_result
    tasks = json_result[0]['tasks']
    tasks.each do |t|
      task = @tasks.find { |tsk| tsk.id == t['id'] }
      assert_equal task.name, t['name']
      assert_equal task.task_standards.size, t['standards'].size
      assert_equal task.competencies.size, t['competencies'].size
    end

    type = json_result[0]['type']
    assert type['id'] == @type.id
    assert type['name']

    sections = json_result[0]['sections']
    assert_equal 2, sections.size
    sections.each do |s|

      section = @sections.find { |c| c.id == s['id'] and c.name == s['name'] }
      assert section
    end

  end

  test "should successfully delete deletable assessment" do
    delete assessments_delete_url(@assessment.id), params: {format: :json}
    assert_response :success

    assert_raise do ActiveRecord::RecordNotFound
      Assessment.find(@assessment.id)
    end
  end

  test "should provide shared assessments" do
    assessment = Assessment.new(name: 'Shared Assessment', shared: true , user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type, sections: @sections)
    task = Task.create!(name:'Question 1', assessment: assessment, competencies: [@competency1])
    assessment.tasks = [task]
    assessment.save

    assessment2 = Assessment.new(name: 'Shared Assessment', shared: false, user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type, sections: @sections)
    task2 = Task.create!(name:'Question 1', assessment: assessment2, competencies: [@competency1])
    assessment.tasks = [task2]
    assessment.save

    get assessments_get_shared_url(), params: {:format => :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result.one? { | ass_json | ass_json['id'] == assessment.id }
    assert json_result.none? { | ass_json | ass_json['id'] == assessment2.id }
    assert json_result.all? { | ass_json | ass_json['shared'] == true }
  end

  test "should share existing assessment" do
    assessment = Assessment.new(name: 'Not Shared Assessment', shared: false , user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type, sections: @sections)
    task = Task.create!(name:'Question 1', assessment: assessment, competencies: [@competency1])
    assessment.tasks = [task]
    assessment.save

    post assessments_share_url(assessment.id), params: {:format => :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assessment = Assessment.find(json_result['id'])
    assert assessment.shared == true
    assert json_result['shared'] == true
  end

  test "should stop sharing existing assessment" do
    assessment = Assessment.new(name: 'Shared Assessment', shared: true , user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type, sections: @sections)
    task = Task.create!(name:'Question 1', assessment: assessment, competencies: [@competency1])
    assessment.tasks = [task]
    assessment.save

    delete assessments_stop_sharing_url(assessment.id), params: {:format => :json}
    assert_response :success

    json_result = JSON.parse(response.body)
    assessment = Assessment.find(json_result['id'])
    assert assessment.shared == false
    assert json_result['shared'] == false
  end
end
