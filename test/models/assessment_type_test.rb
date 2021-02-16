require 'test_helper'

class AssessmentTypeTest < ActiveSupport::TestCase

  def setup
    @assessmentType = AssessmentType.new(name: 'Testing')
  end

  test "valid assessment type" do
    assert @assessmentType.valid? 'Assessment Type with a name was invalid'
  end

  test "invalid assessment type" do
    @assessmentType.name = ''
    refute @assessmentType.valid? 'Assessment Type without a name was valid'
  end
end
