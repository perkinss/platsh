class CreateSectionsAssessments < ActiveRecord::Migration[5.2]
  def change
    create_table :sections_assessments do |t|
        t.belongs_to :section, index: true
        t.belongs_to :assessment, index: true
    end
  end
end
