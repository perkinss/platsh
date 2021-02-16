class CompetenciesController < ApplicationController

  ##
  # Get the competencies as a json object of the form Courses => Competency Groups => Competencies
  # [ { id: courseid, title: coursetitle, competency_groups: [ {id: groupid, title: group title, competencies: [{id, description}] }] }]
  # #
  def get_by_section
    @competencies =  Section.find(params[:section]).courses.includes(:competencies).includes(:competency_groups)

    # filter out all duplicates by using a hashmap.. Duplicates arise because we're getting the groups from the course,
    # through the course's competencies (has_many_through).  Therefore, we cannot run 'distinct' on the query.
    course_groups = {}
    @groups = @competencies.each do |course|
      course.competency_groups.each do |group|
        course_groups[group.id] = group.title
      end
    end

    section = @competencies.collect { |course|
              groups = course_groups.collect { |group|
                  competencies = course.competencies.filter{ |competency| competency.competency_group_id == group[0] }.collect {
                      |c| {id: c.id, description: c.description}
                  }
                  if competencies && !competencies.empty?
                      {
                          id: group[0],
                          title: group[1],
                          competencies: competencies
                      }
                  end
              }
              groups.compact!
              if groups && !groups.empty?
                {
                    title: course.title,
                    id: course.id,
                    groups: groups
                }
              end
    }
    section.compact!

    respond_to do |format|
      format.json { render :json => section }
    end
  end

  def get_by_course
    ids = params[:course]

    courses = Course.find(ids)

    data = courses.collect { |course|
      {title: course.title, id: course.id, groups:
          course.competency_groups.uniq.collect do |group|
            competencies = course.competencies.where(competency_group: group)
                               .sort_by { |c| c.description.downcase }
                               .map { |c| { id: c.id, description: c.description } }
            { id: group.id, title: group.title, 'competencies': competencies}
          end
        }
      }
    # print "\n\nCompetency data: \n#{JSON.pretty_generate(data.as_json)}\n\n\n\n\n"

    respond_to do |format|
      format.json { render :json => data }
    end
  end

  def get_by_assessment
    assessment = Assessment.find(params[:assessment])

    if assessment
      data = assessment.courses.collect do |course|
        {title: course.title, id: course.id, groups:
            course.competency_groups.uniq.collect do |group|
              competencies = course.competencies.where(competency_group: group)
                                 .sort_by { |c| c.description.downcase }
                                 .map { |c| { id: c.id, description: c.description } }
              { id: group.id, title: group.title, 'competencies': competencies}
            end
        }
      end
    end

    respond_to do |format|
      format.json { render :json => data }
    end
  end
end