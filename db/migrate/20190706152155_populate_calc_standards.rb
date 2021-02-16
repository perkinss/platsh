class PopulateCalcStandards < ActiveRecord::Migration[5.2]
  def change
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Real number system' ),
                    description: 'classify a number as natural, whole integer, rational, or irrational')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational exponents'),
                    description: 'apply the exponent laws to expressions with rational number bases and rational number exponents')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational exponents'),
                    description: 'apply the exponent laws to expressions with variable bases and rational number exponents')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational exponents'),
                    description: 'convert between powers with rational exponents and radicals')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'convert between mixed radicals and entire radicals')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'compare and order radical expressions')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'identify restrictions on the values for a variable in a radical expression')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'simplify radical expressions involving addition and subtraction')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'perform multiple operations on radical expressions')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'rationalize the denominator')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'determine the roots of a radical equation graphically')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Radicals'),
                    description: 'determine the roots of a radical equation algebraically')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'polynomial factoring'),
                    description: 'determine the prime factors of whole numbers')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'polynomial factoring'),
                    description: 'determine the greatest common factor of whole numbers')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'polynomial factoring'),
                    description: 'determine the least common multiple of whole numbers')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'polynomial factoring'),
                    description: 'factor trinomials of the form 𝘢𝑥² + 𝘣𝑥 + 𝘤, 𝘢 ≠ 0')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'polynomial factoring'),
                    description: 'factor difference of squares 𝘢²𝑥² - 𝘣²𝑥², 𝘢 ≠ 0 and 𝘣 ≠ 0')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'polynomial factoring'),
                    description: 'factor trinomials of the form 𝘢𝑓(𝑥²) + 𝘣𝑓(𝑥) + 𝘤 or 𝘢²𝑓(𝑥)² - 𝘣²𝑓(𝑥)²')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'determine non-permissible values for a rational expression')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'simplify a rational expression')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'determine the product of rational expressions in simplest form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'determine the quotient of rational expressions in simplest form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'determine, in simplified form, the sum or difference of rational expressions with the same denominator')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'determine, in simplified form, the sum or difference of rational expressions with different denominators')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Rational functions'),
                    description: 'solve a rational equation algebraically')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'determine the characteristics of a quadratic function in vertex form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'determine the characteristics of a quadratic function in standard form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'sketch a quadratic function in vertex form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'sketch a quadratic function in standard form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'convert a quadratic function from standard to vertex form')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'solve quadratic equations graphically')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Quadratic functions'),
                    description: 'solve quadratic equations algebraically')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Inequalities'),
                    description: 'graph a linear inequality using technology')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Inequalities'),
                    description: 'gsketch the graph of a linear inequality without technology')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Inequalities'),
                    description: 'sketch the solution graph of a quadratic inequality in one variable')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Inequalities'),
                    description: 'express the solution to a quadratic inequality in one variable using algebraic notation')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'generalize the equation of a circle with centre (0, 0) and radius r')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine the coordinates of points on the unit circle')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'sketch an angle from 0° to 360° in standard position')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine the reference angle for an angle in standard position')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine the quadrant in which an angle in standard position terminates')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine the exact values of sine, cosine, and tangent ratios of a given angle with reference angle 0°, 30°, 45°, or 60°, 90°, 180°, 270°, or 360°')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine the distance from the origin to a point (x, y) on the terminal arm of an angle')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine the value of sin θ, cos θ, or tan θ given any point (x, y) on the terminal arm of angle θ')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine all values of θ in an equation involving sine, cosine, and tangent')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'use the primary trigonometric ratios to solve problems involving triangles that are not right triangles')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine unknown angle measures and side lengths using the sine law')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine unknown side lengths or angle measures involving the sine law in an ambiguous case')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'determine an unknown angle measure or side length using the cosine law')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Trigonometry'),
                    description: 'solve a triangle by determining all unknown side lengths and angle measures')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Financial literacy'),
                    description: 'use the compound interest formula to determine one of annual interest rate, principal, initial amount, time, or number of compounding periods given the other parameters')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Financial literacy'),
                    description: 'determine, with and without technology, the future value, present value, or interest of a loan with a single payment')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Financial literacy'),
                    description: 'determine, using technology, the term, payment, interest, or total interest of a loan with regular payments')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 11")[0].id, 'Financial literacy'),
                    description: 'determine the value of an asset that depreciates or appreciates')


    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Transformations'),
                    description: 'determine the effects that function parameters have on the graph of a function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Transformations'),
                    description: 'sketch the graph of a function with given parameters')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Transformations'),
                    description: 'write the equation of a function given the graph of the function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Transformations'),
                    description: 'sketch the graph of the inverse of a relation')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Transformations'),
                    description: 'determine if a relation and its inverse are functions')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Transformations'),
                    description: 'determine the equation of an inverse')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Exponential'),
                    description: 'sketch the graph of a given exponential function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Exponential'),
                    description: 'determine the equation of an exponential function given its graph')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Exponential'),
                    description: 'determine the solution to an exponential equation in which the bases are powers of one another')


    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'write a logarithmic function as an exponential function and vice versa')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'sketch the graph of logarithmic function in any base')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'determine the equation of a logarithmic function given its graph')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'determine an unknown in a logarithmic expression')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'simplify and evaluate logarithmic expressions using the laws of logarithms')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'determine the solution to an exponential equation in which the bases are not powers of one another')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Logarithms'),
                    description: 'determine if a solution to a logarithmic equation is extraneous')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Geometric'),
                    description: 'determine the first term, ratio, number of terms, or general term of a geometric sequence given the remaining information')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Geometric'),
                    description: 'determine the first term, ratio, number of terms, general term, or sum of a geometric series given the remaining information')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Geometric'),
                    description: 'determine the first term, ratio, general term, or sum of an infinite geometric series given the remaining information')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Polynomial'),
                    description: 'sketch the graph of a given polynomial function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Polynomial'),
                    description: 'determine the equation of a polynomial function given its graph')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Polynomial'),
                    description: 'determine the solution to a polynomial equation')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Polynomial'),
                    description: 'divide a polynomial by a binomial using long division or synthetic division')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Polynomial'),
                    description: 'factor a polynomial using the remainder theorem, factor theorem and integral zero theorem')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Rational functions'),
                    description: 'sketch the graph of a given rational function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Rational functions'),
                    description: 'determine the equation of a rational function given its graph')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Rational functions'),
                    description: 'determine the non-permissible values of a rational function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Rational functions'),
                    description: 'describe the behavior of a rational function near any non-permissible values and as |x| becomes very large')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Rational functions'),
                    description: 'determine the solution to a rational equation algebraically and graphically')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Rational functions'),
                    description: 'determine if a solution to a rational equation is extraneous')

    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'sketch angles in standard position in degrees and radians')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'convert between degree and radian measure')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine coterminal angles to a given angle in radian measure')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine arc length or radius in a circle')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine the coordinates of points on the unit circle')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine the exact values of sine, cosine, and tangent ratios of a given angle with reference angle π/6, π/4, or π/3')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine the approximate values of sine, cosine, and tangent ratios of a given angle')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine exact and approximate solutions of a trigonometric equation in a given domain')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'sketch the graph of a given trigonometric function')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine the equation of a trigonometric function given its graph')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'determine non-permissible values of trigonometric identities')
    Standard.create(content: Content.find_by_course_id_and_name(Course.where(title: "Pre-calculus 12")[0].id, 'Trigonometry'),
                    description: 'use identities to reduce complexity in trigonometric expressions and solve equations')
  end
end
