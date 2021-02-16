require 'test_helper'
require 'test_data_factory'

class AssessmentTest < ActiveSupport::TestCase
  def setup
    assessmentType = AssessmentType.new(name: 'Performance Based')

    @user = TestDataFactory.createUser(name: "Tester", email: "a@b.c", password: "ohcrapapassword")
    TestDataFactory.setDefaultUser(@user)

    @scoring_type = AssessmentScoringType.create!(name: 'badaboom')
    @assessment = Assessment.new(name: 'Testing', assessment_type: assessmentType, assessment_scoring_type: @scoring_type, user: @user)
    @assessment.save
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid assessment" do
    assert @assessment.valid? 'Assessment with a name and type was invalid'
  end

  test "invalid nameless assessment" do
    @assessment.name = ''
    refute @assessment.valid? 'Assessment without a name was valid'
  end

  test "invalid assessment" do
    @assessment.assessment_type = nil
    refute @assessment.valid? 'Assessment without a type was valid'
  end

  test "can add sections " do
    sections = [Section.create!(name: "Section of Test", user_id: @user.id), Section.create!(name: "Another of Test", user_id: @user.id)]
    @assessment.sections = sections
    assert @assessment.valid?

    assert_includes sections[0].assessments, @assessment
    assert_includes sections[1].assessments, @assessment
  end

  test 'can update with name' do
    @assessment.update_with_tasks_and_standards('Foo',nil,nil)
    assert @assessment.valid?

    assert_equal 'Foo', Assessment.find(@assessment.id).name
  end

  test 'can update with new tasks' do
    tasks = [{name: 'Footask'}, {name: 'Hooo task'}]
    @assessment.update_with_tasks_and_standards('Foo',nil,tasks)
    assert @assessment.valid?
    updated = Assessment.find(@assessment.id)
    assert_equal 'Foo', updated.name
    assert_equal 2, updated.tasks.size
  end

  test 'Map_returned_value returns tasks in order of date created' do
    @first_task = Task.new(name: 'First', assessment: @assessment)
    @first_task.save
    @first_task.created_at = Time.now - 10000
    @first_task.save
    tasks = [{name: 'Second'}, {id: @first_task.id, name: 'First'}]
    @assessment.update_with_tasks_and_standards('Foo', nil, tasks)
    assert @assessment.valid?

    updated_tasks = @assessment.map_assessment_data()[:tasks]
    updated = updated_tasks.collect{ |t| t[:name] }
    assert_equal updated, %w(First Second)

    tasks = [{name: 'Third'},{id: updated_tasks[1][:id], name: 'Second'}, {id: @first_task.id, name: 'First'}]
    @assessment.update_with_tasks_and_standards('Foo', nil, tasks)
    assert @assessment.valid?

    updated_tasks = @assessment.map_assessment_data()[:tasks]
    updated = updated_tasks.collect{ |t| t[:name] }
    assert_equal updated, %w(First Second Third)

    third = Task.find(updated_tasks[2][:id])
    third.created_at = Time.now - 90000
    third.save

    updated = @assessment.map_assessment_data()[:tasks].collect{ |t| t[:name] }
    assert_equal updated, %w(Third First Second)
  end

  test 'can update with existing tasks' do
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    tasks = [{id: existing_tasks[0].id, name: 'Bootask'}, {id: existing_tasks[1].id, name: 'Mootask'}]
    @assessment.update_with_tasks_and_standards('Foo',nil,tasks)
    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 2, @assessment.tasks.size
    assert_equal 'Bootask', @assessment.tasks.find(tasks[0][:id])[:name]
    assert_equal 'Mootask', @assessment.tasks.find(tasks[1][:id])[:name]
  end

  test 'can update with new tasks and standards' do
    course = Course.create(title: "bizarro course")
    content = Content.create(name: 'Bahaha', course: course)
    standards = [Standard.create(description: 's1', content: content),
                 Standard.create(description: 's2', content: content)]
    assert standards[0].valid?
    assert standards[1].valid?
    tasks = [{name: 'Footask', standards: {standards[0].id => 'H'}},
             {name: 'Hooo task',standards: {standards[0].id => 'M', standards[1].id => 'L'}}]
    @assessment.update_with_tasks_and_standards('Foo',nil,tasks)
    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    updated = Task.where(assessment_id: @assessment.id)
    assert_equal 2, updated.size

    updated = Task.where(assessment_id: @assessment.id)
    assert updated.find{ |t| t.name == 'Footask' }
    assert updated.find{ |t| t.name == 'Hooo task' }

    updated.each do |t|
      assert t.standards.find{ |s| s.description == standards[0][:description] }
    end

  end

  test 'can update existing tasks and standards' do
    course = Course.create(title: "bizarro course")
    content = Content.create(name: 'Bahaha', course: course)
    standards = [Standard.create(description: 's1', content: content),
                 Standard.create(description: 's2', content: content)]
    assert standards[0].valid?
    assert standards[1].valid?
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_standards = [
        TaskStandard.create(task: existing_tasks[0], standard: standards[0], level: 'L'),
        TaskStandard.create(task: existing_tasks[1], standard: standards[0], level: 'L'),
        TaskStandard.create(task: existing_tasks[1], standard: standards[1], level: 'L')
    ]
    tasks = [{id: existing_tasks[0].id, name: 'Bootask', standards: {standards[0].id.to_s => 'H'}},
              {id: existing_tasks[1].id, name: 'Mootask',standards: {standards[0].id.to_s => 'H', standards[1].id.to_s => 'M'}}]

    result = @assessment.update_with_tasks_and_standards('Foo',nil,tasks)
    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 2, @assessment.tasks.size

    tasks = result[:tasks]
    assert tasks
    t1 = tasks.find { |t| t[:id] == existing_tasks[0].id }
    standards1 = t1[:standards]
    assert_equal 1, standards1.length
    assert_equal 'H', standards1.values[0]

    t2 = tasks.find { |t| t[:id] == existing_tasks[1].id }
    standards2 = t2[:standards]
    assert_equal 2, standards2.length

    assert_equal 'H', standards2[standards[0].id]
    assert_equal 'M', standards2[standards[1].id]
  end

  test 'can change the type of the assessment' do
    assessmentType = AssessmentType.create(name: 'Foo Type')
    @assessment.update_with_tasks_and_standards('Foo',assessmentType[:name],nil)
    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 'Foo Type', @assessment.assessment_type[:name]
  end

  test 'can delete existing tasks only if there are no observations' do
    student = TestDataFactory.createStudent(unique_id: '123123', name: 'Buddy', school: School.new(name: "hohohoh", school_code: '123123'))
    course = Course.create(title: 'bizarro course')
    content = Content.create(name: 'Bahaha', course: course)
    standards = [Standard.create(description: 's1', content: content),
                 Standard.create(description: 's2', content: content)]
    assert standards[0].valid?
    assert standards[1].valid?
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_standards = [
        TaskStandard.create(task: existing_tasks[0], standard: standards[0], level: 'L'),
        TaskStandard.create(task: existing_tasks[1], standard: standards[0], level: 'L'),
        TaskStandard.create(task: existing_tasks[1], standard: standards[1], level: 'L')
    ]
    StandardObservation.create(task: existing_tasks[1],student: student, standard: standards[0], user: @user, level: 'L', score: 1)
    tasks = [{id: existing_tasks[1].id, name: 'Mootask',standards: {standards[0].id => 'H', standards[1].id => 'M'}}]

    @assessment.update_with_tasks_and_standards('Foo',nil, tasks)
    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    new_tasks = Task.where(assessment_id: @assessment.id)

    assert_equal 1, new_tasks.size
    refute new_tasks.find{ |t| t.name == 'Bootask' }
    assert new_tasks.find{ |t| t.name == 'Mootask' }

  end

  test 'can update existing tasks with new competencies' do
    course = Course.create(title: "bizarro course")
    competency_group = CompetencyGroup.create(title: 'Big group')
    competencies = [
        Competency.create(course: course, description: "oh so competent", competency_group: competency_group),
        Competency.create(course: course, description: "oh so VERY competent", competency_group: competency_group),
    ]
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_competencies = [
        TaskCompetency.create(task: existing_tasks[0], competency: competencies[0]),
        TaskCompetency.create(task: existing_tasks[1], competency: competencies[1])
    ]
    tasks = [{id: existing_tasks[0].id, name: 'Bootask', competencies: [competencies[0].id]},
             {id: existing_tasks[1].id, name: 'Mootask', competencies: [competencies[0].id, competencies[1].id]}]

    result = @assessment.update_with_tasks_and_standards('Foo',nil,tasks)

    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 2, @assessment.tasks.size

    updated = Task.where(assessment_id: @assessment.id)
    assert updated.find{ |t| t.name == 'Bootask' }
    assert updated.find{ |t| t.name == 'Mootask' }

    updated.each do |t|
      assert t.competencies.find { |s| s.description == competencies[0][:description] }
    end
  end

  test 'can remove competencies from existing tasks' do
    course = Course.create(title: "bizarro course")
    competency_group = CompetencyGroup.create(title: 'Big group')
    competencies = [
        Competency.create(course: course, description: "oh so competent", competency_group: competency_group),
        Competency.create(course: course, description: "oh so VERY competent", competency_group: competency_group),
    ]
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_competencies = [
        TaskCompetency.create(task: existing_tasks[0], competency: competencies[0]),
        TaskCompetency.create(task: existing_tasks[1], competency: competencies[1])
    ]
    tasks = [{id: existing_tasks[0].id, name: 'Bootask', competencies: []},
             {id: existing_tasks[1].id, name: 'Mootask', competencies: []}]

    result = @assessment.update_with_tasks_and_standards('Foo',nil,tasks)

    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 2, @assessment.tasks.size

    updated = Task.where(assessment_id: @assessment.id)
    assert updated.find{ |t| t.name == 'Bootask' }
    assert updated.find{ |t| t.name == 'Mootask' }

    updated.each do |t|
      refute t.competencies.find { |c| c.description == competencies[0][:description] }
      refute t.competencies.find { |c| c.description == competencies[1][:description] }
    end
  end

  test 'can remove just one competency from existing task' do
    course = Course.create(title: "bizarro course")
    competency_group = CompetencyGroup.create(title: 'Big group')
    competencies = [
        Competency.create(course: course, description: "oh so competent", competency_group: competency_group),
        Competency.create(course: course, description: "oh so VERY competent", competency_group: competency_group),
    ]
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_competencies = [
        TaskCompetency.create(task: existing_tasks[0], competency: competencies[0]),
        TaskCompetency.create(task: existing_tasks[1], competency: competencies[1])
    ]
    tasks = [{id: existing_tasks[0].id, name: 'Bootask', competencies: [competencies[0].id]},
             {id: existing_tasks[1].id, name: 'Mootask', competencies: [competencies[0].id]}]

    result = @assessment.update_with_tasks_and_standards('Foo',nil,tasks)

    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 2, @assessment.tasks.size

    updated = Task.where(assessment_id: @assessment.id)
    assert updated.find{ |t| t.name == 'Bootask' }
    assert updated.find{ |t| t.name == 'Mootask' }
    assert_not_nil Competency.find(competencies[0].id)

    assert_not_nil Competency.find(competencies[1].id)

    updated.each do |t|
      assert t.competencies.find { |s| s.description == competencies[0][:description] }
      refute t.competencies.find { |s| s.description == competencies[1][:description] }
    end
  end

  test 'can delete existing tasks only if there are no (competency) observations' do
    student = TestDataFactory.createStudent(unique_id: '123123', name: 'Buddy', school: School.new(name: "hohohoh", school_code: '123123'))
    competency_group = CompetencyGroup.create(title: 'Big group')
    course = Course.create(title: "bizarro course")
    competencies = [
        Competency.create(course: course, description: "oh so competent", competency_group: competency_group),
        Competency.create(course: course, description: "oh so VERY competent", competency_group: competency_group),
    ]

    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    @assessment.save
    existing_task_competencies = [
        TaskCompetency.create(task: existing_tasks[0], competency: competencies[0]),
        TaskCompetency.create(task: existing_tasks[1], competency: competencies[1])
    ]
    CompetencyObservation.create(student: student, task: existing_tasks[1], competency: competencies[1], level: 4, user: @user )

    new_tasks = [{id: existing_tasks[0].id, name: 'Bootask', competencies: [competencies[0].id]},
             {id: existing_tasks[1].id, name: 'Mootask', competencies: []}]

    result = @assessment.update_with_tasks_and_standards('Foo',nil, new_tasks)

    # make sure we didn't delete the task competency that had an observation:
    assert_equal 'Foo', result[:name]
    assert result[:tasks].size == 2
    t1 = result[:tasks].find { |t| t[:id] == existing_tasks[1].id }
    assert t1
    assert t1[:competencies].length == 1
    assert t1[:competencies][0] == competencies[1].id

    #for good measure check the other guy:
    t0 = result[:tasks].find { |t| t[:id] == existing_tasks[0].id }
    assert t0
    assert t0[:competencies].length == 1
  end

  test 'assessment cannot destroy itself and existing tasks if there any competency observations' do
    student = TestDataFactory.createStudent(unique_id: '123123', name: 'Buddy', school: School.new(name: "hohohoh", school_code: '123123'))
    competency_group = CompetencyGroup.create(title: 'Big group')
    course = Course.create(title: "bizarro course")
    competencies = [
        Competency.create(course: course, description: "oh so competent", competency_group: competency_group),
        Competency.create(course: course, description: "oh so VERY competent", competency_group: competency_group),
    ]

    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    @assessment.save
    existing_task_competencies = [
        TaskCompetency.create(task: existing_tasks[0], competency: competencies[0]),
        TaskCompetency.create(task: existing_tasks[1], competency: competencies[1])
    ]
    CompetencyObservation.create(student: student, task: existing_tasks[1], competency: competencies[1], level: 4, user: @user )

    new_tasks = [{id: existing_tasks[0].id, name: 'Bootask', competencies: [competencies[0].id]},
                 {id: existing_tasks[1].id, name: 'Mootask', competencies: []}]

    @assessment.destroy_associations

    assert Assessment.find(@assessment.id)
  end

  test 'assessment cannot destroy itself and existing tasks if there any standard observations' do
    student = TestDataFactory.createStudent(unique_id: '123123', name: 'Buddy', school: School.new(name: "hohohoh", school_code: '123123'))
    course = Course.create(title: 'bizarro course')
    content = Content.create(name: 'Bahaha', course: course)
    standards = [Standard.create(description: 's1', content: content),
                 Standard.create(description: 's2', content: content)]
    assert standards[0].valid?
    assert standards[1].valid?
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_standards = [
        TaskStandard.create(task: existing_tasks[0], standard: standards[0], level: 'L'),
        TaskStandard.create(task: existing_tasks[1], standard: standards[0], level: 'L'),
        TaskStandard.create(task: existing_tasks[1], standard: standards[1], level: 'L')
    ]
    StandardObservation.create(task: existing_tasks[1],student: student, standard: standards[0], user: @user, level: 'L', score: 1)

    @assessment.destroy_associations

    assert Assessment.find(@assessment.id)
  end

  test 'assessment cannot destroy itself and existing tasks if there any comments' do
    student = TestDataFactory.createStudent(unique_id: '123123', name: 'Buddy', school: School.new(name: "hohohoh", school_code: '123123'))
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    Comment.create!(task: existing_tasks[0], comment: "AHA! a true genius!", student: student)

    @assessment.destroy_associations

    assert Assessment.find(@assessment.id)
  end

  test 'assessment can destroy itself even if it belongs to a section, if it has no observations or comments' do
    student = TestDataFactory.createStudent(unique_id: '123123', name: 'Buddy', school: School.new(name: "hohohoh", school_code: '123123'))
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    course = Course.create(title: 'bizarro course')
    section = Section.create!(courses: [course], name: "Destroy this", user: @user)
    section.students = [student]
    @assessment.sections = [section]

    @assessment.destroy_associations

    assert_raise ActiveRecord::RecordNotFound do
      Assessment.find(@assessment.id)
    end
  end

  test 'can set a competency on an assessment and it does not appear in the returned tasks' do
    course = Course.create(title: "bizarro course")
    competency_group = CompetencyGroup.create(title: 'Big group')
    competencies = [
        Competency.create(course: course, description: "oh so competent", competency_group: competency_group),
        Competency.create(course: course, description: "oh so VERY competent", competency_group: competency_group),
    ]
    @assessment.save
    existing_tasks = [Task.create(name: 'Footask', assessment: @assessment), Task.create(name: 'Who task', assessment: @assessment)]
    existing_task_competencies = [
        TaskCompetency.create(task: existing_tasks[0], competency: competencies[0]),
        TaskCompetency.create(task: existing_tasks[1], competency: competencies[1])
    ]
    tasks = [{id: existing_tasks[0].id, name: 'Bootask', competencies: [competencies[0].id]},
             {id: existing_tasks[1].id, name: 'Mootask', competencies: [competencies[0].id, competencies[1].id]}]

    result = @assessment.update_with_tasks_and_standards('Foo',nil,tasks, competencies[0].id)

    assert @assessment.valid?
    assert_equal 'Foo', @assessment.name
    assert_equal 2, @assessment.tasks.size

    updated = Task.where(assessment_id: @assessment.id)
    t1 = updated.find{ |t| t.name == 'Bootask' }
    t2 = updated.find{ |t| t.name == 'Mootask' }

    # Ensure that the task competencies are still present!
    assert t1.competencies.include? competencies[0]
    assert t2.competencies.include? competencies[0]
    assert t2.competencies.include? competencies[1]
    assert @assessment.competency_id == competencies[0].id

    # Ensure that the tasks don't return with the assessment competency:
    assert result[:competency] == competencies[0].id
    result_tasks = result[:tasks]

    tr1 = result_tasks.find{|t| t[:id] == tasks[0][:id]}
    assert_empty tr1[:competencies]
    tr2 = result_tasks.find{|t| t[:id] == tasks[1][:id]}

    assert tr2[:competencies].length == 1
    assert tr2[:competencies][0] == competencies[1][:id]
  end

  test 'assessment has no attachment by default' do
    assert @assessment.valid?
    refute @assessment.package.attached?
  end

  test 'assessment has no attached package by default' do
    assert @assessment.valid?
    refute @assessment.package.attached?
  end

  test 'assessment can attach a package' do
    assert @assessment.valid?
    refute @assessment.package.attached?
    file = "#{Rails.root.to_s}/test/fixtures/files/bulkstudents.csv"
    @assessment.package.attach(io: File.open(file), filename: ' bulkstudents.csv', content_type: 'text/csv')
    assert @assessment.package.attached?
  end

  test 'assessment can detach a package' do
    assert @assessment.valid?
    refute @assessment.package.attached?
    file = "#{Rails.root.to_s}/test/fixtures/files/bulkstudents.csv"
    @assessment.package.attach(io: File.open(file), filename: ' bulkstudents.csv', content_type: 'text/csv')
    assert @assessment.package.attached?
    @assessment.package.purge
    refute @assessment.package.attached?
  end
end
