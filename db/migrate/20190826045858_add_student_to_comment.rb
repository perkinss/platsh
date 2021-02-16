class AddStudentToComment < ActiveRecord::Migration[5.2]
  def change
    add_reference :comments, :student, foreign_key: true
  end
end
