class PopulateContents < ActiveRecord::Migration[5.2]
  def self.up
    Content.create(:name => "operations", :description => 'operations with rational numbers (addition, subtraction, multiplication, division, and order of operations)', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "exponents",  :description => 'exponents and exponent laws with whole-number exponents', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "polynomials",  :description => 'operations with polynomials, of degree less than or equal to 2', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "two-variable linear relations",  :description => 'two-variable linear relations, using graphing, interpolation, and extrapolation', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "linear equations",  :description => 'multi-step one-variable linear equations', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "proportional reasoning",  :description => 'spatial proportional reasoning', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "statistics",  :description => 'statistics in society', :course => Course.where(title: "Math 9")[0] )
    Content.create(:name => "financial literacy",  :description => 'financial literacy — simple budgets and transactions', :course => Course.where(title: "Math 9")[0] )
  end

  def self.down
    Content.delete_all
  end
end
