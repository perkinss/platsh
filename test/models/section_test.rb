require 'test_helper'
require 'test_data_factory'

class SectionTest < ActiveSupport::TestCase
  def setup
    @user = TestDataFactory.createUser(name: "Test User", email: "user@example.com",
        password: "apassword", password_confirmation: "apassword")
    TestDataFactory.setDefaultUser(@user)
    @courses = [Course.new(title: "Test course", grade: '9', subject: 'math'), Course.new(title: "Another Test course", grade: '10', subject: 'math') ]
    @section = Section.new(name: "Section of Test", user_id: @user.id, courses: @courses)
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "should be able to have many courses" do
    assert_equal @section.courses.size, 2
  end

  test "should be able to have many assessments " do

    user = User.create!(name: "Tester", email: "a@b.c", password: "ohcrapapassword")
    assessments = [Assessment.new(name: 'Testing', assessment_type: AssessmentType.new(name: 'Performance Based'), assessment_scoring_type: AssessmentScoringType.new(name: 'ST1'), user: user),
                   Assessment.new(name: 'Foo', assessment_type: AssessmentType.new(name: 'Test'), assessment_scoring_type: AssessmentScoringType.new(name: 'ST2'), user: user)]
    @section.assessments = assessments
    @section.save

    assert_includes assessments[0].sections, @section
    assert_includes assessments[1].sections, @section
  end

  test "should be able to have many enrollments and students " do

    students = TestDataFactory.newStudents([{ name: "JS", unique_id: "JS" }, { name: "JD", unique_id: "JD" }])
    enrollments = [Enrollment.new(student: students[0], section: @section),Enrollment.new(student: students[1], section: @section)]

    @section.enrollments = enrollments
    @section.save

    assert_equal enrollments[0].section, @section
    assert_equal enrollments[1].section, @section
    assert_equal 2, @section.students.size
  end

end
