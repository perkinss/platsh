class PopulateCalcContents < ActiveRecord::Migration[5.2]
  def change
    Content.create(:name => "Real number system",  :description => 'real number system', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Rational exponents",  :description => 'powers with rational exponents', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Radicals",  :description => 'radical operations and equations', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "polynomial factoring",  :description => 'polynomial factoring', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Rational functions",  :description => 'rational expressions and equations', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Quadratic functions",  :description => 'quadratic functions and equations', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Inequalities",  :description => 'linear and quadratic inequalities', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Trigonometry",  :description => 'non-right triangles and angles in standard position', :course => Course.where(title: "Pre-calculus 11")[0])
    Content.create(:name => "Financial literacy",  :description => 'compound interest, investments, loans', :course => Course.where(title: "Pre-calculus 11")[0])

    Content.create(:name => "Transformations",  :description => 'transformations of functions and relations', :course => Course.where(title: "Pre-calculus 12")[0])
    Content.create(:name => "Exponential",  :description => 'exponential functions and equations', :course => Course.where(title: "Pre-calculus 12")[0])
    Content.create(:name => "Logarithms",  :description => 'logarithms: operations, functions, and equations', :course => Course.where(title: "Pre-calculus 12")[0])
    Content.create(:name => "Geometric",  :description => 'geometric sequences and series', :course => Course.where(title: "Pre-calculus 12")[0])
    Content.create(:name => "Polynomial",  :description => 'polynomial functions and equations', :course => Course.where(title: "Pre-calculus 12")[0])
    Content.create(:name => "Trigonometry",  :description => 'trigonometry functions, equations, and identities', :course => Course.where(title: "Pre-calculus 12")[0])
  end
end
