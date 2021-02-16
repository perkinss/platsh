require 'test_helper'

class CompetencyGroupTest < ActiveSupport::TestCase

  def setup
    @competency_group = CompetencyGroup.new(title: 'Competency Group 1')
  end

  test "valid competency group" do
    assert @competency_group.valid? 'Competency Group with title was invalid'
  end

  test "invalid competency group" do
    @competency_group.title = ''
    refute @competency_group.valid? 'Competency Group without title was valid'
  end
end
