const SET_SECTIONS = 'SET_SECTIONS'
const ADD_SECTION = "ADD_SECTION"
const UPDATE_SECTION = "UPDATE_SECTION"
const REMOVE_SECTION = 'REMOVE_SECTION'
const SET_SELECTED_SECTION = 'SET_SELECTED_SECTION'
const CLEAR_SELECTED_SECTION = 'CLEAR_SELECTED_SECTION'
const ADD_ASSESSMENT = "ADD_ASSESSMENT";
const ADD_TASK_TO_CURRENT_ASSESSMENT = 'ADD_TASK_TO_CURRENT_ASSESSMENT'
const SET_TASKS_ON_CURRENT_ASSESSMENT = 'SET_TASKS_ON_CURRENT_ASSESSMENT'
const UPDATE_TASK_IN_CURRENT_ASSESSMENT = 'UPDATE_TASK_IN_CURRENT_ASSESSMENT'
const REMOVE_TASK_FROM_CURRENT_ASSESSMENT = 'REMOVE_TASK_FROM_CURRENT_ASSESSMENT'
const SET_CURRENT_ASSESSMENT ='SET_CURRENT_ASSESSMENT'
const SAVE_ASSESSMENT = 'SAVE_ASSESSMENT'
const UPDATE_ASSESSMENT = 'UPDATE_ASSESSMENT'
const REMOVE_ASSESSMENT = 'REMOVE_ASSESSMENT'
const SET_ASSESSMENT_SCORE = 'SET_ASSESSMENT_SCORE'
const SET_AVAILABLE_STANDARDS = 'SET_AVAILABLE_STANDARDS'
const SET_AVAILABLE_COMPETENCIES = 'SET_AVAILABLE_COMPETENCIES'
const SET_ASSESSMENTS = 'SET_ASSESSMENTS'
const SET_SHARED_ASSESSMENTS = 'SET_SHARED_ASSESSMENTS'
const ADD_SHARED_ASSESSMENT = 'ADD_SHARED_ASSESSMENT'
const REMOVE_SHARED_ASSESSMENT = 'REMOVE_SHARED_ASSESSMENT'
const ADD_STUDENT = "ADD_STUDENT"
const REMOVE_STUDENT = "REMOVE_STUDENT"
const UPDATE_STUDENT = "UPDATE_STUDENT"
const SET_STUDENTS = "SET_STUDENTS"
const SET_DASHBOARD = 'SET_DASHBOARD'
const SET_SELECTED_COURSE_ID = 'SET_SELECTED_COURSE_ID'
const SET_MARKS_FROM_FETCHED_OBSERVATIONS = 'SET_MARKS_FROM_FETCHED_OBSERVATIONS'
const SET_ASSESSMENT_DATE = 'SET_ASSESSMENT_DATE'
const SET_SCORES_FROM_FETCHED_OBSERVATIONS = 'SET_SCORES_FROM_FETCHED_OBSERVATIONS'
const SET_COMMENTS_FROM_FETCH = 'SET_COMMENTS_FROM_FETCH'
// TODO: move separate components data to their its own reducers/contexts
const SET_COURSES = 'SET_COURSES'
const ADD_SECTION_TO_DASHBOARD = 'ADD_SECTION_TO_DASHBOARD'
const SET_REPORTING_PERIODS = 'SET_REPORTING_PERIODS'
const REMOVE_REPORTING_PERIOD = 'REMOVE_REPORTING_PERIOD'
const ADD_OR_UPDATE_REPORTING_PERIOD = 'ADD_OR_UPDATE_REPORTING_PERIOD'
const UPDATE_REPORTING_PERIOD = 'UPDATE_REPORTING_PERIOD'
const SET_SELECTED_PERIOD = 'SET_SELECTED_PERIOD'

export const initialConfigState = {
    students: [],
    sections: [],
    assessments: [],
    current_assessment: { },
    selected_section: null,
    student_marks: {},
    assessment_scores: {},
    initial_marks: {},
    student_competencies: {},
    available_standards: [],
    available_content_standards: [],
    available_grouped_competencies: [],
    available_competencies: [],
    new_assessment: {},
    selected_assessment: {},
    selected_course_id: null,
    comments: [],
    courses: {},
    dashboard: {},
    heat_map_colors: [],
    reporting_periods: [],
}

