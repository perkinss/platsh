load 'app/models/report.rb'

class ReportsController < ApplicationController

  before_action :authenticate_user!

  def section_content_overview
    if user_signed_in?
      restrict_to_teacher

      section = Section.find(params[:id])
      user = current_user
      from = params[:from]
      to = params[:to]
      topics = params[:topic].nil? ? [] : params[:topic].map(&:to_i)
      section_report = Report.new.section_content_report(section, user, from, to, topics)

      respond_to do |format|
        format.json { render :json => section_report }
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def section_competency_overview
    if user_signed_in?
      restrict_to_teacher

      from = params[:from]
      to = params[:to]
      section = Section.find(params[:id])
      section_report = Report.new.section_competency_report(section, current_user, from, to)

      respond_to do |format|
        format.json { render :json => section_report }
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  ## ***
  # Get all the competencies for this student for courses used in this section, even if the marks
  # were given in a different user's section'=
  # ****
  def student_competency_report
    if user_signed_in?
      allow_roles [:teacher, :student]

      student = Student.find(params[:id])
      section = Section.find(params[:section_id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      from = params[:from]
      to = params[:to]
      competency_report = Report.new.student_competency_report(section, student, from, to)

      respond_to do |format|
        format.json { render :json => competency_report }
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def student_content_report
    if user_signed_in?
      allow_roles [:teacher, :student]

      student = Student.find(params[:id])
      section = Section.find(params[:section_id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      if section && student
        from = params[:from]
        to = params[:to]
        topics = params[:topic].nil? ? [] : params[:topic].map(&:to_i)
        content_report = Report.new.content_report_for_student(section, student, from, to, topics)
      end

      respond_to do |format|
        if content_report
          format.json { render :json => content_report }
        else #TODO: error 404
          format.json { render :json => {msg: "No such student, or no such section"} }
        end
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def student_competency_heat_map
    if user_signed_in?
      allow_roles [:teacher, :student]

      student = Student.find(params[:id])
      section = Section.find(params[:section_id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      from = params[:from]
      to = params[:to]
      report = Report.new.student_heat_map(student, section, from, to)

      respond_to do |format|
          format.json { render :json => report }
        end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def student_standard_report
    if user_signed_in?
      allow_roles [:teacher, :student]
      student = Student.find(params[:id])
      section = Section.find(params[:section_id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)
      from = params[:from]
      to = params[:to]
      topic_ids = params[:topic].nil? ? [] : params[:topic].map(&:to_i)
      report = Report.new.student_standard_report(student, section, from, to, topic_ids)

      respond_to do |format|
        format.json { render :json => report }
      end

    end
  end

  def student_observed_assessments
    if user_signed_in?
      allow_roles [:teacher, :student]
      student = Student.find(params[:id])
      section = Section.find(params[:section_id])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      from = params[:from]
      to = params[:to]
      report = Report.new.observed_assessments(section, student, from, to)

      respond_to do |format|
        format.json { render :json => report }
      end
    end
  end

end
