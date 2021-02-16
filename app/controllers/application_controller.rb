class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  layout :layout_by_resource
  rescue_from ApiExceptions::BaseException, :with => :render_error_response
  rescue_from CanCan::AccessDenied, :with => :render_access_denied_response

  private

  def render_error_response(api_exception)
    render json: {status: "error", message: api_exception.message}, status: api_exception.status
  end

  def render_access_denied_response(exception)
    render json: {status: "error", message: exception.message}, status: :forbidden
  end

  def layout_by_resource
    if devise_controller?
      "devisewrapper"
    else
      "application"
    end
  end
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected
  def authenticate_admin_user!
    authenticate_user!
    unless current_user && current_user.try(:superadmin?)
      flash[:alert] = "Unauthorized Access!"
      redirect_to main_app.root_url
    end
  end

  def configure_permitted_parameters
    # Permit the `subscribe_newsletter` parameter along with the other
    # sign up parameters.
    #devise_parameter_sanitizer.permit(:sign_up, keys: [:subscribe_newsletter])
  end

  def restrict_to_teacher
    UsersHelper::UserValidations.validate_has_role(current_user, :teacher)
  end

  def restrict_to_student
    UsersHelper::UserValidations.validate_has_role(current_user, :student)
  end

  def allow_roles(role_names)
    UsersHelper::UserValidations.validate_has_any_role(current_user, role_names)
  end
end
