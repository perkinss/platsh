class AssessmentsController < ApplicationController

  # Warning: watch out about deleting any assessments.  They are associated with tasks.  Tasks are currently referenced
  # by observations.  This may not be necessary.  Or, we could archive all 'orphaned' tasks/assessments so the observations still
  # have something to reference.  Same for association between Sections and assessments.  Should a section be allowed to
  # modify its courses after creation?  Not if there are active assessments and observations associated to it

  before_action :authenticate_user!
  def new
    if (user_signed_in?)
      restrict_to_teacher

      type = AssessmentType.find_by_name(params[:type])
      scoring_type = AssessmentScoringType.find_by_name(params[:scoring] || AssessmentScoringType::DEFAULT_NAME)
      sections = Section.find(params[:sections])
      courses = Course.find(params[:courses])

      assessment_competency = Competency.find(params[:competency]) if params[:competency].present?

      if courses && type
        @assessment = Assessment.new(
            name: params[:name],
            assessment_type: type,
            assessment_scoring_type: scoring_type,
            user: current_user,
            competency_id: params[:competency]
            )

        @assessment.courses = courses
        @assessment.sections = sections

        params[:tasks].each do |t|
          task = Task.new(name: t[:name], assessment: @assessment)

          t[:standards].keys.each do |s|
            TaskStandard.create!(standard_id: s, level: t[:standards][s], task: task)
          end
          task.competency_ids = t[:competencies]
          if assessment_competency
            task.competencies.push(assessment_competency)
          end
          task.save
        end
        @assessment.save
      end

      if @assessment
         assessment_obj = {
            name: @assessment.name,
            id: @assessment.id,
            competency: @assessment.competency_id,
            type: { id: type.id, name: type.name, description: type.description },
            scoring_type: { id: scoring_type.id, name: scoring_type.name },
            courses: @assessment.courses.map { |c| { id: c.id, title: c.title } },
            sections: @assessment.sections.map { |s| { id: s.id, name: s.name } },
            updated_at: @assessment.updated_at,
            tasks: @assessment.tasks.collect do |t|
              standards = {}
              t.task_standards.each do |ts|
                standards[ts.standard_id] = ts.level
              end
              {
                  id: t.id,
                  name: t.name,
                  standards: standards,
                  competencies: t.competencies.map { |c| c.id },
                  deletable: true
              }
            end
        }
       end

      respond_to do |format|
        if @assessment
          format.json { render :json => assessment_obj }
        else # I think rails returns a 404 anyway
          format.json { render :json => { msg: "404" } }
        end
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def update
    if (user_signed_in?)
      restrict_to_teacher
      assessment = Assessment.find(params[:id])

      if assessment
        updated = assessment.update_with_tasks_and_standards(params[:name], params[:type], params[:tasks], params[:competency], params[:sections])
      end

      respond_to do |format|
        if assessment
          format.json { render :json => {assessment: updated } }
        end
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  ####
  # Delete destroys an assessment and its associations iff there are no observations or comments
  # TODO: allow an assessment to be archived and retain observations and comments.
  def delete
    if (user_signed_in?)
      restrict_to_teacher

      assessment = Assessment.find(params[:id])
      success = assessment.destroy_associations

      respond_to do |format|
        if assessment
          format.json { render :json => { deleted: success } }
        end
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end

  def get_for_user
    if (user_signed_in?)
      restrict_to_teacher
      # paging: at first just get the first 10, then when user fetches next page get the rest
      # Add ordering when an order is selected
      # Add filtering when a filter is selected
      # Add searching when search is entered
      t_start = Time.now
      Rails.logger.info "\n\n\nAbout to get the current user's assessments\n\n\n"
      @assessments = current_user.assessments.includes(:tasks, :sections, :courses, :assessment_type, :assessment_scoring_type).order(updated_at: :desc)
      Rails.logger.info "\n\n Assessments took : #{Time.now - t_start}\n\n"
      t_start = Time.now
      assessments_with_task_data = @assessments.collect { |a|
        a.map_assessment_data() }
      Rails.logger.info "\n\n MAPPING #{@assessments.size} assessments took : #{Time.now - t_start}\n\n"
      respond_to do |format|
        format.json { render :json => assessments_with_task_data  }
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end

  end

  def get_shared
    if (user_signed_in?)
      restrict_to_teacher
      t_start = Time.now
      Rails.logger.info "\n\n\nAbout to get the shared assessments\n\n\n"
      @assessments = Assessment.where(shared: true).includes(:tasks, :sections, :courses, :assessment_type, :assessment_scoring_type).order(updated_at: :desc)
      Rails.logger.info "\n\n Assessments took : #{Time.now - t_start}\n\n"
      t_start = Time.now
      assessments_with_task_data = @assessments.collect { |a|
        a.map_assessment_data() }
      Rails.logger.info "\n\n MAPPING #{@assessments.size} assessments took : #{Time.now - t_start}\n\n"
      respond_to do |format|
        format.json { render :json => assessments_with_task_data  }
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end

  def share
    if (user_signed_in?)
      restrict_to_teacher

      assessment = Assessment.find(params[:id])
      if assessment
        assessment.update(shared: true)
      end

      respond_to do |format|
        if assessment
          format.json { render :json => assessment.map_assessment_data() }
        end
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end

  def stop_sharing
    if (user_signed_in?)
      restrict_to_teacher

      assessment = Assessment.find(params[:id])
      if assessment
        assessment.update(shared: false)
      end

      respond_to do |format|
        if assessment
          format.json { render :json => assessment.map_assessment_data() }
        end
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end
end
