class ContentController < ApplicationController
  def index
    @contents = Content.all
  end

  def courseContents
    course_contents = Content.where course: params[:id]
    respond_to do |format|
      format.json { render :json => course_contents }
      format.html { course_contents }
    end
  end
end
