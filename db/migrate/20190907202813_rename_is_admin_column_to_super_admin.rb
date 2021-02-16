class RenameIsAdminColumnToSuperAdmin < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :is_admin, :superadmin
  end
end
