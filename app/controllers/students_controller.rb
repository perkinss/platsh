class StudentsController < ApplicationController
  require 'csv'
  before_action :authenticate_user!

  def new
    if (user_signed_in?)
      restrict_to_teacher

      customer = current_user.current_customer

      if (params[:school])
        school = School.find(params[:school])
        @student = Student.new(
            name: params[:name],
            unique_id: params[:unique_id],
            grade: params[:grade],
            email: params[:email],
            pronoun: params[:pronoun],
            preferred_name: params[:preferred_name],
            school: school
        )
      else params[:grade]
        @student = Student.new(
            name: params[:name],
            unique_id: params[:unique_id],
            grade: params[:grade],
            email: params[:email],
            pronoun: params[:pronoun],
            preferred_name: params[:preferred_name]
        )
      end
      @student.customer = customer
      @student.save

      respond_to do |format|
        format.json { render :json => map_student_data(@student, [], [])}
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def delete
    if (user_signed_in?)
      restrict_to_teacher

      @student = Student.find(params[:id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, @student)

      if student_is_deletable(@student)
        @student.enrollments = []
        @student.destroy
        message = "Success!"
      else
        message = "Student has observations and cannot be deleted."
      end

      respond_to do |format|
        format.json { render :json => {message: message}}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def enrolled
    if (user_signed_in?)
      restrict_to_teacher

      section = Section.find(params[:section])
      student_data = section.students.sort_by { |student| student.name.downcase }.collect { |s| map_student_data(s, [], [])}
      respond_to do |format|
        format.json { render :json => student_data}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def list
    if (user_signed_in?)
      restrict_to_teacher

      students = list_students
      respond_to do |format|
        format.json { render :json => students}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def list_for_student_user
    if (user_signed_in?)
      restrict_to_student

      students = current_user.students
      respond_to do |format|
        format.json { render :json => students}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def update
    if (user_signed_in?)
      restrict_to_teacher

      @student = Student.find(params[:id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, @student)

      if params[:name] && params[:unique_id]
        @student.update(name: params[:name], unique_id: params[:unique_id])
        if params[:grade]
          @student.update(grade: params[:grade])
        end
        if params[:school]
          @student.update(school_id: params[:school])
        end
        if params[:email]
          @student.update(email: params[:email])
        end
        if params[:pronoun]
          @student.update(pronoun: params[:pronoun])
        end
        if params[:preferred_name]
          @student.update(preferred_name: params[:preferred_name])
        end
      end
      @student.save!

      respond_to do |format|
        # Don't need to know whether student is enrolled or deletable so pass empty arrays:
        format.json { render :json => map_student_data(@student, [], [])}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def import
    if (user_signed_in?)
      restrict_to_teacher

      if (params[:file] && params[:school])
        import_errors = Student.bulk_import(params[:file], params[:school], current_user.current_customer)
        students = list_students
        if (import_errors.blank?)
          msg = { :status => "success", :message => "Successfully saved!", :students => students }
        else
          msg = { :status => "error", :message => import_errors, :students => students }
        end
        respond_to do |format|
          format.html
          format.json { render :json => msg}
        end
      else
        respond_to do |format|
          students = list_students
          msg = { :status => "error", :message => "Either no file or school was chosen.", :students => students}
          format.json {render :json => msg}
        end
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def invite
    if (user_signed_in?)
      restrict_to_teacher

      student = Student.find(params[:id])

      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      if params[:email] =~ URI::MailTo::EMAIL_REGEXP
        student.email = params[:email]
        student.save
      else
        UsersHelper::StudentValidations.has_email(student)
      end

      User.invite!(name: student.name, email: student.email) do |user|
        user.add_role :student
        user.students << student
      end
      respond_to do |format|
        format.json { render :json => {status: 200, message: "Email sent"} }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  private

  def student_is_deletable(student)
    deletable = true
    if StandardObservation.exists?(student_id: student.id) || Comment.exists?(student_id: student.id) || CompetencyObservation.exists?(student_id: student.id)
      deletable = false
    end
    deletable
  end

  def map_student_data(student, observed_student_ids, enrolled_student_ids)
    {
        id: student.id,
        name: student.name,
        unique_id: student.unique_id,
        school: student.school_id,
        deletable: observed_student_ids.exclude?(student.id),
        grade: student.grade,
        has_enrollments: enrolled_student_ids.include?(student.id),
        email: student.email,
        pronoun: student.pronoun,
        preferred_name: student.preferred_name,
    }
  end

  def list_students
    # Short circuit the method when the user isn't associated with a customer
    if (!current_user.customers.present?)
      return []
    end
    
    t_start = Time.now()
    @students = Student.grade_order("DESC").order(:name)
    @students = @students.where(school: current_user.schools.map{|school|school.id}) if current_user.schools.present?
    @students = @students.where(customer_id: current_user.current_customer.id)
    student_ids = @students.pluck(:id)

    observed_student_ids = (
          StandardObservation.distinct(student_id: student_ids).pluck(:student_id) +
          CompetencyObservation.distinct(student_id: student_ids).pluck(:student_id) +
          Comment.distinct(student_id: student_ids).pluck(:student_id)
    ).uniq()
    enrolled_student_ids = Enrollment.where(student_id: student_ids).pluck(:student_id).uniq()
    student_list = @students.collect do |student|
      map_student_data(student, observed_student_ids, enrolled_student_ids)
    end
    Rails.logger.info "\n\n\n***** Loading students took #{Time.now() - t_start}\n\n\n"
    return student_list
  end
end
