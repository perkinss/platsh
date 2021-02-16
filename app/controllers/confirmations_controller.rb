class ConfirmationsController < Devise::ConfirmationsController
  layout "devisewrapper"
  private

  def after_confirmation_path_for(resource_name, resource)
    "/login?hasConfirmed"
  end

end
