class RenameUuidToUniqueId < ActiveRecord::Migration[5.2]
  def change
    rename_column :students, :UUID, :unique_id
  end
end
