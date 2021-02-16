import { getDateParams } from "../helpers/date_helper";
import {useEffect} from "react";

function getTopicParams(selectedTopics, isSubsequentParams) {
    const initialChar = isSubsequentParams ? '&' : '?'
    const urlstring = selectedTopics?.reduce((string, topic) => {
        return string ? `${string}&topic[]=${topic}` : `topic[]=${topic}`
    }, '')

    return `${initialChar}${urlstring}`;
}

const handleLoadJson = (dispatch, type, action) => {
    dispatch({ type: type, ...action })
};

/** Fetches for Selects on Report component **/

export const fetchSections = (dispatch, setLoading) => {
    setLoading(true)
    fetch('/api/sections')
        .then(res => res.json())
        .then(
            (result) => {
                dispatch({type: 'SET_SECTIONS', sections: result})
                setLoading(false)
            },
            (error) => {
                setLoading(false)
                console.log("Error:", error)
            }
        )
}

export const fetchStudents = (dispatch, state, setLoading) => {
    setLoading(true)
    fetch(`api/students/enrollment/${state.selected_section.id}`)
        .then(res => res.json())
        .then(
            (result) => {
                setLoading(false)
                dispatch({type: 'SET_ENROLLED_STUDENTS', students: result})
            },
            (error) => {
                setLoading(false)
                console.log("Error:", error)
            }
        )
}

export const fetchReportingPeriods = (dispatch, state, setReportingConfigLoading) => {
    setReportingConfigLoading(true)
    fetch(`/api/reporting_periods/${state.selected_section.id}`)
        .then(res => res.json())
        .then(
            (result) => {
                dispatch({ type: 'SET_REPORTING_PERIODS', reporting_periods: result })
                setReportingConfigLoading(false)
            },
            (error) => {
                //TODO:Error snackbar
                console.log("Error:", error)
                setReportingConfigLoading(false)
            }
        )
}

export const fetchSectionsTopics = (dispatch, state) => {
    fetch(`api/section/${state.selected_section.id}/contents`)
        .then(res => res.json())
        .then(
            (result) => {
                dispatch({type: 'SET_SECTION_TOPICS', section_topics: result})
            },
            (error) => {
                console.log(error)
            }
        )
}

/** Student Reports fetches **/
export const fetchObservedAssessments = (dispatch, section, student, fromDate, toDate) => {
    dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'observed_assessments', loading: true})
    fetch(`api/reports/student/${student.id}/observed_assessments/${section.id}${getDateParams(fromDate, toDate)}`)
        .then(res => res.json())
        .then(
            (result) => {
                handleLoadJson(dispatch,'SET_OBSERVED_ASSESSMENTS', { json: result, student_id: student.id, section_id: section.id });
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'observed_assessments', loading: false})
            },
            (error) => {
                console.log(error);
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'observed_assessments', loading: false})
            }
        )
}

export const fetchStandardMarks = (dispatch, section, student, fromDate, toDate, selectedTopics) => {
    dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'standards', loading: true})
    const params = `${getDateParams(fromDate, toDate)}${getTopicParams(selectedTopics, fromDate || toDate)}`
    fetch(`api/reports/student/${student.id}/standard_report/${section.id}${params}`)
        .then(res => res.json())
        .then(
            (result) => {
                handleLoadJson(dispatch,'SET_STANDARD_MARKS', {
                    json: result,
                    student_id: student.id,
                    section_id: section.id
                });
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'standards', loading: false})
            },
            (error) => {
                console.log(error);
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'standards', loading: false})
            }
        )
}

export const fetchHeatMap = (dispatch, section, student, fromDate, toDate) => {
    dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'heat_map', loading: true})
    fetch(`api/reports/student/${student.id}/competency_heat_map/${section.id}${getDateParams(fromDate, toDate)}`)
        .then(res => res.json())
        .then(
            (result) => {
                handleLoadJson(dispatch,'SET_HEAT_MAP', {
                    json: result,
                    student_id: student.id,
                    section_id: section.id
                });
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'heat_map', loading: false})
            },
            (error) => {
                console.log(error);
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'heat_map', loading: false})
            }
        )
}

