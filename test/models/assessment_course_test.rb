require 'test_helper'

class AssessmentCourseTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    @course = Course.new(title: "C1")
    @type = AssessmentType.create!(name: "type one")
    assert @type.valid?
    @scoring_type = AssessmentScoringType.create!(name: 'scoring type one')
    @assessment = Assessment.create!(name: "Asessment One", user_id: @user.id, assessment_type: @type, assessment_scoring_type: @scoring_type, courses: [@course])
  end

  test "Should be able to have a course added to an assessment " do
    assert assert @assessment.courses.size == 1
    assert AssessmentCourse.where(course: @course, assessment: @assessment).size == 1
  end

  test "Should only be able to have a course added once to the same assessment" do
    AssessmentCourse.create(course: @course, assessment: @assessment)
    refute @assessment.courses.size == 2
    assert @assessment.courses.size == 1
    assert AssessmentCourse.where(course: @course, assessment: @assessment).size == 1
  end

  test "unique courses_assessment with different assessment should be valid" do
    a2 = Assessment.create!(name: "Assementeé", user_id: @user.id, assessment_type: @type, assessment_scoring_type: @scoring_type, courses: [@course])
    assert @course.assessments.size == 2
    assert @assessment.courses.size == 1
    assert AssessmentCourse.where(course: @course, assessment: @assessment).size == 1
    assert AssessmentCourse.where(course: @course, assessment: a2).size == 1
  end

  test "unique courses assessment with a different course should be valid" do
    c2 = Course.new(title: "C1")
    c2.assessments = [@assessment]
    c2.save
    assert @course.assessments.size == 1
    assert Assessment.find(@assessment.id).courses.size == 2
    assert AssessmentCourse.where(course: c2, assessment: @assessment).size == 1
    assert AssessmentCourse.where(course: @course, assessment: @assessment).size == 1
  end
end
