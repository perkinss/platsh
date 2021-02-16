class AddPreferredNameToStudent < ActiveRecord::Migration[6.0]
  def change
    add_column :students, :preferred_name, :string
  end
end
