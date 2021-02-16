class RegistrationsController < Devise::RegistrationsController
  layout "devisewrapper"
#    clear_respond_to
    respond_to :json
end
