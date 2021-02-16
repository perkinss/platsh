class CompetencyGroupWeightingController < ApplicationController
  before_action :authenticate_user!

  def save
    if user_signed_in?
      restrict_to_teacher

      new_weights = params[:weights]
      course = Course.find(params[:course])

      created_weights = []
      new_weights.each do |competency_weight|
        existing_weight = CompetencyGroupWeighting.where(user_id: current_user.id, competency_group_id: competency_weight[:group_id], course_id: course.id)[0]
        if existing_weight.nil?
          created_weights.push CompetencyGroupWeighting.create(
              user_id: current_user.id,
              competency_group: CompetencyGroup.find(competency_weight[:group_id]),
              weight: competency_weight[:weight],
              course: course)
        else
          existing_weight.update!(weight: competency_weight[:weight])
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
          competency_weights = course.competency_groups.uniq.collect do |group|
            user_weighting = CompetencyGroupWeighting.where(user: current_user, competency_group: group, course: course)[0]
            { id: group.id, title: group.title, weight: user_weighting.nil? ? 1 : user_weighting.weight }
          end
        { id: course.id, title: course.title, competency_weights: competency_weights }
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
