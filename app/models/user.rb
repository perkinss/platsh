class User < ApplicationRecord
  rolify
  has_many :sections, dependent: :destroy
  has_many :assessments
  has_many :tasks, through: :assessments
  has_many :course_weightings, dependent: :destroy
  has_and_belongs_to_many :schools, :join_table => 'school_users', optional: true
  has_and_belongs_to_many :customers, :join_table => 'customer_users', optional: false
  # A user that has a "student" should be associated to student records
  has_and_belongs_to_many :students, :join_table => 'user_students', optional: true
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable, :confirmable,
		 :omniauthable, omniauth_providers: [:edvantage]
  after_create :assign_default_role

  def assign_default_role
    self.add_role(:teacher) if self.roles.blank?
  end

  # Add additional fields the default JSON output that are required in the client
  def as_json(options={})
    super(options).merge({ roles: self.roles.map { |role| role.name } })
  end

  # Gets the first customer associated with the user, or creates one if one does not exist
  # TODO For now, users should only have a single customer, but it is possible they may have > 1 in the future, in
  # which case this will need a bit of alteration to specify a customer.  Creation is implemented this way in a lazy
  # fashion atm to minimize intrusion. Depending on future direction this work may be achieved by extending devise.
  def current_customer
    result = customers[0]
    if (!result)
      result = Customer.create!(name: email)
      customers << result
      save!
    end
    result
  end

  def is_student_authorized(student)
    return customers.any? { |customer| customer.id == student.customer.id } ||
           (has_role?(:student) && students.any? { |stu| stu.id == student.id })
  end
  def link_from_omniauth(auth)
      self.provider = auth.provider
      self.uid = auth.uid
      self.save
    end

    def self.from_omniauth(auth)
      where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
        user.email = auth.info.email
       
        user.password = Devise.friendly_token[0,20]
        user.skip_confirmation!
      end
    end

end
