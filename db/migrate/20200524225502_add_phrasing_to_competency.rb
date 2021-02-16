class AddPhrasingToCompetency < ActiveRecord::Migration[6.0]
  def change
    add_column :competencies, :phrasing, :string
  end
end
