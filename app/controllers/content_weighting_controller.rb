class ContentWeightingController < ApplicationController
  before_action :authenticate_user!

  def save
    if user_signed_in?
      restrict_to_teacher

      new_weights = params[:weights]
      created_weights = []
      new_weights.each do |content_weight|
        existing_weight = ContentWeighting.where(user_id: current_user.id, content_id: content_weight[:content_id])[0]
        if existing_weight.nil?
          created_weights.push ContentWeighting.create(user_id: current_user.id, content: Content.find(content_weight[:content_id]), weight: content_weight[:weight])
        else
          existing_weight.update(weight: content_weight[:weight])
          existing_weight.save
          created_weights.push(existing_weight)
        end
      end

      respond_to do |format|
        format.json { render :json => created_weights }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def get_for_user_courses
    if user_signed_in?
      restrict_to_teacher

      courses = current_user.sections.collect { |section| section.courses }.flatten.uniq

      course_weights = courses.collect do |course|
          content_weights = course.contents.collect do |content|
            user_weighting = ContentWeighting.where(user: current_user, content: content)[0]
            if user_weighting.nil?
              user_weighting = DefaultContentWeighting.where(content: content)[0]
            end

            { id: content.id, name: content.name, weight: user_weighting.nil? ? 1 : user_weighting.weight }
          end
        { id: course.id, title: course.title, content_weights: content_weights }
      end

      respond_to do |format|
        format.json { render :json => course_weights }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end

  end
end
