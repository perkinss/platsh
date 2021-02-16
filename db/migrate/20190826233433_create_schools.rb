class CreateSchools < ActiveRecord::Migration[5.2]
  def change
    create_table :schools do |t|
      t.string :name
      t.integer :school_code
      t.integer :district_number
      t.string :city

      t.timestamps
    end
  end
end
