class TestDataFactory
  @@defaultUser = nil

  def self.setDefaultUser(user)
      @@defaultUser = user
  end

  def self.newCustomer(args = {})
    defaults = { name: "Test Customer" }
    Customer.new(defaults.merge(args))
  end

  def self.createCustomer(args = {})
    customer = newCustomer(args)
    customer.save!
    customer
  end

  def self.createUser(args = {})
    defaults = { name: 'aname', email: 'goo@goo.gle', password: 'somepassword', confirmed_at: Date.today }

    attributes = defaults.merge(args.except(:customer, :roles))
    attributes[:customers] = args.key?(:customer) ? (args[:customer] ? [args[:customer]]: []) : [createCustomer]

    user = User.new(attributes)
    args[:roles].each { |role| user.add_role(role) } if args.key?(:roles)
    user.save!
    user
  end

  def self.newStudent(args = {})
    defaults = { name: 'Student Name', unique_id: "12345", grade: '1'}

    attributes = defaults.merge(args)
    if (!attributes[:customer])
      attributes[:customer] = @@defaultUser ? @@defaultUser.customers[0] : newCustomer
    end

    Student.new(attributes)
  end

  def self.newStudents(args = [{}])
    defaultCustomer = @@defaultUser ? @@defaultUser.customers[0] : newCustomer
    args.map do |arg|
      arg[:customer] = defaultCustomer unless arg[:customer]
      newStudent(arg)
    end
  end

  def self.createStudent(args = {})
    student = newStudent(args)
    student.save!
    student
  end

  def self.createStudents(args = [{}])
    newStudents(args).each { |student| student.save! }
  end

  def self.createSchool(args = {})
    defaults = { name: 'My School', school_code: "123456" }
    attributes = defaults.merge(args)
    School.create!(attributes)
  end
end
