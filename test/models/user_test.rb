require 'test_helper'
require 'test_data_factory'

class UserTest < ActiveSupport::TestCase

  def setup
    @user = User.create!(name: "Test User", email: "user@example.com",
                         password: "apassword", password_confirmation: "apassword")
  end

  test 'new user has teacher role by default' do
    assert @user.has_role? :teacher
    assert @user.roles.length == 1
  end

  test 'new user does not get teacher role when another role is provided' do
    new_user = User.new(name: "Test User2", email: "user2@example.com", password: "apassword")
    new_user.add_role :test_role
    new_user.save!

    assert new_user.has_role? :test_role
    refute new_user.has_role? :teacher
  end

  test 'user can belong to multiple schools' do
    school1 = School.create!(name: 'School for Mule', school_code: 123, district_number: 61)
    school2 = School.create!(name: 'School for Mule', school_code: 12, district_number: 61)
    school3 = School.create!(name: 'School for Mule', school_code: 13, district_number: 61)
    @user.schools = [school1, school2, school3]

    assert @user.valid?
    assert school1.valid?
    assert school2.valid?
    assert school3.valid?

    assert @user.schools.length == 3
    
  end

  test 'user can belong to multiple schools, but only once' do
    school1 = School.create!(name: 'School for Mule', school_code: 123, district_number: 61)
    school2 = School.create!(name: 'School for Mule', school_code: 12, district_number: 61)
    school3 = School.create!(name: 'School for Mule', school_code: 13, district_number: 61)
    @user.schools = [school1, school2, school3]
    @user.save

    assert @user.valid?
    assert @user.schools.length == 3

    begin
      @user.schools.push(school1)
      @user.save
    rescue ActiveRecord::RecordNotUnique => e
      assert e.to_s.include? "index_school_users_on_school_id_and_user_id"
    end

    assert @user.schools.length == 3
  end

  test 'current_customer provides first customer when user has multiples' do
    @user.customers = [TestDataFactory.createCustomer({ name: "Customer 1" }), TestDataFactory.createCustomer({ name: "Customer 2" })]
    @user.save

    customer = @user.current_customer

    assert_equal "Customer 1", customer.name
  end

  test "current_customer creates customer with user's name when customer not present" do
    customer = @user.current_customer

    reloaded_user = User.find(@user.id)
    assert_equal @user.email, reloaded_user.customers[0].name
    assert_equal reloaded_user.customers[0], customer
  end

  test "is_student_authorized should allow user with student role to access their own record" do
    stu = TestDataFactory.createStudent
    stu_user = TestDataFactory.createUser(roles: [:student], students: [stu])

    assert stu_user.is_student_authorized(stu)
  end

  test "is_student_authorized should not allow user with revoked student role to access student records" do
    stu = TestDataFactory.createStudent
    stu_user = TestDataFactory.createUser(roles: [:student], students: [stu])
    stu_user.roles.clear
    stu_user.save!

    refute stu_user.is_student_authorized(stu)
  end

  test "is_student_authorized should not allow user with student role to access another students record" do
    stu = TestDataFactory.createStudent
    stu2 = TestDataFactory.createStudent
    stu_user = TestDataFactory.createUser(roles: [:student], students: [stu])

    refute stu_user.is_student_authorized(stu2)
  end

end
