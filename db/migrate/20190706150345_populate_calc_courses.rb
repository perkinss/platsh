class PopulateCalcCourses < ActiveRecord::Migration[5.2]
  def change
    Course.create(:title => "Pre-calculus 11", :grade => '11', :subject => 'Mathematics')
    Course.create(:title => "Pre-calculus 12", :grade => '12', :subject => 'Mathematics')
  end
end
