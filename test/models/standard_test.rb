require 'test_helper'

class StandardTest < ActiveSupport::TestCase
  def setup
    @content = Content.new(course: Course.new(title: "course"), name: "Content", description: "d")
    @standard = Standard.new(content: @content, description: "should be valid")
    @standard.save
  end

  test "valid standard" do
    assert @standard.valid? 'Standard with a description and content was invalid'
  end

  test "invalid standard" do
    @standard.description = ''
    refute @standard.valid? 'Standard without a description was valid'
  end

  test "invalid content-less standard" do
    @standard.content = nil
    refute @standard.valid? 'Standard without content was valid'
  end

end
