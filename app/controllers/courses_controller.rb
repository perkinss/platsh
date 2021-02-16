class CoursesController < ApplicationController
  def index
    @courses = Course.all

    respond_to do |format|
      format.json { render :json => @courses.order(:title)}
      format.html { @courses.order(:title)}
    end
  end

  def course_configuration
    @coursetc = Course.all.order(:id).includes(:contents)

    respond_to do |format|
      format.json { render :json => @coursetc, :include => [:contents]}
    end
  end

  def list
    :authenticate_user!
    if user_signed_in?
      courses = {}
      current_user.sections.each do |section|
        section.courses.each do |course|
          if courses[course.id]
            courses[course.id][:sections].push({ id: section.id, name: section.name })
          else
            courses[course.id] = {
                title: course.title,
                sections: [ {id: section.id, name: section.name }]
            }
          end
        end
      end
      respond_to do |format|
        format.json { render :json => courses }
      end
    end
  end

end
