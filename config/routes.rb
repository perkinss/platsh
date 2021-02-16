Rails.application.routes.draw do
  
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  get 'api/schools' => 'school#list', as: 'school_list'
  get 'api/schools/get_for_user' => 'school#get_for_user', as: 'school_list_get_for_user'
  get 'api/comments/:assessment_id' => 'comment#fetch_for_assessment', as: 'comments_fetch_for_assessment'
  get 'api/comments/:section_id/student/:student_id' => 'comment#fetch_for_report', as: 'comments_fetch_for_report'
  post 'api/comments/:assessment_id' => 'comment#save', as: 'comments_save'
  get 'api/reports/student/:id/standard_report/:section_id' => 'reports#student_standard_report', as: 'student_standard_report'
  get 'api/reports/student/:id/competency_heat_map/:section_id' => 'reports#student_competency_heat_map', as: 'student_competency_heat_map'
  get 'api/reports/student/:id/content_report/:section_id' => 'reports#student_content_report',as: 'reports_student_content'
  get 'api/reports/student/:id/competency_report/:section_id' => 'reports#student_competency_report',as: 'reports_student_competency'
  get 'api/reports/student/:id/observed_assessments/:section_id' => 'reports#student_observed_assessments', as: 'student_observed_assessments'
  get 'api/reports/section_competency_overview/:id' => 'reports#section_competency_overview', as: 'reports_competency_overview'
  get 'api/reports/section_content_overview/:id' => 'reports#section_content_overview', as: 'reports_section_overview'
  get 'api/reporting_periods/:id' => 'reporting_periods#for_section', as: 'reporting_periods_for_section'
  get 'api/reporting_periods' => 'reporting_periods#list', as: 'reporting_periods'
  post 'api/reporting_period' => 'reporting_periods#new', as: 'reporting_period_create'
  post 'api/reporting_period/:id' => 'reporting_periods#update', as: 'reporting_period_update'
  delete 'api/reporting_periods/:id' => 'reporting_periods#delete', as: 'reporting_period_delete'
  post 'api/course/:id/course_weighting/save' => 'course_weighting#save', via: :post, as: 'course_weighting_save'
  get 'api/course_weighting' => 'course_weighting#list', as: 'course_weighting_for_user'
  post 'api/competency_weighting/update' => 'competency_group_weighting#save', via: :post, as: 'competency_weighting_save'
  get 'api/competency_weighting/get_for_user_courses' => 'competency_group_weighting#get_for_user_courses', as: 'competency_weighting_get_for_user_courses'
  post 'api/content_weighting/update' => 'content_weighting#save', via: :post, as: 'content_weighting_save'
  get 'api/content_weighting/get_for_user_courses' => 'content_weighting#get_for_user_courses', as: 'content_weighting_get_for_user_courses'
  get 'api/dashboard/list'  => 'dashboard#list', as: "dashboard_list"
  get 'api/dashboard/:course_id/section/:section_id' => 'dashboard#section_dashboard', as: "section_dashboard"
  post 'api/standard_observations/new' => 'observations#new_standard', via: :post, as: "observations_new"
  post 'api/observations/new' => 'observations#create_marks', via: :post, as: "create_marks"
  post 'api/observations/save' => 'observations#save_marks', via: :post, as: "save_marks"
  get 'api/standard_observations/read'
  get 'api/section/:section_id/assessments/:assessment_id/marks/list' => 'observations#list_marks', as: "list_marks"
  get 'api/section/:section_id/assessments/:assessment_id/scores/list' => 'observations#list_competency_scores', as: "list_scores"
  scope :authcheck do
    get 'is_signed_in', to: 'authcheck#is_signed_in?'
  end
  post 'api/enrollments/new' => 'enrollments#new', via: :post, as: "enroll"
  get 'enrollments/list'
  post 'api/students/new'=> 'students#new', via: :post, as: "students_new"
  delete 'api/students/:id' => 'students#delete', via: :post, as: "students_delete"
  put 'api/students/:id' => 'students#update', via: :put, as: "students_update"
  get 'api/students/list' => 'students#list', as: "students_list"
  get 'api/students/list/student' => 'students#list_for_student_user', as: "students_list_for_student_user"
  get 'api/students/enrollment/:section' => 'students#enrolled', as: "students_enrolled"
  post 'api/students/import'=> 'students#import', via: :post, as: "students_import"
  post 'api/students/:id/invite' => 'students#invite', via: :post, as: 'students_user_invite'
  post 'api/assessments/new' => 'assessments#new', via: :post, as: "assessments_new"
  post 'api/assessments/:id' => 'assessments#update', via: :post, as: "assessments_update"
  delete 'api/assessments/:id' => 'assessments#delete', via: :post, as: "assessments_delete"
  post 'api/assessments/:id/share' => 'assessments#share', via: :post, as: "assessments_share"
  delete 'api/assessments/:id/share' => 'assessments#stop_sharing', via: :post, as: "assessments_stop_sharing"
  get 'api/assessments/' => 'assessments#get_for_user', as: "assessments_get_for_user"
  get 'api/assessments/shared' => 'assessments#get_shared', as: "assessments_get_shared"
  get 'api/competencies/get_by_section/:section' => 'competencies#get_by_section', as: "get_by_section"
  get 'api/competencies/get_by_assessment/:assessment' => 'competencies#get_by_assessment', as: "get_by_assessment"
  get "/api/competencies/get_by_course" => 'competencies#get_by_course', as: "get_by_course"
  get '/users/sign_in',  to: redirect('/login')
  get '/users/sign_up',  to: redirect('/signup')
  devise_for :users, :controllers => {sessions: 'sessions', omniauth_callbacks: "users/omniauth_callbacks", registrations: 'registrations', confirmations: 'confirmations'}
  resources :users
  get 'api/standards/get_all_for_course' => 'standard#get_all_for_course', as: "get_standards_for_course"
  get 'api/standard/getAllForSection/:section' => 'standard#get_all_for_section', as: "get_standards_for_section"
  get 'api/standard/get_all_for_assessment/:assessment' => 'standard#get_all_for_assessment', as: "get_all_for_assessment"
  delete 'api/sections/:id' => 'sections#delete', via: :post, as: "sections_delete"
  post 'api/sections/new' => 'sections#new', via: :post, as: "sections_new"
  post 'api/sections/:id' => 'sections#update', via: :post, as: "sections_update"
  get 'api/sections' => 'sections#find_sections_for_user', as: "find_sections_for_user"
  get 'api/sections/student' => 'sections#find_sections_for_student_user', as: "find_sections_for_student_user"
  get 'api/section/:id/contents' => 'sections#contents', as: 'section_contents'
  get 'content/courseContents/:id' => 'content#courseContents', as: 'course_contents'
  get 'courses/index'
  get 'api/courses' => 'courses#course_configuration', as: 'courses_all_content'
  get 'api/courses/list' => 'courses#list', as: 'course_sections_list_for_user'
  put 'api/user/schools' => 'users#update_schools', via: :put, as: "user_schools_update"
  root :to => 'pages#index'
  get '*path', to: 'pages#index'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
