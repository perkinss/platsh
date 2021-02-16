import expect from "expect";
import { configReducer, find_assessment_scores } from "../../../app/javascript/reducers/configurationReducer"
import {studentAssessmentReducer} from "../../../app/javascript/reducers/studentAssementReducer";

describe('configReducer handles actions appropriately', () => {

    it("find assessment scores gets the right scores from the tasks" ,() => {
        // student 1 got 3 on the assessment competency id 2, student 2 got 0
        const student_scores = {1: {2: {1: 0, 2: 3}, 3: {5: 4, 2: 3}}, 2: {2: {1: 4, 20: 6, 2: 0}, 3: {1: 4, 2: 0} }}
        const assessmentCompetency = {id: 2, description: 'extremely cooperative'}
        let assessmentScores = find_assessment_scores (student_scores, assessmentCompetency.id)

        expect(assessmentScores[1]).toEqual(3)
        expect(assessmentScores[2]).toEqual(0)
    })

    //TODO more tests to make sure the reducer continues to handle the state properly.  should be fun, actually
})