class CommentController < ApplicationController

  before_action :authenticate_user!

  def save

    if (user_signed_in?)
      restrict_to_teacher

      new_comments = params[:comments]
      save_comments = []
      delete_comments = []

      new_comments.each do |new_comment|
        if new_comment[:id]
          existing = Comment.find(new_comment[:id])
          if new_comment[:comment].present?
            save_comments.push(existing) if existing.update(comment:new_comment[:comment] )
          else
            delete_comments.push(existing)
          end
        else
          if new_comment[:comment].present?
            cmt = Comment.new(student_id: new_comment[:student_id], task_id: new_comment[:task_id], comment: new_comment[:comment] )
            save_comments.push(cmt)
          end
        end
      end

      Comment.transaction do
        delete_comments.each { |comment| comment.destroy }
        save_comments.each { |comment| comment.save }
      end

      respond_to do |format|
        format.json { render :json => { comments: save_comments}  }
      end

    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end



  #todo return 404 if none found or some such error
  # also in general need to do bad request handling etc.
  def fetch_for_assessment

    if (user_signed_in?)
      restrict_to_teacher

      assessment = Assessment.find(params[:assessment_id])
      task_comments = assessment.tasks.collect do |task|
        Comment.where(task_id: task.id)[0]
      end.compact

      respond_to do |format|
        format.json { render :json => task_comments  }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def fetch_for_report

    if (user_signed_in?)
      restrict_to_teacher

      section = Section.find(params[:section_id])
      student = Student.find(params[:student_id])
      from = params[:from]
      to = params[:to]
      section_comments = section.assessments.collect do |assessment|
        assessment_comments = Comment.where(student: student, task: assessment.tasks)
        if from
          assessment_comments = assessment_comments.where('updated_at >= ?', from)
        end
        if from
          assessment_comments = assessment_comments.where('updated_at < ?', to)
        end
        assessment_comments.collect { |comment| { assessment: assessment.name, task: comment.task.name, created_at: comment.created_at, comment: comment.comment}}
      end.flatten
      respond_to do |format|
        format.json {render :json => section_comments}
      end
    end
  end

  private

  def comment_params
    params.permit(  comments: {})
  end
end
