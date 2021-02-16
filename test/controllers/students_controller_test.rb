require 'test_helper'
require 'test_data_factory'

class StudentsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @customer = TestDataFactory.createCustomer
    create_user_and_sign_in(@customer)
  end

  def teardown
    TestDataFactory.setDefaultUser(nil)
  end

  def create_user_and_sign_in(customer, email = 'test@test.com')
    @user = TestDataFactory.createUser(customer: customer, email: email)
    @user.confirmed_at = Date.today
    @user.save
    TestDataFactory.setDefaultUser(@user)
    sign_in @user

    @uniqueid = 'TEST THIS id'
  end

  test "should get new" do

    params = { :name => "A new student", :unique_id => @uniqueid, :grade => '5', :format => :json }
    post students_new_url params
    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert_equal "A new student", json_result['name']

    assert_equal @uniqueid, json_result['unique_id']
    assert_not_nil json_result['id']
  end

  test "should place user's customer on new student" do
    params = { :name => "A new student", :unique_id => @uniqueid, :grade => '12', :format => :json }
    post students_new_url params
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    student = Student.find(json_result['id'])
    assert_equal @customer, student.customer
  end

  test "should generate customer if user has none when creating a student" do
    create_user_and_sign_in(nil, 'new_user@test.com')
    params = { :name => "A new student", :unique_id => @uniqueid, :grade => '5', :format => :json }

    post students_new_url params
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)

    user = User.find(@user.id)
    student = Student.find(json_result['id'])
    assert_equal 1, user.customers.size
    assert_not_equal @customer, user.current_customer
    assert_equal user.email, user.current_customer.name
    assert_equal user.current_customer, student.customer
  end

  test "should create new with email" do
    params = { :name => "A new student", :unique_id => @uniqueid, :email => 'e@mail.com', grade: 7, :format => :json }
    post students_new_url params
    assert_response :success
    json_result = JSON.parse(response.body)
    assert(json_result)
    assert_equal "A new student", json_result['name']

    assert_equal @uniqueid, json_result['unique_id']
    assert_not_nil json_result['id']
    assert_not_nil json_result['email']
  end

  test "should get list limited to current user's customer" do
    TestDataFactory.createStudents([
      { name: "Student 1", unique_id: "1", customer: @customer },
      { name: "Student 2", unique_id: "2", customer: @customer }
    ])
    TestDataFactory.createStudent({ name: "Student 3", unique_id: "3", customer: TestDataFactory.createCustomer })
    params = { :format => :json }

    get students_list_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal 2, json_result.size
  end

  test "should do remove" do
    stu = TestDataFactory.createStudent(name: "SFTUFF", unique_id: 'amyting')
    assert stu

    delete students_delete_url(stu.id), params: {:format => :json }
    assert_response :success
    assert @student.nil?
  end

  test "should fail removal when the customer is different" do
    stu = TestDataFactory.createStudent(name: "SFTUFF", unique_id: 'amyting', customer: TestDataFactory.createCustomer)

    delete students_delete_url(stu.id), params: {:format => :json }

    assert_response :forbidden
    json_result = JSON.parse(response.body)

    assert_not_nil json_result["message"]
    assert_not_nil Student.find(stu.id)
  end

  # print "\n\n#{JSON.pretty_generate(something.as_json)}"
  test "listing has enrollments and whether deletable" do

    @type = AssessmentType.create!(name: 'badabing', description: 'testing is for lugers')
    @scoring_type = AssessmentScoringType.create!(name: 'badaboom')
    @assessment = Assessment.new(name: 'First Assessment', user: @user, assessment_type: @type, assessment_scoring_type: @scoring_type)
    @tasks = [Task.create!(name:'Question 1', assessment: @assessment),Task.create!(name:'Question TWO', assessment: @assessment)]
    course = Course.create!(title: 'of course')
    section = Section.create!(name: 'Bedrock', courses: [course], user_id: @user.id)


    school = School.create!(name: "hohohoh", school_code: '123123')
    s = Standard.create!(description: "haha", content: Content.create!(name: 'foo', description: 'bar', course: course))
    Student.destroy_all
    assert Student.count == 0
    students = [
        TestDataFactory.createStudent(name: 'Boris', unique_id: '111', school: school),
        TestDataFactory.createStudent(name: 'Doris', unique_id: '222', school: school),
        TestDataFactory.createStudent(name: 'Morris', unique_id: '333', school: school)
    ]
    section.students = [students[0],students[1]]
    StandardObservation.create!(standard: s, student: students[0], user: @user, task: @tasks[1])
    params = { :format => :json }
    get students_list_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    # print "\n\n#{JSON.pretty_generate(json_result)}"
    assert json_result
    assert_equal 3, json_result.size
    stu1 = json_result.find { |student| student['name'] == 'Boris' }
    refute stu1['deletable']
    others = json_result.filter { |student| student['name'] != 'Boris' }
    others.each do |s|
      assert s['deletable']
    end

    stu2 = json_result.find { |student| student['name'] == 'Morris' }
    assert_equal false, stu2['has_enrollments']
    others = json_result.filter { |student| student['name'] != 'Morris' }
    others.each do |s|
      assert_equal true, s['has_enrollments']
    end
  end

  test "listing should exclude students not in schools when user has schools" do
    schools = [
        School.create!(name: "hohohoh", school_code: '123123'),
        School.create!(name: "nononon", school_code: '456456'),
        School.create!(name: "yesyesy", school_code: '789789')
    ]
    @user.schools = [schools[0], schools[2]]
    @user.save
    students = [
        TestDataFactory.createStudent(name: 'Boris', unique_id: '111', school: schools[0]),
        TestDataFactory.createStudent(name: 'Doris', unique_id: '222', school: schools[0]),
        TestDataFactory.createStudent(name: 'Morris', unique_id: '333', school: schools[1]),
        TestDataFactory.createStudent(name: 'Lauris', unique_id: '444', school: schools[1]),
        TestDataFactory.createStudent(name: 'Toris', unique_id: '555', school: schools[2])
    ]

    params = { :format => :json }
    get students_list_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    # print "\n\n#{JSON.pretty_generate(json_result)}"
    assert json_result
    assert_equal 3, json_result.size
    assert_equal ['Boris', 'Doris', 'Toris'], json_result.map{ |student| student['name'] }
  end

  test "listing should be ordered by grade descending then name" do
    Student.destroy_all
    students = [
        TestDataFactory.createStudent(name: 'Boris', unique_id: '111', grade: '1'),
        TestDataFactory.createStudent(name: 'Doris', unique_id: '222', grade: 'K'),
        TestDataFactory.createStudent(name: 'Morris', unique_id: '333', grade: '12'),
        TestDataFactory.createStudent(name: 'Forest', unique_id: '444', grade: '12'),
        TestDataFactory.createStudent(name: 'Lauris', unique_id: '555', grade: '2'),
        TestDataFactory.createStudent(name: 'Toris', unique_id: '666', grade: 'K'),
    ]

    params = { :format => :json }
    get students_list_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    # print "\n\n#{JSON.pretty_generate(json_result)}"
    assert json_result
    assert_equal students.length, json_result.size
    assert_equal ['Forest', 'Morris', 'Lauris', 'Boris', 'Doris', 'Toris'], json_result.map{ |student| student['name'] }
  end

  test "listing should include email address if existing" do
    Student.destroy_all
    students = [
        TestDataFactory.createStudent(name: 'Boris', unique_id: '111', grade: '1', email: 'B@rris.com'),
        TestDataFactory.createStudent(name: 'Doris', unique_id: '222', grade: 'K'),
    ]

    params = { :format => :json }
    get students_list_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    # print "\n\n#{JSON.pretty_generate(json_result)}"
    assert json_result
    assert_equal students.length, json_result.size
    assert_equal ['Boris', 'Doris'], json_result.map{ |student| student['name'] }
    assert_equal 'B@rris.com', json_result.find{ |student| student['name'] == 'Boris'}['email']
    assert_nil json_result.find{ |student| student['name'] == 'Doris'}['email']
  end

  test "list_for_student_user should return users students" do
    Student.destroy_all
    students = [
        TestDataFactory.createStudent(name: 'Boris', unique_id: '111', grade: '1', email: 'B@rris.com'),
        TestDataFactory.createStudent(name: 'Doris', unique_id: '222', grade: 'K', email: 'D@rris.com'),
    ]
    stu = TestDataFactory.createUser(name: "Stew User", roles: [:student], students: students)
    sign_in stu

    params = { :format => :json }
    get students_list_for_student_user_path params
    assert_response :success

    json_result = JSON.parse(response.body)
    assert json_result
    assert_equal students.length, json_result.size
    assert_equal ['Boris', 'Doris'], json_result.map{ |student| student['name'] }
  end

  test 'update responds with success' do
    stu = TestDataFactory.createStudent(name: "SFTUFF", unique_id: 'amyting')
    assert stu

    put students_update_path(stu), params: { format: :json }
  end

  test 'update updates the student and returns the updated student' do
    stu = TestDataFactory.createStudent(name: "SFTUFF", unique_id: 'amyting')
    assert stu
    school = School.create!(name: 'School is Cool', school_code: '123')

    stupdate = { id: stu.id, name: stu.name, unique_id: stu.unique_id, school: school.id, format: :json }
    put students_update_path(stu), params: stupdate

    json_result = JSON.parse(response.body)

    assert json_result['school'] == school.id
    assert json_result['name'] == stu.name
    assert json_result['unique_id'] == stu.unique_id
    s = Student.find(stu.id)
    assert s.school == school

    stupdate = { id: stu.id, name: "Better name", unique_id: stu.unique_id, school: school.id, grade: '12', format: :json }
    put students_update_path(stu), params: stupdate

    json_result = JSON.parse(response.body)

    s = Student.find(stu.id)
    assert s.name == 'Better name'
    assert s.grade == '12'
    assert json_result['school'] == school.id
    assert json_result['name'] == 'Better name'
    assert json_result['unique_id'] == stu.unique_id
    assert json_result['grade'] == '12'

  end

  test 'update the student with email address returns the updated student with email address' do
    stu = TestDataFactory.createStudent(name: "SFTUFF", unique_id: 'amyting')
    assert stu
    school = School.create!(name: 'School is Cool', school_code: '123')

    stupdate = { id: stu.id, name: stu.name, unique_id: stu.unique_id, email: 'john@j.c', school: school.id, format: :json }
    put students_update_path(stu), params: stupdate

    json_result = JSON.parse(response.body)

    assert json_result['school'] == school.id
    assert json_result['name'] == stu.name
    assert json_result['unique_id'] == stu.unique_id
    assert json_result['email'] == 'john@j.c'
    s = Student.find(stu.id)
    assert s.school == school

    stupdate = { id: stu.id, name: "Better name", unique_id: stu.unique_id, email: '', school: school.id, grade: '12', format: :json }
    put students_update_path(stu), params: stupdate

    json_result = JSON.parse(response.body)

    s = Student.find(stu.id)
    assert s.name == 'Better name'
    assert s.grade == '12'
    assert json_result['school'] == school.id
    assert json_result['name'] == 'Better name'
    assert json_result['unique_id'] == stu.unique_id

    assert json_result['grade'] == '12'
    assert_empty json_result['email']

  end

  test 'update retrieves the mapped data the updated student' do
    stu = TestDataFactory.createStudent(name: "SFTUFF", unique_id: 'amyting')
    assert stu
    school = School.create!(name: 'School is Cool', school_code: '123')

    stupdate = { id: stu.id, name: stu.name, unique_id: stu.unique_id, school: school.id, format: :json }
    put students_update_path(stu), params: stupdate

    json_result = JSON.parse(response.body)

    assert json_result['school'] == school.id
    assert json_result['name'] == stu.name
    assert json_result['unique_id'] == stu.unique_id
    s = Student.find(stu.id)
    assert s.school == school

    stupdate = { id: stu.id, name: "Better name", unique_id: stu.unique_id, school: school.id, grade: '12', format: :json }
    put students_update_path(stu), params: stupdate

    json_result = JSON.parse(response.body)

    s = Student.find(stu.id)
    assert s.name == 'Better name'
    assert s.grade == '12'
    assert json_result['school'] == school.id
    assert json_result['name'] == 'Better name'
    assert json_result['unique_id'] == stu.unique_id
    assert json_result['grade'] == '12'
    assert json_result['deletable'] == true
    assert json_result['has_enrollments'] == false

  end

  test 'should get enrolled students for section ' do
    students = [
        TestDataFactory.createStudent(name: 'Boris', unique_id: '111', school: schools[0]),
        TestDataFactory.createStudent(name: 'Doris', unique_id: '222', school: schools[0]),
        TestDataFactory.createStudent(name: 'Morris', unique_id: '333', school: schools[1]),
        TestDataFactory.createStudent(name: 'Lauris', unique_id: '444', school: schools[1]),
        TestDataFactory.createStudent(name: 'Toris', unique_id: '555', school: schools[2])
    ]
    section = Section.new(name: "a test section!", user_id: @user.id)
    section.students = students

    assert section.valid?
    section.save

    get students_enrolled_path(section), params: {format: :json}

    json_result = JSON.parse(response.body)
    assert json_result
    assert json_result.length == students.length
  end

  test 'enrolled students should be in alphabetical order of name ' do
    alphabetical_names = ['123Elmo','paul' ,'Ringo','zorin']
    students = [
        TestDataFactory.createStudent(name: alphabetical_names[3], unique_id: '111', school: schools[0]),
        TestDataFactory.createStudent(name: alphabetical_names[0], unique_id: '222', school: schools[0]),
        TestDataFactory.createStudent(name: alphabetical_names[2], unique_id: '333', school: schools[1]),
        TestDataFactory.createStudent(name: alphabetical_names[1], unique_id: '555', school: schools[2])
    ]
    section = Section.new(name: "a test section!", user_id: @user.id)
    section.students = students

    assert section.valid?
    section.save

    get students_enrolled_path(section), params: {format: :json}

    json_result = JSON.parse(response.body)
    assert json_result
    assert json_result.length == students.length
    result_names = json_result.map { |s| s['name'] }
    assert result_names == alphabetical_names
  end

  test 'should bulk upload students' do
    Student.destroy_all
    assert Student.count == 0
    school = School.create!(name: "bulkschool", school_code: '999888')
    csv_upload = fixture_file_upload('files/bulkstudents.csv', 'text/csv')
    params = { :school => school.id, :file => csv_upload, :format => :json }

    post students_import_url(), params: params
    assert_response :success

    json_result = JSON.parse(response.body)
    assert(json_result)
    assert json_result['status'] == "success"

    assert Student.count == 6
  end

  test 'invite should create user with student role' do
    stu = TestDataFactory.createStudent(name: "STUFFY", unique_id: 'anything', email: 'fake@fake.com')

    post students_user_invite_url(stu.id), params: { :format => :json }

    user = User.find_by(email: stu.email)
    assert_equal stu.name, user.name
    assert user.has_role? :student
    refute user.has_role? :teacher
    assert_equal [stu], user.students
  end

  test 'invite should fail when the user has no email' do
    stu = TestDataFactory.createStudent(name: "STUFFY", unique_id: 'anything')

    post students_user_invite_url(stu.id), params: { :format => :json }

    assert_response :bad_request
  end

  test 'invite should add second student when invited to a second customer' do
    customer1_student = TestDataFactory.createStudent(customer: @customer, email: 'student@email.com')
    student_user = TestDataFactory.createUser(roles: [:student], email: 'student@email.com', students: [customer1_student])
    customer2 = TestDataFactory.createCustomer
    customer2_student = TestDataFactory.createStudent(customer: customer2, email: 'student@email.com')
    customer2_teacher_user = TestDataFactory.createUser(email: 'teacher@email.com', customer: customer2)
    sign_in customer2_teacher_user

    post students_user_invite_url(customer2_student.id), params: { :format => :json }

    student_user = User.find(student_user.id) # Reload the student user record
    assert_equal 2, student_user.students.size
    assert student_user.students.find { |stu| stu == customer1_student }
    assert student_user.students.find { |stu| stu == customer2_student }
  end

  test 'invite should handle existing user without student role that gets turned into a student and invited by same email' do
    customer1 = TestDataFactory.createCustomer
    customer2 = TestDataFactory.createCustomer(name: 'Customer of student')
    student_user = TestDataFactory.createUser(customer: customer2, email: 'student@fake.com', name: 'STUFFY')
    student_user.confirmed_at = Date.today
    student_user.save

    teacher_user = TestDataFactory.createUser(customer: customer1, email: 'teacher@fake.com')
    teacher_user.confirmed_at = Date.today
    teacher_user.save

    sign_in teacher_user
    stu = TestDataFactory.createStudent(name: "STUFFY", unique_id: 'anything', email: 'student@fake.com', customer: customer1)

    post students_user_invite_url(stu.id), params: { :format => :json }

    user = User.find_by(email: stu.email)

    assert_equal stu.email, student_user.email
    assert user.has_role? :student
    assert user.has_role? :teacher

    other_student = TestDataFactory.createStudent(name: "FLUFFY", unique_id: 'anyone', email: 'other@fake.com', customer: customer1)
    sign_in student_user
    params = { :format => :json }
    get students_list_path params
    assert_response :success
    json_result = JSON.parse(response.body)

   assert_empty json_result

  end
end
