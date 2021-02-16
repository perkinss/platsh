class CreateAssessmentTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :assessment_types do |t|
      t.string :name

      t.timestamps
    end
  end
end
