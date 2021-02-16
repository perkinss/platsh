export function studentAssessmentReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_ALL_STUDENT_STANDARDS':
            let marks = action.marks
            return {
                ...state,
                marks: { ...marks }
            }
        case 'TOGGLE_STANDARD_OBSERVATION':
            // TODO simplify if possible
            let mark = action.mark
            let taskId = mark.taskId
            let standardId = Number(mark.standardId)
            let met = mark.met
            let score = mark.score
            let studentMark = {}
            if (state.marks[taskId]) {
                studentMark = {...state.marks[taskId]}
            }
            if (!met) {
                delete studentMark[standardId]
            } else {
                studentMark[standardId] = score
            }
            return {
                ...state,
                marks: {...state.marks, [taskId]: studentMark }
            }
        case 'TOGGLE_COMPETENCY_OBSERVATION':
            mark = action.mark
            return {
                ...state,
                competencies: { ...state.competencies, [mark.taskId]: mark.scores },
            }
        case 'SET_STUDENT_COMMENT':
            let commentStudentId = action.commentData.studentId
            let commentTaskId = action.commentData.taskId
            let tmpComments = state.comments.map(originalComment => ({...originalComment})) // Copy the original comments to avoid changing initial state
            let theComment = tmpComments.find((stateComment) => stateComment.task_id === commentTaskId)
            if (theComment) {
                theComment.comment = action.commentData.comment
            } else {
                tmpComments.push({student_id: commentStudentId, task_id: commentTaskId, comment: action.commentData.comment})
                tmpComments.sort((a, b) => {
                    let result = a.student_id - b.student_id
                    if (result === 0) {
                        result = a.task_id - b.task_id
                    }
                    return result
                })
            }
            return {
                ...state,
                comments:tmpComments
            }

        default:
            return state
    }
}
