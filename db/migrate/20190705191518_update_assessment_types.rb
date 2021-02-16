class UpdateAssessmentTypes < ActiveRecord::Migration[5.2]
  def change
      AssessmentType
          .where(:name => "Test")
          .update(:description =>
                      "Tests use a range of question types including true/false, multiple choice, ordering, short
answer/essay, fill-in-the blank, matching, etc. Test assessment types include, but are not limited to: Quizzes,
Diagnostic tests, Formative tests, and Summative tests.
          ")

    AssessmentType
        .where( :name => "Observation")
        .update(:name => "Observational",
                :description => "
Observational assessment allows teachers to record and report student demonstrations of learning.
For example, incidental observation is an unplanned opportunity that emerges where the teacher observes some aspect
of individual student learning. A planned observation involves deliberate planning of an opportunity for the teacher
to observe specific content standards or competencies.
")
      AssessmentType
          .where( :name => "Performance Based")
          .update(:name => "Performance-based",
                  :description => "
Performance-based assessment is open-ended and without a single, correct answer. The criteria
are addressed in a scoring rubric. Types include, but are not limited to:
Presentations, Portfolios, Performances, Projects, Exhibits/Fairs, and Debates.
")


  end
end