export const fetchTopicMarks = (dispatch, section, student, fromDate, toDate, selectedTopics) => {
    dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'topics', loading: true})
    const params = `${getDateParams(fromDate, toDate)}${getTopicParams(selectedTopics, fromDate || toDate)}`
    fetch(`api/reports/student/${student.id}/content_report/${section.id}${params}`)
        .then(res => res.json())
        .then(
            (result) => {
                handleLoadJson(dispatch,'SET_TOPIC_AVERAGES', {
                    json: result,
                    student_id: student.id,
                    section_id: section.id
                });
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'topics', loading: false})

            },
            (error) => {
                console.log(error);
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'topics', loading: false})
            }
        )
}

export const fetchCompetencyScore = (dispatch, section, student, fromDate, toDate) => {
    dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'competency', loading: true})
    fetch(`api/reports/student/${student.id}/competency_report/${section.id}${getDateParams(fromDate, toDate)}`)
        .then(res => res.json())
        .then(
            (result) => {
                handleLoadJson(dispatch,'SET_COMPETENCY_AVERAGES', {
                    json: result,
                    student_id: student.id,
                    section_id: section.id
                });
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'competency', loading: false})
            },
            (error) => {
                //TODO:Error snackbar
                dispatch({type: 'SET_STUDENT_LOADING_STATE', report: 'competency', loading: false})
                console.log("Error:", error)
            }
        )
}

export const fetchAllStudentReportData = (dispatch, state, fromDate, toDate, selectedTopics) => {

    const section = state.selected_section
    const student = state.selected_student
    fetchCompetencyScore(dispatch, section, student, fromDate, toDate)
    fetchTopicMarks(dispatch, section, student, fromDate, toDate, selectedTopics)
    fetchHeatMap(dispatch, section, student, fromDate, toDate)
    fetchStandardMarks(dispatch, section, student, fromDate, toDate, selectedTopics)
    fetchObservedAssessments(dispatch, section, student, fromDate, toDate)
}

/** Section Report fetches **/
export const fetchSectionTopicMarks = (dispatch, state, fromDate, toDate, selectedTopics) => {
    dispatch({type: 'SET_SECTION_LOADING_STATE', report: 'topics', loading: true})
    const section = state.selected_section
    const params = `${getDateParams(fromDate, toDate)}${getTopicParams(selectedTopics, fromDate || toDate)}`
    fetch(`api/reports/section_content_overview/${section.id}${params}`)
        .then(res => res.json())
        .then(
            (result) => {
                dispatch({type: 'SET_SECTION_CONTENT_MARKS', json: result, id: section.id})
                dispatch({type: 'SET_SECTION_LOADING_STATE', report: 'topics', loading: false})
            },
            (error) => {
                dispatch({type: 'SET_SECTION_LOADING_STATE', report: 'topics', loading: false})
                console.log("Error:", error)
            }
        )
}

export const fetchSectionCompetencyScores = (dispatch, state, fromDate, toDate) => {
    const section = state.selected_section
    dispatch({type: 'SET_SECTION_LOADING_STATE', report: 'competency', loading: true})
    fetch(`api/reports/section_competency_overview/${section.id}${getDateParams(fromDate, toDate)}`)
        .then(res => res.json())
        .then(
            (result) => {
                dispatch({type: 'SET_SECTION_COMPETENCY_SCORES', json: result, id: section.id})
                dispatch({type: 'SET_SECTION_LOADING_STATE', report: 'competency', loading: false})
            },
            (error) => {
                //TODO:Error snackbar
                dispatch({type: 'SET_SECTION_LOADING_STATE', report: 'competency', loading: false})
                console.log("Error:", error)
            }
        )
}

export const fetchAllSectionReportData = (dispatch, state, fromDate, toDate, selectedTopics) => {
    fetchSectionTopicMarks(dispatch, state, fromDate, toDate, selectedTopics)
    fetchSectionCompetencyScores(dispatch, state, fromDate, toDate)
}

