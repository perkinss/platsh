
class ObservationsController < ApplicationController
  before_action :authenticate_user!


  ## Controls both Standard observations and Competency observations

  def save_marks
    if user_signed_in?
      restrict_to_teacher

      student = Student.find(params[:student])
      assessment = Assessment.find(params[:assessment])
      UsersHelper::UserValidations.validate_student_authorized(current_user, student)

      if student
        standard_observations = StandardObservation.update_standard_marks(current_user, assessment, student, params[:marks][:standard_marks], params[:assessed_at])
        competency_observations = CompetencyObservation.update_competency_scores(current_user, assessment, student, params[:marks][:student_competencies],params[:assessed_at], params[:assessment_score] )
      end

      respond_to do |format|
        format.json { render :json => { standard_observations: standard_observations, competency_observations: competency_observations} }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def list_marks
    if user_signed_in?
      restrict_to_teacher

      assessment = Assessment.find(params[:assessment_id])
      section = Section.find(params[:section_id])

      task_ids = assessment.tasks.map(&:id)
      #  It's looking to set state like student_marks[studentId][taskId] for each enrolled student... ooh I guess we need to check the section
      standard_observations = StandardObservation.where(task_id: task_ids)
      student_marks = {}

      # We only care about the first assessment date from the observations, because as of this writing, they all should share the same date:
      assessed_date = standard_observations[0] ? standard_observations[0].assessed_at : nil

      section.students.each do |student|
        tasks = {}
        task_ids.each do |task_id|
          observed_standards = standard_observations.filter { |o| o.task_id == task_id && o.student_id == student.id }.map{ |o| [o.standard_id, o.score] }.to_h
          tasks[task_id] = observed_standards
        end
        student_marks[student.id] = tasks
      end

      respond_to do |format|
        format.json { render :json => { student_marks: student_marks, assessed_date: assessed_date } }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  def list_competency_scores
    if user_signed_in?
      restrict_to_teacher

      assessment = Assessment.find(params[:assessment_id])
      section = Section.find(params[:section_id])

      task_ids = assessment.tasks.map(&:id)

      comp_observations = CompetencyObservation.where(task_id: task_ids)
      student_competencies = {}
      section.students.each do |student|
        tasks = {}
        task_ids.each do |task_id|
          competencies = {}
          task_scores = comp_observations.filter { |o| o[:task_id] == task_id && o[:student_id] == student.id}
          task_scores.each { |obs| competencies[obs[:competency_id]]= obs[:level]}
          tasks[task_id] = competencies
        end
        student_competencies[student.id] = tasks
      end


      respond_to do |format|
        format.json { render :json => { student_competencies: student_competencies} }
      end
    else
      print "\n\nUser not logged in\n\n"
      redirect_to root_url
    end
  end

  private

  def marks_params
    params.permit( :assessed_at, :assessment_score, marks: {} )
  end
end
