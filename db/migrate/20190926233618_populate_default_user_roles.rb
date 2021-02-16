class PopulateDefaultUserRoles < ActiveRecord::Migration[5.2]
  def up
    User.find_each do |user|
      user.assign_default_role
      user.save!
    end
  end
end
