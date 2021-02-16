class PopulateStandards < ActiveRecord::Migration[5.2]
  def change
    Standard.delete_all
    Standard.create(content_id: Content.find_by_name('operations').id,
                      description: 'compare and order rational numbers')
    Standard.create(content_id: Content.find_by_name('operations').id,
                    description: 'estimate the square root of rational number')
    Standard.create(content_id: Content.find_by_name('operations').id,
                    description: 'add and subtract with decimal numbers')
    Standard.create(content_id: Content.find_by_name('operations').id,
                    description: 'add and subtract with numbers in fraction form')
    Standard.create(content_id: Content.find_by_name('operations').id,
                    description: 'multiply and divide with decimal numbers')
    Standard.create(content_id: Content.find_by_name('operations').id,
                    description: 'multiply and divide with numbers in fraction form')
    Standard.create(content_id: Content.find_by_name('operations').id,
                    description: 'use order of operations to simply expressions with rational numbers')

    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'write and evaluate Powers')
    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'use exponent laws to simplify a product of powers with same base')
    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'use exponent laws to simplify a quotient of a power with the same base')
    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'use exponent laws to simplify a power raised to an exponent')
    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'use exponent laws to simplify a product that is raised to a power')
    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'use exponent laws to simplify a quotient that is raised to a power')
    Standard.create(content_id: Content.find_by_name('exponents').id,
                    description: 'use order of operations to simplify expressions with rational numbers')

    Standard.create(content_id: Content.find_by_name('polynomials').id,
                    description: 'classify polynomial expressions')
    Standard.create(content_id: Content.find_by_name('polynomials').id,
                    description: 'add and subtract polynomials')
    Standard.create(content_id: Content.find_by_name('polynomials').id,
                    description: 'multiply polynomials')
    Standard.create(content_id: Content.find_by_name('polynomials').id,
                    description: 'divide polynomials')


    Standard.create(content_id: Content.find_by_name('two-variable linear relations').id,
                    description: 'distinguish between linear and non-linear patterns')
    Standard.create(content_id: Content.find_by_name('two-variable linear relations').id,
                    description: 'write equations to represent linear patterns')
    Standard.create(content_id: Content.find_by_name('two-variable linear relations').id,
                    description: 'describe characteristics and trends for linear graphs')
    Standard.create(content_id: Content.find_by_name('two-variable linear relations').id,
                    description: 'graph linear relations')
    Standard.create(content_id: Content.find_by_name('two-variable linear relations').id,
                    description: 'predict values by interpolation and extrapolation')


    Standard.create(content_id: Content.find_by_name('linear equations').id,
                    description: 'solve two-step linear equations')
    Standard.create(content_id: Content.find_by_name('linear equations').id,
                    description: 'solve linear equations containing brackets')
    Standard.create(content_id: Content.find_by_name('linear equations').id,
                    description: 'solve multi-step linear equations')

    Standard.create(content_id: Content.find_by_name('financial literacy').id,
                    description: 'calculate income, expenses and savings')
    Standard.create(content_id: Content.find_by_name('financial literacy').id,
                    description: 'analyze bank statements')
    Standard.create(content_id: Content.find_by_name('financial literacy').id,
                    description: 'calculate simple interest')
    Standard.create(content_id: Content.find_by_name('financial literacy').id,
                    description: 'create a budget including fixed and variable expenses')

    Standard.create(content_id: Content.find_by_name('statistics').id,
                    description: 'understand factors that affect data collection')
    Standard.create(content_id: Content.find_by_name('statistics').id,
                    description: 'define population and sample in a survey')
    Standard.create(content_id: Content.find_by_name('statistics').id,
                    description: 'identify sampling methods')
    Standard.create(content_id: Content.find_by_name('statistics').id,
                    description: 'identify and critique misrepresented data')

    Standard.create(content_id: Content.find_by_name('proportional reasoning').id,
                    description: 'convert between SI units for length')
    Standard.create(content_id: Content.find_by_name('proportional reasoning').id,
                    description: 'perform calculations involving scale and scale factors')
    Standard.create(content_id: Content.find_by_name('proportional reasoning').id,
                    description: 'create scale diagrams')
    Standard.create(content_id: Content.find_by_name('proportional reasoning').id,
                    description: 'use proportional reasoning to solve questions involving similar triangles')

  end
end
