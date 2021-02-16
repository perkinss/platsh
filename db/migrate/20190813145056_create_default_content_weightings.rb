class CreateDefaultContentWeightings < ActiveRecord::Migration[5.2]
  def change
    create_table :default_content_weightings do |t|
      t.references :content, foreign_key: true
      t.integer :weight

      t.timestamps
    end
  end
end
