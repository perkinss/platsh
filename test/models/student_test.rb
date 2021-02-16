require 'test_helper'
require 'test_data_factory'

class StudentTest < ActiveSupport::TestCase
  def setup
    TestDataFactory.setDefaultUser(TestDataFactory.createUser)
    @student = TestDataFactory.newStudent(name: 'A Valid Student', unique_id: "S1", grade: '10')
    @student.save
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  test "valid student" do
    assert @student.valid? 'Student with a name and unique_id was invalid'
  end

  test "invalid student" do
    @student.name = ''
    refute @student.valid? 'Student without a name was valid'
  end

  test "valid non-unique student" do
    student2 = TestDataFactory.newStudent(name: 'A Valid Student', unique_id: "S2", grade: '5')
    assert student2.valid? 'Student with a non-unique name but a unique id was invalid'
  end

  test "invalid non-unique student" do
    student2 = TestDataFactory.newStudent(name: 'A Valid Student', unique_id: "S1")
    refute student2.valid? 'Student with a non-unique name and non unique id was valid'
  end

  test "student can have a grade" do
    @student.grade = '10'
    assert @student.valid? 'Student with a grade was invalid'
  end

  test "student can have an email" do
    @student.email = 'weoiru@werwer.sdf'
    assert @student.valid? 'Student with an email was invalid'
  end

  test 'student cannot have an invalid email' do
    @student.email = '@@@#*'
    refute @student.valid? 'Student with an invalid email was valid'
  end

  test "student can have a pronoun" do
    @student.pronoun = 'He/Him/His'
    assert @student.valid? 'Student with a pronoun was invalid'
  end

  test 'student cannot have an invalid prounoun' do
    @student.pronoun = 'Pizza/Delivery/Service'
    refute @student.valid? 'Student with an invalid email was valid'
  end

  test "student can have a preferred name" do
    @student.preferred_name = 'Stu'
    assert @student.valid? 'Student with a pronoun was invalid'
  end

  test "student must have a grade that matches K-12" do
    @student.grade = 'K'
    assert @student.valid? 'Student with a valid grade was invalid'
  end

  test 'student cannot have no grade' do
    @student.grade = nil
    refute @student.valid? 'Student with no grade was valid'
  end

  test 'student cannot have an invalid grade' do
    @student.grade = '100'
    refute @student.valid? 'Student with invalid grade was valid'
  end
end
