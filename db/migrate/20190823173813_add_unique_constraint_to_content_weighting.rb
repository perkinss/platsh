class AddUniqueConstraintToContentWeighting < ActiveRecord::Migration[5.2]
  def change
    add_index :content_weightings, [:user_id, :content_id], unique: true
  end
end
