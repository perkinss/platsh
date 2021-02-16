class EnrollmentsController < ApplicationController
  before_action :authenticate_user!
  # This is only used within rails_admin.
  def new
    if user_signed_in?
      restrict_to_teacher

      student = Student.find(params[:student])
      section = Section.find(params[:section])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      enrollment = Enrollment.create!(student: student, section:section)
      # ensure the user can see when their section was updated:
      section.touch

      respond_to do |format|
        format.json { render :json => enrollment  }
      end
    end

  end

  def list
  end
end
