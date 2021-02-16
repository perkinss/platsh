class RenameMath10ToFoundationsOfMathematicsAndPrecalculus10 < ActiveRecord::Migration[5.2]
  def up
    course = Course.find_by_title("Math 10" )
    course.update(:title => "Foundations of Mathematics and Precalculus 10" )
    course.save
  end

  def down
    course = Course.find_by_title("Foundations of Mathematics and Precalculus 10")
    course.update(:title => "Math 10" )
    course.save
  end
end
