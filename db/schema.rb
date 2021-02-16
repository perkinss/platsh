# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_12_31_042934) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "assessment_courses", id: false, force: :cascade do |t|
    t.bigint "course_id"
    t.bigint "assessment_id"
    t.index ["assessment_id"], name: "index_assessment_courses_on_assessment_id"
    t.index ["course_id", "assessment_id"], name: "index_assessment_courses_on_course_id_and_assessment_id", unique: true
    t.index ["course_id"], name: "index_assessment_courses_on_course_id"
  end

  create_table "assessment_scoring_types", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "assessment_types", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "description"
  end

  create_table "assessments", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.bigint "assessment_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "competency_id"
    t.bigint "assessment_scoring_type_id", default: 1, null: false
    t.boolean "shared", default: false
    t.index ["assessment_scoring_type_id"], name: "index_assessments_on_assessment_scoring_type_id"
    t.index ["assessment_type_id"], name: "index_assessments_on_assessment_type_id"
    t.index ["competency_id"], name: "index_assessments_on_competency_id"
    t.index ["user_id"], name: "index_assessments_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "comment"
    t.bigint "task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "student_id"
    t.index ["student_id"], name: "index_comments_on_student_id"
    t.index ["task_id", "student_id"], name: "index_comments_on_task_id_and_student_id", unique: true
    t.index ["task_id"], name: "index_comments_on_task_id"
  end

  create_table "competencies", force: :cascade do |t|
    t.bigint "course_id"
    t.bigint "competency_group_id"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phrasing"
    t.index ["competency_group_id"], name: "index_competencies_on_competency_group_id"
    t.index ["course_id"], name: "index_competencies_on_course_id"
  end

  create_table "competency_group_weightings", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "competency_group_id"
    t.integer "weight"
    t.bigint "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["competency_group_id"], name: "index_competency_group_weightings_on_competency_group_id"
    t.index ["course_id"], name: "index_competency_group_weightings_on_course_id"
    t.index ["user_id", "competency_group_id", "course_id"], name: "index_cg_weighting_unique_course_user_competencygroup", unique: true
    t.index ["user_id"], name: "index_competency_group_weightings_on_user_id"
  end

  create_table "competency_groups", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "competency_observations", force: :cascade do |t|
    t.bigint "task_id"
    t.bigint "user_id"
    t.bigint "competency_id"
    t.bigint "student_id"
    t.text "comment"
    t.integer "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "assessed_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["assessed_at"], name: "index_competency_observations_on_assessed_at"
    t.index ["competency_id"], name: "index_competency_observations_on_competency_id"
    t.index ["student_id"], name: "index_competency_observations_on_student_id"
    t.index ["task_id", "student_id", "competency_id"], name: "index_competency_observation_unique_comp_task_stu", unique: true
    t.index ["task_id"], name: "index_competency_observations_on_task_id"
    t.index ["user_id"], name: "index_competency_observations_on_user_id"
  end

  create_table "content_weightings", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "content_id"
    t.integer "weight"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["content_id"], name: "index_content_weightings_on_content_id"
    t.index ["user_id", "content_id"], name: "index_content_weightings_on_user_id_and_content_id", unique: true
    t.index ["user_id"], name: "index_content_weightings_on_user_id"
  end

  create_table "contents", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.bigint "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_contents_on_course_id"
  end

  create_table "course_weightings", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "contents_weight"
    t.bigint "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_course_weightings_on_course_id"
    t.index ["user_id", "course_id"], name: "index_course_weightings_on_user_id_and_course_id", unique: true
    t.index ["user_id"], name: "index_course_weightings_on_user_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "grade"
    t.string "subject"
    t.index ["grade"], name: "index_courses_on_grade"
    t.index ["subject"], name: "index_courses_on_subject"
  end

  create_table "courses_sections", id: false, force: :cascade do |t|
    t.bigint "course_id"
    t.bigint "section_id"
    t.index ["course_id"], name: "index_courses_sections_on_course_id"
    t.index ["section_id", "course_id"], name: "index_courses_sections_on_section_id_and_course_id", unique: true
    t.index ["section_id"], name: "index_courses_sections_on_section_id"
  end

  create_table "customer_users", id: false, force: :cascade do |t|
    t.bigint "customer_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_customer_users_on_customer_id"
    t.index ["user_id"], name: "index_customer_users_on_user_id"
  end

  create_table "customers", force: :cascade do |t|
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "default_content_weightings", force: :cascade do |t|
    t.bigint "content_id"
    t.integer "weight"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["content_id"], name: "index_default_content_weightings_on_content_id"
  end

  create_table "enrollments", force: :cascade do |t|
    t.bigint "section_id"
    t.bigint "student_id"
    t.date "start"
    t.date "end"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_id"], name: "index_enrollments_on_section_id"
    t.index ["student_id"], name: "index_enrollments_on_student_id"
  end

  create_table "reporting_period_contents", force: :cascade do |t|
    t.bigint "reporting_period_id", null: false
    t.bigint "content_id", null: false
    t.index ["content_id"], name: "index_reporting_period_contents_on_content_id"
    t.index ["reporting_period_id"], name: "index_reporting_period_contents_on_reporting_period_id"
  end

  create_table "reporting_periods", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.bigint "section_id"
    t.datetime "period_start"
    t.datetime "period_end"
    t.index ["section_id"], name: "index_reporting_periods_on_section_id"
    t.index ["user_id"], name: "index_reporting_periods_on_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "school_users", id: false, force: :cascade do |t|
    t.bigint "school_id"
    t.bigint "user_id"
    t.index ["school_id", "user_id"], name: "index_school_users_on_school_id_and_user_id", unique: true
    t.index ["school_id"], name: "index_school_users_on_school_id"
    t.index ["user_id"], name: "index_school_users_on_user_id"
  end

  create_table "schools", force: :cascade do |t|
    t.string "name"
    t.integer "school_code"
    t.integer "district_number"
    t.string "city"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sections", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_sections_on_user_id"
  end

  create_table "sections_assessments", force: :cascade do |t|
    t.bigint "section_id"
    t.bigint "assessment_id"
    t.index ["assessment_id"], name: "index_sections_assessments_on_assessment_id"
    t.index ["section_id", "assessment_id"], name: "index_sections_assessments_on_section_id_and_assessment_id", unique: true
    t.index ["section_id"], name: "index_sections_assessments_on_section_id"
  end

  create_table "standard_observations", force: :cascade do |t|
    t.bigint "task_id"
    t.bigint "user_id"
    t.bigint "standard_id"
    t.bigint "student_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "assessed_at", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.string "level"
    t.integer "score", default: 1
    t.index ["assessed_at"], name: "index_standard_observations_on_assessed_at"
    t.index ["standard_id"], name: "index_standard_observations_on_standard_id"
    t.index ["student_id"], name: "index_standard_observations_on_student_id"
    t.index ["task_id", "student_id", "standard_id"], name: "index_standard_observation_unique_stan_task_stu", unique: true
    t.index ["task_id"], name: "index_standard_observations_on_task_id"
    t.index ["user_id"], name: "index_standard_observations_on_user_id"
  end

  create_table "standards", force: :cascade do |t|
    t.bigint "content_id"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["content_id"], name: "index_standards_on_content_id"
  end

  create_table "students", force: :cascade do |t|
    t.string "name", null: false
    t.string "unique_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "school_id"
    t.string "grade"
    t.bigint "customer_id"
    t.string "email"
    t.string "pronoun", default: "They/Them/Their"
    t.string "preferred_name"
    t.index ["customer_id"], name: "index_students_on_customer_id"
    t.index ["school_id"], name: "index_students_on_school_id"
    t.index ["unique_id", "customer_id"], name: "index_students_on_unique_id_and_customer_id", unique: true
  end

  create_table "task_competencies", id: false, force: :cascade do |t|
    t.bigint "competency_id"
    t.bigint "task_id"
    t.index ["competency_id"], name: "index_task_competencies_on_competency_id"
    t.index ["task_id", "competency_id"], name: "index_task_competencies_on_task_id_and_competency_id", unique: true
    t.index ["task_id"], name: "index_task_competencies_on_task_id"
  end

  create_table "task_standards", force: :cascade do |t|
    t.bigint "task_id"
    t.bigint "standard_id"
    t.string "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["standard_id"], name: "index_task_standards_on_standard_id"
    t.index ["task_id", "standard_id"], name: "index_task_standards_on_task_id_and_standard_id", unique: true
    t.index ["task_id"], name: "index_task_standards_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name"
    t.bigint "assessment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assessment_id"], name: "index_tasks_on_assessment_id"
  end

  create_table "user_students", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "student_id"
    t.index ["student_id"], name: "index_user_students_on_student_id"
    t.index ["user_id"], name: "index_user_students_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.boolean "superadmin", default: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.string "provider"
    t.string "uid"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "assessment_courses", "assessments"
  add_foreign_key "assessment_courses", "courses"
  add_foreign_key "assessments", "assessment_scoring_types"
  add_foreign_key "assessments", "assessment_types"
  add_foreign_key "assessments", "competencies"
  add_foreign_key "assessments", "users"
  add_foreign_key "comments", "students"
  add_foreign_key "comments", "tasks"
  add_foreign_key "competencies", "competency_groups"
  add_foreign_key "competencies", "courses"
  add_foreign_key "competency_group_weightings", "competency_groups"
  add_foreign_key "competency_group_weightings", "courses"
  add_foreign_key "competency_group_weightings", "users"
  add_foreign_key "competency_observations", "competencies"
  add_foreign_key "competency_observations", "students"
  add_foreign_key "competency_observations", "tasks"
  add_foreign_key "competency_observations", "users"
  add_foreign_key "content_weightings", "contents"
  add_foreign_key "content_weightings", "users"
  add_foreign_key "contents", "courses"
  add_foreign_key "course_weightings", "courses"
  add_foreign_key "course_weightings", "users"
  add_foreign_key "customer_users", "customers"
  add_foreign_key "customer_users", "users"
  add_foreign_key "default_content_weightings", "contents"
  add_foreign_key "enrollments", "sections"
  add_foreign_key "enrollments", "students"
  add_foreign_key "reporting_period_contents", "contents"
  add_foreign_key "reporting_period_contents", "reporting_periods"
  add_foreign_key "reporting_periods", "sections"
  add_foreign_key "reporting_periods", "users"
  add_foreign_key "school_users", "schools"
  add_foreign_key "school_users", "users"
  add_foreign_key "sections", "users"
  add_foreign_key "standard_observations", "standards"
  add_foreign_key "standard_observations", "students"
  add_foreign_key "standard_observations", "tasks"
  add_foreign_key "standard_observations", "users"
  add_foreign_key "standards", "contents"
  add_foreign_key "students", "customers"
  add_foreign_key "students", "schools"
  add_foreign_key "tasks", "assessments"
  add_foreign_key "user_students", "students"
  add_foreign_key "user_students", "users"
end
