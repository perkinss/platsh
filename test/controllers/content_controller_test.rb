require 'test_helper'

class ContentControllerTest < ActionDispatch::IntegrationTest

  test "should get the right content for a course" do
    course = Course.new(title: "atitle")
    course.save

    content = Content.new(name: "One", description: "Content 1", course: course)
    content.save

    content2 = Content.new(name: "Two", description: "Content 2", course: course)
    content2.save

    get course_contents_path(course),  params: {format: :json}
    assert_response :success
    json_result = JSON.parse(response.body)

    assert(json_result)
    assert(json_result.size).equal?(2)
    assert(json_result[0]['name']).equal?('One')
    assert(json_result[1]['name']).equal?('Two')
    assert(json_result[0]['description']).equal?('Content 1')
    assert(json_result[1]['description']).equal?('Content 2')
  end

end
