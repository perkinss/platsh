class RenameContentNamesForMath9 < ActiveRecord::Migration[5.2]
  def up
    content = Content.find_by_name("operations")
    if content
      content.update(name: "Rational Numbers")
      content.save
    end

    content = Content.find_by_name("exponents")
    if content
      content.update(name: "Powers and Exponents")
      content.save
    end

    content = Content.find_by_name("polynomials")
    if content
      content.update(name: "Polynomials")
      content.save
    end

    content = Content.find_by_name("two-variable linear relations")
    if content
      content.update(name: "Linear Relations")
      content.save
    end

    content = Content.find_by_name("linear equations")
    if content
      content.update(name: "Linear Equations")
      content.save
    end

    content = Content.find_by_name("proportional reasoning")
    if content
      content.update(name: "Scale Factors and Similarity")
      content.save
    end

    content = Content.find_by_name("statistics")
    if content
      content.update(name: "Data Analysis")
      content.save
    end

    content = Content.find_by_name("financial literacy")
    if content
      content.update(name: "Banking and Budgeting")
      content.save
    end
  end

  def down
    content = Content.find_by_name("Rational Numbers")
    if content
      content.update(name: "operations")
      content.save
    end

    content = Content.find_by_name("Powers and Exponents")
    if content
      content.update(name: "exponents")
      content.save
    end

    content = Content.find_by_name("Polynomials")
    if content
      content.update(name: "polynomials")
      content.save
    end

    content = Content.find_by_name("Linear Relations")
    if content
      content.update(name: "two-variable linear relations")
      content.save
    end

    content = Content.find_by_name("Linear Equations")
    if content
      content.update(name: "linear equations")
      content.save
    end

    content = Content.find_by_name("Scale Factors and Similarity")
    if content
      content.update(name: "proportional reasoning")
      content.save
    end

    content = Content.find_by_name("Data Analysis")
    if content
      content.update(name: "statistics")
      content.save
    end

    content = Content.find_by_name("Banking and Budgeting")
    if content
      content.update(name: "financial literacy")
      content.save
    end
  end
end
