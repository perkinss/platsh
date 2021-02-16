require 'test_helper'

class ContentTest < ActiveSupport::TestCase
  test "valid content" do
    content = Content.new(description: 'I have no name')
    refute content.valid?, 'content is valid without a name'

    content.name = 'I been to the desert on a Course with no name'
    refute content.valid?, 'content is valid without a course'

    content.course = Course.new(title: 'A Course')
    assert content.valid?, 'Content is invalid with all three required elements (name, description, course)'
  end

  test "valid course for content" do
    course = Course.new(title: 'A Course')
    course.save
    content = Content.new(name: 'Some content', description: '', course: course)
    assert(content.course.id == course.id)
  end

  test "weightings are deleted when content deleted" do
    course = Course.create!(title: 'A Course')
    content = Content.create!(name: 'Some content', description: 'bah', course: course)
    weighting = ContentWeighting.create!(content: content, weight: 5, user: User.create!(name: 'A teacher', email: "a@b.c", password: "apassword"))
    weighting2 = ContentWeighting.create!(content: content, weight: 5, user: User.create!(name: 'Another teacher', email: "a@b.ca", password: "ohapassword"))
    assert weighting.valid?
    assert weighting2.valid?
    assert content.content_weightings.include?(weighting)
    assert content.content_weightings.include?(weighting2)
    assert ContentWeighting.exists?(weighting.id)
    assert ContentWeighting.exists?(weighting2.id)

    content.destroy
    refute ContentWeighting.exists?(weighting.id)
    refute ContentWeighting.exists?(weighting2.id)
  end
end
