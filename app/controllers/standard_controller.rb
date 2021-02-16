class StandardController < ApplicationController
  def get_all_for_course
    ids = params[:course]

    courses = Course.find(ids)

    data = courses.collect { |course|
      {title: course.title, id: course.id, contents:
          course.contents.collect { |content|
            standards = content.standards.sort_by { |s| s.description.downcase }
            { id: content.id, name: content.name, 'standards': standards.collect { |standard|
              {'id': standard.id, 'description': standard.description }
            }
            }
          }
      }
    }

    respond_to do |format|
        format.json { render :json => data }
      end
    # todo later: should use this instead, because it turns out the fe only needs the course id ... should be easy to do in reducer
    # @contents = Content.where(course: ids).select(:id, :name, :course_id).includes(:standards).group_by do |content|
    #   content.course.id
    # end
    #
    # respond_to do |format|
    #   format.json { render :json => @contents, :include => [:standards => {:only => [:id, :description]}] }
    # end
  end

  def get_all_for_section
   @sectiondata =  Section.find(params[:section]).courses.includes(:contents, :standards)

   section = @sectiondata.collect{ |course|
     {title: course.title, id: course.id, contents:
        course.contents.collect { |content|
          standards = content.standards.sort_by { |s| s.description.downcase }
         { id: content.id, name: content.name, 'standards': standards.collect { |standard|
              {'id': standard.id, 'description': standard.description }
            }
          }
        }
     }
   }

   respond_to do |format|
     format.json { render :json => section  }
   end

  end

  def get_all_for_assessment
    assessment_data = Assessment.find(params[:assessment]).courses.includes(:contents, :standards)

    assessment = assessment_data.collect{ |course|
      {title: course.title, id: course.id, contents:
          course.contents.collect { |content|
            standards = content.standards.sort_by { |s| s.description.downcase }
            { id: content.id, name: content.name, 'standards': standards.collect { |standard|
              {'id': standard.id, 'description': standard.description }
            }
            }
          }
      }
    }

    respond_to do |format|
      format.json { render :json => assessment  }
    end
  end

  def query_params
    params.permit(:assessment, :id,  course: [])
  end

end