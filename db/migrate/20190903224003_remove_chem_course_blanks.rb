class RemoveChemCourseBlanks < ActiveRecord::Migration[5.2]
  def change
    if ActiveRecord::Base.connection.data_source_exists? 'kittens'
      course1 = Course.find_by_title("Chemistry 11")
      course1.destroy if course1
      course2 = Course.find_by_title("Chemistry 12")
      course2.destroy if course2
    end
  end
end
