import expect from "expect";
import { studentAssessmentReducer } from "../../../app/javascript/reducers/studentAssementReducer"

describe('studentReducer handles actions appropriately', () => {
    it("Adding a new comment to a task sets it in state without mutating the original state" ,() => {
        const previousState = { comments: [] }
        const newComment = { studentId: 1, taskId: 11, comment: "My New Comment" }

        let updatedState = studentAssessmentReducer(previousState, {type: 'SET_STUDENT_COMMENT', commentData: newComment})

        expect(updatedState.comments).toEqual([{ student_id: 1, task_id: 11, comment: "My New Comment" }])
        expect(previousState.comments).toEqual([])
    })

    it("Adding a new comment puts into state sorted by student_id then task_id" ,() => {
        const previousState = { comments: [
                { student_id: 1, task_id: 15, comment: "Comment 1" },
                { student_id: 2, task_id: 11, comment: "Comment 2" },
                { student_id: 2, task_id: 13, comment: "Comment 3" },
                { student_id: 3, task_id: 11, comment: "Comment 4" },
        ]}
        const newComment = { studentId: 2, taskId: 12, comment: "Comment 5" }

        let updatedState = studentAssessmentReducer(previousState, {type: 'SET_STUDENT_COMMENT', commentData: newComment})

        // The new comment should be in the middle of the list based on its studentId and taskId
        expect(updatedState.comments.map(obj => obj.comment)).toEqual(["Comment 1", "Comment 2", "Comment 5", "Comment 3", "Comment 4"])
    })
})