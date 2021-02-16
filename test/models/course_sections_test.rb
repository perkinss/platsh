require 'test_helper'

class CoursesSectionTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    @course = Course.new(title: "C1")
    @section = Section.create!(name: "Sectionée", user_id: @user.id)
    @first = CoursesSection.create(course: @course, section: @section)
  end

  test "Should be able to have a course added to a section " do
    assert assert @section.courses.size == 1
    assert CoursesSection.where(course: @course, section: @section).size == 1
  end

  test "Should only be able to have a course added once to a section" do
    CoursesSection.create(course: @course, section: @section)
    refute @section.courses.size == 2
    assert @section.courses.size == 1
    assert CoursesSection.where(course: @course, section: @section).size == 1
  end

  test "removing courses from section should remove the association" do
    @section.courses = []
    @section.save
    assert @section.courses.size == 0
    assert CoursesSection.where(course: @course, section: @section).empty?
  end

  test "unique courses_section with different section should be valid" do
    s2 = Section.create!(name: "Sectionée", user_id: @user.id)
    CoursesSection.create(course: @course, section: s2)
    assert @course.sections.size == 2
    assert @section.courses.size == 1
    assert CoursesSection.where(course: @course, section: @section).size == 1
    assert CoursesSection.where(course: @course, section: s2).size == 1
  end

  test "unique courses section with a different course should be valid" do
    c2 = Course.new(title: "C1")
    CoursesSection.create(course: c2, section: @section)
    assert @course.sections.size == 1
    assert @section.courses.size == 2
    assert CoursesSection.where(course: c2, section: @section).size == 1
    assert CoursesSection.where(course: @course, section: @section).size == 1
  end
end
