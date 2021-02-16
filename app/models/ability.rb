# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    if user.has_role? :teacher
      can :manage, :all
      can :manage, Student, customer_id: user.customers.map { |c| c.id }
    elsif user.has_role? :student
      can :read, Student
    end
  end
end
