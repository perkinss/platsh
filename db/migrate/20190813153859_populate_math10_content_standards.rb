class PopulateMath10ContentStandards < ActiveRecord::Migration[5.2]
  def up
    contents = [
        Content.create(:name => "Exponents and Radicals", :course => Course.find_by_title("Math 10") ),
        Content.create(:name => "Prime Factorization", :course => Course.find_by_title("Math 10" ) ),
        Content.create(:name => "Functions and Relations", :course => Course.find_by_title("Math 10" ) ),
        Content.create(:name => "Linear Functions", :course => Course.find_by_title("Math 10" ) ),
        Content.create(:name => "Arithmetic Sequences",  :course => Course.find_by_title("Math 10") ),
        Content.create(:name => "Systems of Linear Equations", :course => Course.find_by_title("Math 10") ),
        Content.create(:name => "Polynomial Multiplication",  :course => Course.find_by_title("Math 10") ),
        Content.create(:name => "Polynomial Factoring",   :course => Course.find_by_title("Math 10") ),
        Content.create(:name => "Right Triangle Trigonometry",  :course => Course.find_by_title("Math 10") ),
        Content.create(:name => "Financial Literacy",  :course => Course.find_by_title("Math 10") )
    ]


    Standard.create(content_id: contents[0].id,
                    description: 'Determine the square root of a perfect square')
    Standard.create(content_id: contents[0].id,
                    description: 'Determine the cube root of a perfect cube')
    Standard.create(content_id: contents[0].id,
                    description: 'Solve a problem involving square roots or cube roots')
    Standard.create(content_id: contents[0].id,
                    description: 'Apply the exponent laws to expressions using rational numbers as bases and integers as exponents')
    Standard.create(content_id: contents[0].id,
                    description: 'Apply the exponent laws to expressions using variables as bases and integers as exponents')
    Standard.create(content_id: contents[0].id,
                    description: 'Convert a power with a negative exponent to an equivalent power with a positive exponent')
    Standard.create(content_id: contents[0].id,
                    description: 'Solve problems that involve powers with integral exponents')

    Standard.create(content_id: contents[1].id,
                    description: 'Express a number as a product of prime factors using powers')
    Standard.create(content_id: contents[1].id,
                    description: 'Identify the factors of a number')
    Standard.create(content_id: contents[1].id,
                    description: 'Determine the greatest common factor (GCF) and least common multiple (LCM) of two or more terms')

    Standard.create(content_id: contents[2].id,
                    description: 'Describe a possible situation for a given graph')
    Standard.create(content_id: contents[2].id,
                    description: 'Sketch a graph for a given situation')
    Standard.create(content_id: contents[2].id,
                    description: 'Identify the independent and dependent variables in a relation')
    Standard.create(content_id: contents[2].id,
                    description: 'Express the domain and range of a relation in a variety of ways')
    Standard.create(content_id: contents[2].id,
                    description: 'Identify whether a relation is a function')
    Standard.create(content_id: contents[2].id,
                    description: 'Interpret the meaning of domain and range in both situational and non-situational contexts')
    Standard.create(content_id: contents[2].id,
                    description: 'Use function notation when analyzing or evaluating a function')

    Standard.create(content_id: contents[3].id,
                    description: 'Determine if a relation is linear')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine if data points in a linear function should or should not be connected')
    Standard.create(content_id: contents[3].id,
                    description: 'Classify the slope of a given situation or graph as positive, negative, zero or undefined')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine the slope of a linear function')
    Standard.create(content_id: contents[3].id,
                    description: 'Identify the rate of change in a problem situation')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine the point-slope form of a linear equation')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine the general form of a linear equation')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine the slope intercept form of a linear equation')
    Standard.create(content_id: contents[3].id,
                    description: 'Convert any form of a linear equation to a different form')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine the x- intercepts, y-intercept and slope of a linear equation')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine whether the graphs of two linear functions are parallel or perpendicular')
    Standard.create(content_id: contents[3].id,
                    description: 'Determine the equation of a line parallel or perpendicular to a given linear situation')
    Standard.create(content_id: contents[3].id,
                    description: 'Graph a linear function using a variety of equations forms with and without technology')

    Standard.create(content_id: contents[4].id,
                    description: 'Determine the common difference, first term, general term and number of terms to increasing and decreasing linear patterns')
    Standard.create(content_id: contents[4].id,
                    description: 'Solve problems involving the terms of an arithmetic sequence')
    Standard.create(content_id: contents[4].id,
                    description: 'Graph an arithmetic sequence as a discrete linear function')
    Standard.create(content_id: contents[4].id,
                    description: 'Determine the sum of the first k terms of an arithmetic series')
    Standard.create(content_id: contents[4].id,
                    description: 'Solve problems involving an arithmetic series')

    Standard.create(content_id: contents[5].id,
                    description: 'Solve a system of two linear equations graphically')
    Standard.create(content_id: contents[5].id,
                    description: 'Interpret the meaning of the point of intersection of two linear equations as having one solution, no solution, or infinitely many solutions')
    Standard.create(content_id: contents[5].id,
                    description: 'Model a linear system algebraically and graphically')
    Standard.create(content_id: contents[5].id,
                    description: 'Solve a linear system of equations algebraically using substitution')
    Standard.create(content_id: contents[5].id,
                    description: 'Solve a linear system of equations algebraically using elimination')
    Standard.create(content_id: contents[5].id,
                    description: 'Solve a linear system of equations algebraically by inspection')
    Standard.create(content_id: contents[5].id,
                    description: 'Solve linear system problems in situational contexts')

    Standard.create(content_id: contents[6].id,
                    description: 'Multiply two binomials')
    Standard.create(content_id: contents[6].id,
                    description: 'Multiply a binomial and a trinomia')
    Standard.create(content_id: contents[6].id,
                    description: 'Perform operations on products of polynomials')
    Standard.create(content_id: contents[6].id,
                    description: 'Solve problems involving polynomial multiplication')


    Standard.create(content_id: contents[7].id,
                    description: 'Identify the greatest common factor a polynomial')
    Standard.create(content_id: contents[7].id,
                    description: 'Factor a trinomial of the form 𝘢𝑥² + 𝘣𝑥 + 𝘤')
    Standard.create(content_id: contents[7].id,
                    description: 'Factor a difference of squares of the form 𝘢² - 𝘣²')
    Standard.create(content_id: contents[7].id,
                    description: 'Factor a perfect square trinomial')
    Standard.create(content_id: contents[7].id,
                    description: 'Solve contextual problems involving factoring')

    Standard.create(content_id: contents[8].id,
                    description: 'Identify the hypotenuse, opposite, and adjacent side for a given acute angle in a right triangle')
    Standard.create(content_id: contents[8].id,
                    description: 'Calculate the primary trigonometric ratios for a given acute angle in a right triangle')
    Standard.create(content_id: contents[8].id,
                    description: 'Solve for the unknown side length or angle in a right triangle given information about the tangent ratio involving the triangle')
    Standard.create(content_id: contents[8].id,
                    description: 'Solve for the unknown side length or angle in a right triangle given information about the sine or cosine ratio involving the triangle')
    Standard.create(content_id: contents[8].id,
                    description: 'Solve a contextual problem involving a primary trigonometric ratio in a right triangle')
    Standard.create(content_id: contents[8].id,
                    description: 'Solve a right triangle (with and without technology)')
    Standard.create(content_id: contents[8].id,
                    description: 'Solve problems involving two or more triangles')
    Standard.create(content_id: contents[8].id,
                    description: 'Solve problems involving angle of elevation/depression')

    Standard.create(content_id: contents[9].id,
                    description: 'Describe the differences between jobs including those that earn: an hourly wage plus tips; regular salaries; commission; piecework; and, contract work.')
    Standard.create(content_id: contents[9].id,
                    description: 'Calculate gross pay for a given time period with a variety of income types')
    Standard.create(content_id: contents[9].id,
                    description: 'Describe the differences between gross pay and net pay')
    Standard.create(content_id: contents[9].id,
                    description: 'Calculate deductions using a given percentage for taxes, CPP, and EI')
    Standard.create(content_id: contents[9].id,
                    description: 'Calculate net pay for a given time period')

  end

  def down
    Standard.where(content_id: Content.where(:course => Course.find_by_title("Math 10"))).destroy_all
    Content.where(:course => Course.find_by_title("Math 10")).destroy_all
  end
end
