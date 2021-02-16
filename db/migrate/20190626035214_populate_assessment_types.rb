class PopulateAssessmentTypes < ActiveRecord::Migration[5.2]
  def change

    Assessment.delete_all
    AssessmentType.delete_all
    AssessmentType.create(:name => "Test", :description => "A Test type of assessment can be a test or a quiz")
    AssessmentType.create(:name => "Observation", :description => "An observation of the student")
    AssessmentType.create(:name => "Performance Based",
                          :description => "A performance based assessment might be a presentation, an essay, or other set of skill-demonstrating tasks")
  end
end
