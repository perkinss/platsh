class SectionsController < ApplicationController

  before_action :authenticate_user!
  def new
    if (user_signed_in?)
      restrict_to_teacher

      @section = Section.create!(name: params[:name], user_id: current_user.id)
      if (params[:courses])
        @section.courses = Course.where(title: params[:courses])
      end

      if (params[:students])
        enrollments = params[:students].collect do |e|
          student = Student.find(e)
          UsersHelper::UserValidations.validate_student_authorized(current_user, student)
          Enrollment.new(section: @section, student: student)
        end
        @section.enrollments = enrollments
      end
      respond_to do |format|
        format.json { render json: @section, include: [courses: {only: %i[id title grade subject]}, students: {only: [:id]}]}
        format.html { @section }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end

  end

  def update
    if (user_signed_in?)
      restrict_to_teacher

      section = Section.find(params[:id])
      section.update(name: params[:name])
      if params[:courses] && section.assessments.empty?
        section.courses = Course.where(title: params[:courses])
      end

      incoming_student_ids = params[:students].map(&:to_i)
      enrolled_student_ids = section.students.map(&:id)
      new_ids = incoming_student_ids - enrolled_student_ids
      missing_ids = enrolled_student_ids - incoming_student_ids

      students = []
      new_ids.each do |e|
        student = Student.find(e)
        UsersHelper::UserValidations.validate_student_authorized(current_user, student)

        students.push(student)
        Enrollment.create!(section_id: section.id, student_id: student.id)
      end
      missing_ids.each do |e|
        Enrollment.where(student_id: e, section_id: section.id).destroy_all
      end
      enrolled = Enrollment.where(section: section).map(&:student_id)
      # ensure that even if only enrollments change, the updated_at will be updated:
      section.touch
      section.save!

      respond_to do |format|
        format.json { 
          render json: {
            id: section.id,
            name: section.name,
            students: enrolled.map { |student_id| { id: student_id } },
            courses: section.courses.map { |course| { id: course.id, title: course.title, grade: course.grade, subject: course.subject }},
            assessments: section.assessments.map(&:id),
            updated_at: section.updated_at
        }}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end

  end

  def read
    @section = Section.find(params[:id])
  end

  def index
    @sections = Section.all
  end

  def delete
    if (user_signed_in?)
      restrict_to_teacher

      @section = Section.find(params[:id])
      Enrollment.where(section: @section).destroy_all
      msg = "Unable to delete #{params[:id]}"
      if @section.assessments.empty?
        @section.destroy
        msg =  'Successfully deleted'
      end

      respond_to do |format|
        format.json { render json: {msg:msg}  }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  ##
  # Fetches the contents of the courses for a section, grouped by course
  # @param :id the id of the section whose contents are to be returned.
  ##
  def contents
    if user_signed_in?
      section = Section.find(params[:id])
      if section
        courses = section.courses
        respond_to do |format|
          format.json { render json: courses, :only => [:title, :id], :include => [:contents]  }
        end
      else
        respond_to do |format|
          format.json { render json: {msg: "Section not found"}  }
        end
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def archive
    # todo: I think that we will not want to destroy these records, but hide them?
    # use for those that can't be deleted i.e, those with associated assessments
    # Should be able to delete after the year is done; observations will remain in the db
    # for the stats.
  end

  def find_sections_for_user
    if (user_signed_in?)
      restrict_to_teacher

      @sections = current_user.sections.includes(:courses, :students, :assessments).order(updated_at: :desc)

      respond_to do |format|
        format.json do
          render json: @sections,
                 include: [
                   courses: { only: %i[id title grade subject] },
                   students: { only: [:id] },
                   assessments: { only: [:id] }
                 ]
        end
        format.html { @sections }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def find_sections_for_student_user
    if (user_signed_in?)
      restrict_to_student

      @sections = current_user.students.flat_map(&:sections).uniq.sort_by(&:name)

      respond_to do |format|
        format.json do
          render json: @sections,
                 include: [
                   courses: { only: %i[id title grade subject] },
                   students: { only: [:id] },
                   assessments: { only: [:id] }
                 ]
        end
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def find_sections_for_course
    @sections = Section.where(courses: params[:id])

    respond_to do |format|
      format.json { render json: @sections }
      format.html { @sections }
    end
  end

end
