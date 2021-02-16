class CreateSchoolUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :school_users, id: false do |t|
      t.references :school, foreign_key: true
      t.references :user, foreign_key: true
    end
  end
end
