class CreateCustomers < ActiveRecord::Migration[5.2]
  def change
    create_table :customers do |t|
      t.text :name

      t.timestamps
    end
    create_table :customer_users, id: false do |t|
      t.references :customer, foreign_key: true
      t.references :user, foreign_key: true
      t.timestamps
    end
    add_reference :students, :customer, foreign_key: true
    remove_index :students, :UUID
    add_index :students, [:UUID, :customer_id], unique: true
  end
end
