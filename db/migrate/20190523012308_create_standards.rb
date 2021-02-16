class CreateStandards < ActiveRecord::Migration[5.2]
  def change
    create_table :standards do |t|
      t.references :content, foreign_key: true
      t.string :description

      t.timestamps
    end
  end
end
