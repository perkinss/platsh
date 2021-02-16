
require 'rails_admin/config'
require 'rails_admin/config/fields/base'

RailsAdmin.config do |config|

  config.authenticate_with do
    warden.authenticate! scope: :user
  end

  config.main_app_name = ['Markury', 'Admin']
  # or for a more dynamic name:
  # config.main_app_name = Proc.new { |controller| [Rails.application.engine_name.titleize, controller.params['action'].titleize] }

  config.parent_controller = '::ApplicationController'

  # RailsAdmin may need a way to know who the current user is]
  config.authenticate_with {:authenticate_admin_user! }

  config.current_user_method(&:current_user)

  config.authorize_with do
      redirect_to main_app.root_path unless (current_user && current_user.superadmin?)
    end

  # Number of default rows per-page:
  config.default_items_per_page = 100

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app
  end

  config.excluded_models << "Assessment"
  config.excluded_models << "Task"
  config.excluded_models << "Report"
  config.excluded_models << "Section"
  config.excluded_models << "Dashboard"
  config.excluded_models << "ContentWeighting"
  config.excluded_models << "CompetencyObservation"
  config.excluded_models << "StandardObservation"
  config.excluded_models << "TaskStandard"
  config.excluded_models << "Enrollment"
  config.excluded_models << "CoursesSection"
  config.excluded_models << "SectionsAssessment"
  config.excluded_models << "AssessmentCourse"
  config.excluded_models << "TaskCompetency"
  config.excluded_models << "CourseWeighting"
  config.excluded_models << "SchoolUser"
  config.excluded_models << "CustomerUser"

  config.model 'Customer' do
    field :name
    field :students
  end

  config.model 'Course' do
    field :title

    field :grade, :enum do
      enum do
        [
            ['12','12'],
            ['11','11'],
            ['10','10'],
            ['9','9'],
            ['8','8'],
            ['7','7'],
            ['6','6'],
            ['5','5'],
            ['4','4'],
            ['3','3'],
            ['2','2'],
            ['1','1'],
            ['K','K'],
            ]
        end
    end

    field :subject , :enum do
      enum do
        [
            ['Applied Design, Skills, and Technologies','Applied Design, Skills, and Technologies'],
            ['Arts Education','Arts Education'],
            ['Career Education','Career Education'],
            ['English Language Arts','English Language Arts'],
            ['Français langue première', 'Français langue première'],
            ['Français langue seconde – immersion','Français langue seconde – immersion'],
            ['Languages','Languages'],
            ['Mathematics', 'Mathematics'],
            ['Physical and Health Education','Physical and Health Education'],
            ['Science','Science'],
            ['Social Studies', 'Social Studies'],
        ]
      end
    end

    field :competency_groups do
      read_only true
    end

    field :competencies do
      read_only true
    end

    field :contents do
      read_only true
    end
    field :standards do
      read_only true
    end
    field :updated_at do
      read_only true
    end
    field :created_at do
      read_only true
    end
  end

  config.model 'CompetencyGroup' do
    field :title
    field :courses
    field :competencies

    edit do
      configure :courses do
        associated_collection_cache_all false
        associated_collection_scope do
          competency = bindings[:object]
          Proc.new { |scope|
            scope.where(id: competency.course_id) if competency.present?
          }
        end
      end

      configure :competencies do
        associated_collection_cache_all false
        associated_collection_scope do
          course = bindings[:object]
          Proc.new { |scope|
            scope.where(course_id: course.id) if course.present?
          }
        end
      end
    end
  end

  config.model 'Competency' do
    parent Course

    show do
      field :description
      field :phrasing
      field :course
      field :competency_group
      field :updated_at
      field :created_at
    end

    list do
      field :description
      field :phrasing
      field :course do
        read_only true
      end
      field :competency_group

      field :updated_at do
        read_only true
      end
      field :created_at do
        read_only true
      end
    end

    edit do
      field :description, :text do
        label "Title (description)"
        html_attributes rows: 5, cols: 100
      end

      field :phrasing, :text do
        label "Report phrasing"
        html_attributes rows: 5, cols: 100
        help 'Optional.  Use lower case, no period.'
      end

      field :competency_group

      field :course do
        associated_collection_cache_all false
        associated_collection_scope do
          competency = bindings[:object]
          Proc.new { |scope|
            scope.where(id: competency.course_id) if competency.present?
          }
        end
      end

      field :updated_at do
        read_only true
      end
      field :created_at do
        read_only true
      end
    end
  end


  config.model 'Content' do
    parent Course
    field :name
    field :description
    field :course
    field :default_content_weighting
    field :standards do
      read_only true
    end
    label "Content (Topic)"
    label_plural "Contents (Topics)"
    field :updated_at do
      read_only true
    end
    field :created_at do
      read_only true
    end

    edit do

      configure :course do
        associated_collection_cache_all false
        associated_collection_scope do
          content = bindings[:object]
          Proc.new { |scope|
            scope.where(id: content.course_id) if content.present?
          }
        end
      end

      configure :standards do
        associated_collection_cache_all false
        associated_collection_scope do
          content = bindings[:object]
          Proc.new { |scope|
            scope.where(content_id: content.id) if content.present?
          }
        end
      end

    end
  end

  config.model 'Standard' do
    parent Content
    # object_label_method do
    #   :custom_label_method
    # end

    edit do
      configure :content do
        associated_collection_cache_all false
        associated_collection_scope do
          standard = bindings[:object]
          Proc.new { |scope|
            scope.where(id: standard.content_id) if standard.present?
          }
        end
      end
    end

  end

  config.model 'DefaultContentWeighting' do
    parent Content
    field :content
    field :weight
    field :course

    edit do
      configure :content do
        associated_collection_cache_all false
        associated_collection_scope do
          default_content_weighting = bindings[:object]
          Proc.new { |scope|
            scope.where(id: default_content_weighting.content_id) if default_content_weighting.present?
          }
        end
      end

    end
  end
  #
  # def custom_label_method
  #   "#{self.description}"
  # end


  ### Popular gems integration

  ## == Devise ==
  # config.authenticate_with do
  #   warden.authenticate! scope: :user
  # end
  # config.current_user_method(&:current_user)

  ## == CancanCan ==
  # config.authorize_with :cancancan

  ## == Pundit ==
  # config.authorize_with :pundit

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  ## == Gravatar integration ==
  ## To disable Gravatar integration in Navigation Bar set to false
  # config.show_gravatar = true

  # Set the admin name here (optional second array element will appear in red). For example:

  # If you want to track changes on your models:
  # config.audit_with :history, 'User'

  # Or with a PaperTrail: (you need to install it first)
  # config.audit_with :paper_trail, 'User'

  # Display empty fields in show views:
  # config.compact_show_view = false


  # Exclude specific models (keep the others):
  # config.excluded_models = ['User']

  # Include specific models (exclude the others):
  # config.included_models = ['User']

  # Label methods for model instances:
  config.label_methods << :description # Default is [:name, :title, :description]

end
