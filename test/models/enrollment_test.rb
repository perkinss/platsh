require 'test_helper'

class EnrollmentTest < ActiveSupport::TestCase

  def setup
    @student = Student.new(name: 'A Valid Student', unique_id: "S1")
    @student.save
    @section = Section.new(name: "Section 1", courses: [Course.create!(title: "acourse")])
    @enrollment = Enrollment.create!(student:@student, section: @section) #has to be created for the uniqueness validation to fail
  end

  test "valid enrollment" do
    assert @enrollment.valid? 'Enrollment with a name and section was invalid'
  end

  test "invalid enrollment with no student" do
    @enrollment.student = nil
    refute @enrollment.valid? "Enrollment with no student was valid"
  end

  test "invalid enrollment with no section" do
    @enrollment.section = nil
    refute @enrollment.valid? "Enrollment with no section was valid"
  end

  test "invalid enrollment with  duplicate" do
    second_enrollment = Enrollment.new(student:@student, section: @section)
    refute second_enrollment.valid? "Enrollment with same student and section was valid"
  end

end
