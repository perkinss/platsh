class ReportingPeriodsController < ApplicationController

  before_action :authenticate_user!

  def list
    if user_signed_in?
      reporting_periods = ReportingPeriod.where user: current_user
      respond_to do |format|
        format.json { render :json => reporting_periods, :include => [:contents, :section => {:only => [:id, :name]}] }
      end
    end
  end

  def for_section
    if user_signed_in?
      reporting_periods = ReportingPeriod.where section: params[:id]
      respond_to do |format|
        format.json { render :json => reporting_periods, :include => [:contents] }
      end
    end
  end

  def new
    if user_signed_in?
      restrict_to_teacher
      period = ReportingPeriod.new(user: current_user,
                                   section: Section.find(params[:section]),
                                   name: params[:name],
                                   period_start: params[:period_start],
                                   period_end: params[:period_end],
                                   )
      period.contents = Content.where(id: params[:topics])
      period.save!
      respond_to do |format|
        format.json { render :json => period, :include => [:contents, :section] }
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end

  def update
    if user_signed_in?
      restrict_to_teacher
      period = ReportingPeriod.find(params[:id])
      period.contents = Content.where(id: params[:topics])
      period.update(section: Section.find(params[:section]),
          name: params[:name],
          period_start: params[:period_start],
          period_end: params[:period_end])
      period.save!
      respond_to do |format|
        format.json { render :json => period, :include => [:contents, :section] }
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end

  def delete
    if (user_signed_in?)
      restrict_to_teacher

      period = ReportingPeriod.find(params[:id])
      success = period.destroy

      respond_to do |format|
        if period
          format.json { render :json => { deleted: success } }
        end
      end
    else
      print "\n\nUser not logged in\n\n "
      redirect_to root_url
    end
  end

end
