module ApiExceptions
  class BaseException < StandardError
    attr_accessor :status

    def initialize(message, status = 400)
      super message
      @status = status
    end
  end

  class NotAuthorizedException < BaseException
    def initialize(message)
      super message, 403
    end
  end
end
