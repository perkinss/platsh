import React, {useContext} from 'react'
import { List } from '@material-ui/core'
import StudentAssessment from "./StudentAssessment";
import {ConfigurationContext} from "../../context/ConfigurationContext";
import {isNullOrUndefined} from "../../helpers/object_helper";

export default function StudentAssessmentList(props) {
    const { state } = useContext(ConfigurationContext)
    const { enrolledStudents, selectedAssessment, classes, loadingMarks, loadingScores,
        loadingComments, loadingAssessmentStandards, loadingAssessmentCompetencies } = props
    const isLoading = loadingMarks || loadingScores || loadingComments || loadingAssessmentCompetencies || loadingAssessmentStandards

    return  (
        <div >
        { enrolledStudents.map((student) => {
            const studentObservations = {
                marks: isLoading ? {} : { ...state.student_marks[student.id] },
                competencies: isLoading ? {} : { ...state.student_competencies[student.id] },
                comments: isLoading ? [] : state.comments.filter(comment => comment.student_id === student.id),
                score: isLoading ? -1 : !isNullOrUndefined(state.assessment_scores[student.id]) ? state.assessment_scores[student.id] : -1
            }
            const key = isLoading ? `-${student.id}` : `${student.id}` // Use different key for loading to manage initial state correctly

            return (
                <StudentAssessment key={key} student={student} loading={isLoading} classes={classes} assessmentDate={state.assessed_date}
                                   selectedAssessment={selectedAssessment} studentObservations={studentObservations}

                />
            )
        })}
        </div>
    )
}
