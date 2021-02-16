module UsersHelper
  class UserValidations
    def self.validate_student_authorized(user, student)
      raise ApiExceptions::NotAuthorizedException.new "User #{user.email} is not authorized to access student id #{student.id}" unless user.is_student_authorized(student)
    end

    def self.validate_has_role(user, role_name)
      raise ApiExceptions::NotAuthorizedException.new "User #{user.email} does not have the #{role_name} role" unless user.has_role?(role_name)
    end

    def self.validate_has_any_role(user, role_names)
      has_role = role_names.any? { |role_name| user.has_role?(role_name) }
      raise ApiExceptions::NotAuthorizedException.new "User #{user.email} does not have any expected roles: #{role_names}" unless has_role
    end
  end

  class StudentValidations
    def self.has_email(student)
      raise ApiExceptions::BaseException.new "Student #{student.name} does not have an email address" unless student.email
    end
  end
end
