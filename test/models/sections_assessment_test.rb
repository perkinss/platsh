require 'test_helper'

class SectionsAssessmentTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(name: 'A teacher', email: "a@b.c", password: "ohcrapapassword")
    @assessment = Assessment.create!(name: 'test 1', user: @user, assessment_type: AssessmentType.create!(name: "type 1"), assessment_scoring_type: AssessmentScoringType.create!(name: 'score type 1'))
    @section = Section.create!(name: "Sectionée", user_id: @user.id)
    @first = SectionsAssessment.create(assessment: @assessment, section: @section)
  end

  test "Should be able to have an assessment added to a section " do
    assert @first.valid? 'SectionAssessment with section and assessment was invalid'
  end

  test "Should only be able to have an assessment added once to a section" do

    dup = SectionsAssessment.create(assessment: @assessment, section: @section)
    refute dup.valid? 'Duplicate section assessment was valid'
  end
end
