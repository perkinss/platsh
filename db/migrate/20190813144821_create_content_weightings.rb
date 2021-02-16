class CreateContentWeightings < ActiveRecord::Migration[5.2]
  def change
    create_table :content_weightings do |t|
      t.references :user, foreign_key: true
      t.references :content, foreign_key: true
      t.integer :weight

      t.timestamps
    end
  end
end
