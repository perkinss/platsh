class AddDefaultCustomer < ActiveRecord::Migration[5.2]
  def up
    if (User.exists?)
      customer = Customer.create(name: 'Default System Customer')
      Student.where(customer_id: nil).update_all(customer_id: customer.id)
      User.find_each do |user|
        CustomerUser.create(customer: customer, user: user)
      end
    end
  end

  def down
    customer = Customer.where(name: 'Default System Customer').first
    if (customer)
      Student.where(customer_id: customer.id).update_all(customer_id: nil)
      CustomerUser.where(customer_id: customer.id).delete_all
      customer.delete
    end
  end
end
