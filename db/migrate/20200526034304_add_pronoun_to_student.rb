class AddPronounToStudent < ActiveRecord::Migration[6.0]
  def change
    add_column :students, :pronoun, :string, default: 'They/Them/Their'
  end
end
