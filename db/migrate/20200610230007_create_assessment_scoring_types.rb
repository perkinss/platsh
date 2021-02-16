class CreateAssessmentScoringTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :assessment_scoring_types do |t|
      t.string :name
      t.timestamps
    end
    analytic = AssessmentScoringType.create(:name => "Analytic")
    AssessmentScoringType.create(:name => "Holistic")
    add_reference :assessments, :assessment_scoring_type, foreign_key: true, null: false, default: analytic.id
  end
end
