class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def edvantage
    auth = request.env["omniauth.auth"]

    if user_signed_in?
      # Link the current user to the edvantage account

      if current_user.link_from_omniauth auth
        flash[:success] = "Account successfully linked"
        redirect_to user_path(current_user)
      else
        flash[:danger] = "Account could not be linked"
        redirect_to user_path(current_user)
      end
    else
      # Look up or create user with this edvantage account, then sign them in
      #assign roles: if moodle role is student assign student role, otherwise assign teacher role
      @user = User.from_omniauth auth
	  if auth.extra.raw_info.role == 5
	  @user.add_role(:student)
	  @user.roles.delete(Role.find(1))
	  end

      if @user.persisted?
        # The user is created and will be signed in
        sign_in_and_redirect @user, :event => :authentication
      else
        flash[:danger] = "Account could not be linked. " + @user.errors.full_messages.join(". ")
        redirect_to new_user_session_path
      end
    end
  end

  def failure
    redirect_to root_path
  end
end
