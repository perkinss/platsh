require 'test_helper'

class PagesControllerTest < ActionDispatch::IntegrationTest

  def setup
    @site_title = "Markury"
  end

  # TODO Uncomment this feckin test when heroku gets their act together and tests can pass
  test "should get root" do
    get root_url
    assert_response :success
  end
end
