class Student < ApplicationRecord
  validates :name, presence: true
  validates :unique_id, presence: true, uniqueness: { scope: :customer }
  validates :grade, presence: true, format: {with:/\A([K123456789]|1[0,1,2,])\z/, message: "only allows K - 12" }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :pronoun, format: { with: /\A(They\/Them\/Their|He\/Him\/His|She\/Her\/Her|)\z/, message: "only allows he she or they" }
  has_many :standard_observations
  has_many :competency_observations
  has_many :enrollments
  has_many :sections, through: :enrollments
  has_many :comments
  belongs_to :school, optional: true
  belongs_to :customer, optional: false

  def self.grade_order(direction = "ASC")
    direction = "ASC" unless direction.upcase == "DESC"
    order(Arel.sql("
      CASE
        WHEN grade ~ '^[0-9]' THEN TO_NUMBER(grade, '99')
        WHEN grade = 'K' THEN 0
        ELSE -1
      END #{direction}"))
  end

  def self.bulk_import(csv_file,school_id,customer)
    errCount = 0
    errMsgOther = ""
    errStudentsOther = ""
    errMsgGrade = ""
    errStudentsGrade = ""
    errMsgEmail = ""
    errStudentsEmail = ""
    errMsgPronoun = ""
    errStudentsPronoun = ""
    school = School.find(school_id)
    converter = lambda { |header| header.downcase}
    CSV.foreach(csv_file.path, { headers: true, header_converters: [converter] } ) do |row|
      unique_id = row['unique student id'].strip
      existing_student = Student.where(unique_id: unique_id, customer: customer)[0]

      name = row['name'].strip
      grade = row['grade'].present? ? row['grade'].strip : nil
      email = row['email'].present? ? row['email'].strip : nil
      pronoun = row['pronoun'].present? ? row['pronoun'].strip : nil
      preferred_name = row['preferred name'].present? ? row['preferred name'].strip : nil

      if email and email !~ URI::MailTo::EMAIL_REGEXP
          email = nil
          errCount += 1
          errMsgEmail = "The following students emails were left blank because the email was not valid:\n"
          errStudentsEmail = errStudentsEmail + name + "\n"
      end

      if grade and GRADE_VALUES.exclude?(grade)
          errCount += 1
          errMsgGrade = "The following students were not saved because their grade did not fit the correct pattern:\n"
          errStudentsGrade = errStudentsGrade + name + "\n"
      end

      options = {
          name: name,
          unique_id: unique_id,
          customer: customer,
          school: school,
          email: email,
          preferred_name: preferred_name,
          grade: grade
      }

      if pronoun
        if pronoun !~ /\A(They\/Them\/Their|He\/Him\/His|She\/Her\/Her|)\z/
          errCount += 1
          errMsgPronoun = "The following students pronouns were set to default because the pronoun was not valid:\n"
          errStudentsPronoun = errStudentsPronoun + name + ", " + pronoun + "\n"
        else
          options[:pronoun] = pronoun
        end
      end

      begin
        @student = existing_student || Student.new
        @student.update options

        # Change this to update at the end of the loop
        @student.save!
      rescue
        errCount += 1
        errMsgOther = "The following students failed to save:\n"
        errStudentsOther = errStudentsOther + name + "\n"
      end

    end
    if (errCount > 0)
      return errMsgOther + errStudentsOther + "\n" + errMsgGrade + errStudentsGrade + "\n" + errMsgEmail + errStudentsEmail + "\n" + errMsgPronoun + errStudentsPronoun
    else
      return ""
    end
  end

  private

  GRADE_VALUES = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'K']

end
