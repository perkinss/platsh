class DashboardController < ApplicationController

  before_action :authenticate_user!

  def list
    if user_signed_in?
      restrict_to_teacher

      dashboard = Dashboard.new

      results = dashboard.stats current_user

      respond_to do |format|
        format.json { render :json => results }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def section_dashboard
    if user_signed_in?
      dashboard = Dashboard.new
      course = Course.find(params[:course_id])
      section = Section.find(params[:section_id])
      results = dashboard.section(course, section)

      respond_to do |format|
        format.json { render :json => results }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end



end
