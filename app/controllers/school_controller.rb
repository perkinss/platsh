class SchoolController < ApplicationController

  def list
    schools = School.all

    respond_to do |format|
      format.json { render :json => schools }
    end
  end

  def get_for_user
    schools = (params[:strict] == "true" || current_user.schools.present?) ? current_user.schools : School.all

    respond_to do |format|
      format.json { render :json => schools }
    end
  end
end
