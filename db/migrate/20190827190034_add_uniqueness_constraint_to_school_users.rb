class AddUniquenessConstraintToSchoolUsers < ActiveRecord::Migration[5.2]
  def change
    add_index :school_users, [:school_id, :user_id], unique: true
  end
end
