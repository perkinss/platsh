require 'test_helper'

class CourseTest < ActiveSupport::TestCase

  def setup
    @user = User.create!(name: "Test User", email: "user@example.com",
                         password: "apassword", password_confirmation: "apassword")
    @courses = [Course.new(title: "Test course", grade: '9', subject: 'math'), Course.new(title: "Another Test course", grade: '10', subject: 'math') ]
    @section = Section.new(name: "Section of Test", user_id: @user.id)
  end

  test "valid course" do
    course = Course.new(title: 'A Course')
    assert course.valid? 'Course with a title was invalid'

    course.title = ''
    refute course.valid? 'Course without a title was valid'
  end

  test "course should be able to have many sections" do
    sections = [Section.create!(name: "Section of Test", user_id: @user.id), Section.create!(name: "Another of Test", user_id: @user.id)]
    course = Course.create!(title: 'A Course', sections: sections)

    assert_equal course.sections.size, 2
    assert_equal sections[0].courses.size, 1
    assert_equal sections[0].courses[0], course
  end
end
