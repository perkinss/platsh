class PopulateCourses < ActiveRecord::Migration[5.2]
  def self.up
    Course.create(:title => "Math 9", :grade => '9', :subject => 'Mathematics')
    Course.create(:title => "Math 10", :grade => '10', :subject => 'Mathematics')
    Course.create(:title => "Chemistry 11", :grade => '11', :subject => 'Science')
    Course.create(:title => "Chemistry 12", :grade => '12', :subject => 'Science')
  end

  def self.down
    Course.delete_all
  end
end
