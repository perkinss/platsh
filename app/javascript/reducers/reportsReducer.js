const SET_SECTIONS = 'SET_SECTIONS'
const SET_SELECTED_SECTION = 'SET_SELECTED_SECTION'
const CLEAR_SELECTED_SECTION = 'CLEAR_SELECTED_SECTION'
const SET_SELECTED_STUDENT = "SET_SELECTED_STUDENT"
const SET_SECTION_TOPICS = "SET_SECTION_TOPICS"
const SET_ENROLLED_STUDENTS = "SET_ENROLLED_STUDENTS"
const SET_SECTION_CONTENT_MARKS = 'SET_SECTION_CONTENT_MARKS'
const SET_SECTION_COMPETENCY_SCORES = 'SET_SECTION_COMPETENCY_SCORES'
const SET_STANDARD_MARKS = 'SET_STANDARD_MARKS'
const SET_OBSERVED_ASSESSMENTS = 'SET_OBSERVED_ASSESSMENTS'
const SET_COMPETENCY_AVERAGES = 'SET_COMPETENCY_AVERAGES'
const SET_HEAT_MAP = 'SET_HEAT_MAP'
const SET_TOPIC_AVERAGES = 'SET_TOPIC_AVERAGES'
const SET_COMMENTS_FROM_FETCH = 'SET_COMMENTS_FROM_FETCH'
const SET_REPORTING_PERIODS = 'SET_REPORTING_PERIODS'
const SET_HEAT_MAP_COLORS = 'SET_HEAT_MAP_COLORS'
const SET_STUDENT_LOADING_STATE = 'SET_STUDENT_LOADING_STATE'
const SET_SECTION_LOADING_STATE = 'SET_SECTION_LOADING_STATE'

export const initialReportsState = {
    students: [],
    sections: [],
    selected_section: null,
    selected_student: null,
    section_overview_marks: null,
    section_competency_scores: null,
    topic_averages: null,
    standard_marks: {},
    observed_assessments: {},
    heat_map: {},
    section_loading: {
        topics: true,
        competency: true,
    },
    student_loading: {
        competency: true,
        topics: true,
        heat_map: true,
        standards: true,
        comments: true,
        observed_assessments: true,
    },
    heat_map_colors: [],
    section_topics: [],
}

export function reportsReducer(state = initialReportsState, action) {
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
        case SET_ENROLLED_STUDENTS:
            return {
                ...state,
                students: action.students
            }
        case SET_SELECTED_STUDENT:
            return {
                ...state,
                selected_student: action.student
            }
        case SET_SECTION_TOPICS:
            return {
                ...state,
                section_topics: action.section_topics
            }
        case SET_SECTION_CONTENT_MARKS:
            return {
                ...state,
                section_overview_marks: {
                    ...state.section_overview_marks,
                    [action.id]: action.json
                }
            }
        case SET_SECTION_COMPETENCY_SCORES:
            return {
                ...state,
                section_competency_scores: {
                    ...state.section_competency_scores,
                    [action.id]: action.json
                }
            }
        case SET_COMPETENCY_AVERAGES:
            let loaded_averages = state.competency_averages ? state.competency_averages[action.section_id] : {}
            return {
                ...state,
                competency_averages: {
                    ...state.competency_averages,
                    [action.section_id]: {
                        ...loaded_averages,
                        [action.student_id]: action.json
                    }
                }
            }
        case SET_TOPIC_AVERAGES:
            let loaded_json =  state.topic_averages ?  state.topic_averages[action.section_id] : {}
            return {
                ...state,
                topic_averages: {
                    ...state.topic_averages,
                    [action.section_id]: {
                        ...loaded_json,
                        [action.student_id]: action.json.content_report
                    }
                }
            }
        case SET_STANDARD_MARKS:
            let loaded_marks =  state.standard_marks ?  state.standard_marks[action.section_id] : {}
            return {
                ...state,
                standard_marks: {
                    ...state.standard_marks,
                    [action.section_id]: {
                        ...loaded_marks,
                        [action.student_id]: action.json
                    }
                }
            }
        case SET_OBSERVED_ASSESSMENTS:
            let loaded_assessments = state.observed_assessments ?  state.observed_assessments[action.section_id] : {}
            return {
                ...state,
                observed_assessments: {
                    ...state.observed_assessments,
                    [action.section_id]: {
                        ...loaded_assessments,
                        [action.student_id]: action.json
                    }
                }
            }
        case SET_HEAT_MAP:
            let existing_heat_map = state.heat_map ? state.heat_map[action.section_id] : {}
            return {
                ...state,
                heat_map: {
                    ...state.heat_map,
                    [action.section_id] : {
                        ...existing_heat_map,
                        [action.student_id]: action.json
                    }
                }
            }
        case SET_HEAT_MAP_COLORS:
            let group_colors = ['#A93F55','#FEB019','#00E396','#2176FF']
            let competencies = action.competencies.reverse()
            let colors = competencies.map((c, index) => { if (c.percentage > 0) return group_colors[index]}).filter((c) => c)
            return {
                ...state,
                heat_map_colors: colors
            }
        case SET_COMMENTS_FROM_FETCH:
            return {
                ...state,
                comments: action.comments
            }
        case SET_REPORTING_PERIODS:
            return {
                ...state,
                reporting_periods: action.reporting_periods
            }
        case SET_SECTION_LOADING_STATE:
            let current_section_loading = {...state.section_loading}
            if (action.report) {
                current_section_loading[action.report] = action.loading
            } else {
                current_section_loading = initialReportsState.section_loading
            }
            return {
                ...state,
                section_loading: current_section_loading
            }
        case SET_STUDENT_LOADING_STATE:
            let current_student_loading = {...state.student_loading}
            if (action.report) {
                current_student_loading[action.report] = action.loading
            } else {
                current_student_loading = initialReportsState.student_loading
            }
            return {
                ...state,
                student_loading: current_student_loading
            }
        default:
            return state;
    }

}