export function configReducer(state = initialConfigState, action) {
    switch (action.type) {
        case SET_SECTIONS:
            return {
                ...state,
                sections: action.sections
            }
        case SET_SELECTED_SECTION:
            return {
                ...state,
                selected_section: action.section
            }
        case CLEAR_SELECTED_SECTION:
            return {
                ...state,
                selected_section: null
            }
        case ADD_SECTION:
            return {
                ...state,
                sections: [...state.sections, action.section]
            };
        case REMOVE_SECTION:
            const sections = state.sections.filter(section => section.id !== action.id)
            return {
                ...state,
                sections: sections
            };
        case UPDATE_SECTION:
            let state_sections = state.sections.filter(section => section.id !== action.section.id )
            return {
                ...state,
                sections: [action.section, ...state_sections]
            }

            return state
       // Section and assessment configuration
        case SET_AVAILABLE_STANDARDS:
            const flatStandards = [].concat.apply([],Array.from(action.standards).map((course) => {
                return [].concat.apply([],course.contents.map((content) => {
                    return content.standards
                }))
            }))
            return {
                ...state,
                available_content_standards: action.standards,
                available_standards: flatStandards
            }
        // Assessments configuration:
        case SET_AVAILABLE_COMPETENCIES:
            const flatCompetencies = Array.from(action.competencies).map((course) => {
                return course.groups.map((group) => {
                    return group.competencies
                }).flat()
            }).flat()
            return {
                ...state,
                available_grouped_competencies: action.competencies,
                available_competencies: flatCompetencies
            }
        case ADD_ASSESSMENT:
            return {
                ...state,
                assessments: [action.assessment, ...state.assessments]
            }
        case SET_CURRENT_ASSESSMENT:
            return {
                ... state,
                current_assessment: action.assessment
            }
        case SAVE_ASSESSMENT:
            return {
                ...state,
                 assessments: [...state.assessments, action.assessment],
            };
        case UPDATE_ASSESSMENT:
            let stateAssessments = state.assessments.filter(assessment => assessment.id !== action.assessment.id)
            return {
                ...state,
                assessments: [ action.assessment, ...stateAssessments]
            }
        case REMOVE_ASSESSMENT:
            let next_assessments = state.assessments.filter(assessment => assessment.id !== action.id)
            let next_shared_assessments = state.shared_assessments.filter(shared => shared.id != action.id)
            return {
                ...state,
                assessments: next_assessments,
                shared_assessments: next_shared_assessments
            }
        case ADD_TASK_TO_CURRENT_ASSESSMENT:
            if (!state.current_assessment.tasks) {
                return {
                    ...state,
                    current_assessment: {...state.current_assessment, tasks: [action.task]}
                }
            } else {
                let tasks = [...state.current_assessment.tasks, action.task]
                return {
                    ...state,
                    current_assessment: {...state.current_assessment,  tasks: tasks}
                }
            }
        case SET_TASKS_ON_CURRENT_ASSESSMENT:
            return {
                ...state,
                current_assessment: {...state.current_assessment, tasks: action.tasks}
            }
        case UPDATE_TASK_IN_CURRENT_ASSESSMENT:
            // todo: handle case of new task not having an id but needing to be updated and having the same name as another new task (ugh, users!)
            if (action.task.id) {
                let new_tasks = [...state.current_assessment.tasks]
                let task_index = new_tasks.map ( task => task.id).indexOf(action.task.id)
                new_tasks[task_index] = action.task
                return {
                    ...state,
                    current_assessment: {...state.current_assessment,  tasks: new_tasks}
                }
            } else {
                let new_tasks = [...state.current_assessment.tasks]
                let task_index = new_tasks.map ( task => task.name).indexOf(action.task.name)
                new_tasks[task_index] = action.task
                return {
                    ...state,
                    current_assessment: {...state.current_assessment,  tasks: new_tasks}
                }
            }
        case REMOVE_TASK_FROM_CURRENT_ASSESSMENT:
            if (action.task.id) {
                let new_tasks = state.current_assessment.tasks.filter ( task => task.id !== action.task.id)
                return {
                    ...state,
                    current_assessment: {...state.current_assessment, tasks: new_tasks}
                }
            } else {
                let new_tasks = state.current_assessment.tasks.filter ( task => task.name !== action.task.name)
                return {
                    ...state,
                    current_assessment: {...state.current_assessment, tasks: new_tasks}
                }
            }
        case SET_ASSESSMENTS:
            return {
                ...state,
                assessments: action.assessments
            }
        case SET_SHARED_ASSESSMENTS:
            return {
                ...state,
                shared_assessments: action.assessments
            }
        case ADD_SHARED_ASSESSMENT:
            return {
                ...state,
                shared_assessments: [...state.shared_assessments, action.assessment],
                current_assessment: {...state.current_assessment, shared: true}
            }
        case REMOVE_SHARED_ASSESSMENT:
            return {
                ...state,
                shared_assessments: state.shared_assessments.filter(shared => shared.id != action.assessment.id),
                current_assessment: {...state.current_assessment, shared: false}
            }
        case SET_ASSESSMENT_SCORE:
            return {
                ...state,
                assessment_scores: action.score
            }
        case ADD_STUDENT:
            return {
                ...state,
                students: [...state.students, action.student]
            }
        case REMOVE_STUDENT:
            let next_students = state.students.filter(student => student.id !== action.id)
            return {
                ...state,
                students: next_students
            }
        case UPDATE_STUDENT:
            let index = state.students.map(student => student.id).indexOf(action.student.id)
            next_students = [...state.students]
            next_students[index] = action.student
            return {
                ...state,
                students: next_students
            }
        case SET_STUDENTS:
            return {
                ...state,
                students: action.students
            }
        case ADD_SECTION_TO_DASHBOARD:
            let coursedash = state.dashboard[action.courseId] || {}
            coursedash[action.dashboard.id] = {
                content_stats: action.dashboard.content_stats,
                competency_stats: action.dashboard.competency_stats
            }
            let newState = {
                ...state,
                dashboard: {
                    [action.courseId]: coursedash,
                    ...state.dashboard
                },
            }
            return newState
        case SET_DASHBOARD:
            // TODO: insert the course or section dashboard into its rightful place
            return {
                ...state,
                dashboard: action.dashboard
            }
        case SET_SELECTED_COURSE_ID:
            return {
                ...state,
                selected_course_id: action.course_id
            }
        case SET_MARKS_FROM_FETCHED_OBSERVATIONS:
            const student_marks = action.observations.student_marks
            return {
                ...state,
                student_marks: student_marks
            }
        case SET_ASSESSMENT_DATE:
            const assessed_date = action.assessed_date
            return {
                ...state,
                assessed_date: assessed_date,
            }
        case SET_SCORES_FROM_FETCHED_OBSERVATIONS:
            let scores = action.observations.student_competencies
            // pluck the assessment scores from the returned observations:
            let assessment_scores = find_assessment_scores(scores, state.current_assessment.competency)
            return {
                ...state,
                student_competencies: scores,
                assessment_scores: assessment_scores
            }
        case SET_COMMENTS_FROM_FETCH:
            action.comments.sort((a, b) => {
                let result = a.student_id - b.student_id
                if (result === 0) {
                    result = a.task_id - b.task_id
                }
                return result
            })
            return {
                ...state,
                comments: action.comments
            }
        case SET_COURSES:
            return {
                ...state,
                courses: action.courses
            }
        case SET_REPORTING_PERIODS:
            return {
                ...state,
                reporting_periods: action.reporting_periods
            }
        case REMOVE_REPORTING_PERIOD:
            let copy = state.reporting_periods
            let toRemove = copy.find(p => p.id === action.reporting_period_id)
            copy.splice(copy.indexOf(toRemove), 1)
            return {
                ...state,
                reporting_periods: copy
            }
        case ADD_OR_UPDATE_REPORTING_PERIOD:
            let periods = state.reporting_periods
            let period = state.reporting_periods.find(p => p.id === action.reporting_period.id)
            if (period) {
                periods = periods.filter(p => p.id !== action.reporting_period.id)
            }
            periods.unshift(action.reporting_period)
            return {
                ...state,
                reporting_periods: periods
            }
        case SET_SELECTED_PERIOD:
            return {
                ...state,
                selected_period: action.period,
            }
        default:
            return state;
    }

}

export const find_assessment_scores = (student_scores, competency) => {
    if (!competency) return {}

    let assessment_scores = {}
    Object.keys(student_scores).map( key => {
        let scores = student_scores[key]
        // only need one task to find the assessment score because it is the same on all tasks.
        let task_key = Object.keys(scores)[0]
        if (scores) {
            let competency_score = Object.entries(scores[task_key]).find( entry => `${entry[0]}` === `${competency}`)
            if (competency_score) {
                assessment_scores[key] = competency_score[1]
            }
        }
    })
    return assessment_scores
}