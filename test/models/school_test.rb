require 'test_helper'
require 'test_data_factory'

class SchoolTest < ActiveSupport::TestCase
  def setup
    @school = School.create!(name: 'A new school', school_code: 1234)
    @school.save
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid school" do
    assert @school.valid? 'School with a name was invalid'
  end

  test "invalid school" do
    @school.name = ''
    refute @school.valid? 'School without a name was valid'
  end

  test "duplicate school" do
    school2 = School.new(name: 'Another new school', school_code: 1234)
    refute school2.valid? 'School without non-unique code was valid'
  end

  test "valid school with student" do
    student = TestDataFactory.newStudent(name: 'A Valid Student', unique_id: "S2")
    student.school = @school
    assert student.valid? 'Student with one school was invalid'
    assert @school.valid? 'School with a student was invalid'
  end

  test "valid non-unique name for school " do
    school2 = School.new(name: 'A new school', school_code: 12345)
    assert school2.valid? 'School with non-unique name but unique code was valid'
  end

  test "school with more than one student registered should be valid " do
    students = TestDataFactory.newStudents([{name: 'A Valid Student', unique_id: "S2"}, {name: 'A Valid Student', unique_id: "S3"}])

    @school.students = students
    assert @school.valid? 'School with several unique students, was invalid'
  end

end
