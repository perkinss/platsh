require 'omniauth-oauth2'

module OmniAuth
  module Strategies
    class Edvantage < OmniAuth::Strategies::OAuth2
      option :name, 'edvantage'
      option :client_options, {
        site:          'https://edvantagescience.com/moodle',
        authorize_url: 'https://edvantagescience.com/moodle/local/oauth/login.php',
        token_url:     'https://edvantagescience.com/moodle/local/oauth/token.php',
      }

      # When redirect_uri is passed to the authorize step in Edvantage, it gets redirected
      # to the Edvantage home page, and the OAuth flow is broken. The redirect_uri
      # parameter is set to blank here to prevent that.
      option :authorize_params, scope: 'user_info', redirect_uri: ""
      option :token_params, scope: 'user_info', redirect_uri: ""
      option :auth_token_params, mode: :query

      uid {
        raw_info['id']
      }

      info do
        {
          email: raw_info['email'],
          first_name: raw_info['firstname'],
          last_name: raw_info['lastname'],
		  role: raw_info['role'],
        }
      end

      extra do
        { raw_info: raw_info }
      end

      def raw_info
        @raw_info ||= JSON.parse access_token.get('https://edvantagescience.com/moodle/local/oauth/user_info.php').body
      end
    end
  end
end
