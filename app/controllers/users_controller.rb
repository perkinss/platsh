class UsersController < ApplicationController
  def show
  end

  def update_schools
    if (user_signed_in?)
      authorize! :read, School

      schools = School.where(id: params[:schoolIds])
      current_user.schools = schools
      current_user.save

      respond_to do |format|
        format.json { render :json => schools}
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end
end
