class CourseWeightingController < ApplicationController
  before_action :authenticate_user!

  def list
    if user_signed_in?
      restrict_to_teacher

      courses = current_user.sections.collect { |section| section.courses }.flatten.uniq

      course_weights = courses.collect do |course|
          user_weighting = CourseWeighting.where(user: current_user, course: course)[0]
          contents_weight = user_weighting.nil? ? 50 : user_weighting.contents_weight

          { id: course.id, name: course.title, contents_weight: contents_weight }
      end

      respond_to do |format|
        format.json { render :json => { course_weights: course_weights } }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def save
    if user_signed_in?
      restrict_to_teacher

      course = Course.find(params[:id])
      new_weight = params[:contents_weight]
      weight = CourseWeighting.where(user: current_user, course: course)[0]
      save_weight = []

      if weight.nil?
        weight = CourseWeighting.new(user: current_user, course: course, contents_weight: new_weight )
        save_weight.push(weight)
      else
        e = weight.update(contents_weight: new_weight)
        save_weight.push(weight) if weight.update(contents_weight: new_weight)
      end
      CourseWeighting.transaction do
        save_weight.each do |w|
          w.save
        end
      end

      respond_to do |format|
        if save_weight[0]
          format.json { render :json => {id: course.id, contents_weight: save_weight[0].contents_weight} }
        else
          format.json { render :json => {id: course.id, contents_weight: weight.contents_weight} }
        end

      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

end
