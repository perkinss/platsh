class CreateContents < ActiveRecord::Migration[5.2]
  def change
    create_table :contents do |t|
      t.string :name
      t.string :description
      t.references :course, foreign_key: true

      t.timestamps
    end
  end
end
