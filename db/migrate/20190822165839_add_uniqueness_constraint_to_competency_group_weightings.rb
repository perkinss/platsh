class AddUniquenessConstraintToCompetencyGroupWeightings < ActiveRecord::Migration[5.2]
  def change
    add_index :competency_group_weightings, [:user_id, :competency_group_id, :course_id], unique: true, name: 'index_cg_weighting_unique_course_user_competencygroup'
  end
end
