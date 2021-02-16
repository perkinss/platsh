import React from 'react'
import StudentAssessmentList from '../../../app/javascript/components/observe/StudentAssessmentList'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider} from "@material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentAssessmentList />', () => {
    let render;

    const dispatch = () => {}
    const observations = {
        marks: {1 : [2,3], 2: [4]},
        competencies: {1 : {2 :3, 3: 2}, 2: {3:4}},
        comments: [],
        score: 4
    }
    const classes = {
        content: {}
    }
    let selectedAssessment = {
        name: "Ch 3 - Differentiation",
        id: 326,
        competency: 5,
        type: {id: 9, name: "Test", description: "Tests use a range of question types including true… Formative tests, and Summative tests. "},
        sections: [
            {
                id: 1,
                name: 'Test Section',
                courses: [
                    {
                        id: 9, title: "Test course 12", grade: "12", subject: "Mathematics"
                    }
                ]
            }
        ],
        tasks: [
            {
                id: 1,
                name: "1",
                standards: {1: "H"},
                competencies: [],
            },
            {
                id: 2,
                name: "2",
                standards: {2: "H"},
                competencies: []
            }
        ],
    }

    const state = {
        assessed_date: '2019-08-18T22:09:51.271Z',
        available_competencies : [{id: 1, description: "Competency 1"},{id: 2, description: "C 2"},{id: 3, description: "C 3"}],
        available_standards: [
            {id: 1, description: "and butterflies are free to fly"},
            {id: 2, description: "fly away"},
            {id: 3, description: "bye bye"},
            {id: 4, description: "someone saved my life tonight, sugar bear"}
        ],
        student_marks: {
            1: {
                1 : {2: 1, 3: 1}, 2: {4: 1},
            },
            2: {
                1 : {2: 1, 3: 1}, 2: {4: 1}
            },

        },
        student_competencies: {
            1: {2 :3, 3: 2},
            2: {3:4},
         },
        assessment_scores: {
            1: {5: 5},
            2: {5: 0}
        },
        comments: []
    }

    let enrolledStudents = [{id: 1, name: "Sam I Am"},{id: 2, name: "Green Eggs and Ham"} ]

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state}} >
                    <StudentAssessmentList
                        loadingAssessmentCompetencies={true}
                        loadingAssessmentStandards={true}
                        loadingMarks={true}
                        loadingScores={true}
                        loadingComments={true}
                        enrolledStudents={enrolledStudents}
                        selectedAssessment={selectedAssessment}
                        classes={{}}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        )
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have skeletons when loading', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state}} >
                    <StudentAssessmentList
                        loadingAssessmentCompetencies={true}
                        loadingAssessmentStandards={true}
                        loadingMarks={true}
                        loadingScores={true}
                        loadingComments={true}
                        enrolledStudents={enrolledStudents}
                        selectedAssessment={selectedAssessment}
                        classes={{}}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        )
        let doc = wrapper.html()
        let text = wrapper.text()
        expect(text).toBe('')
        expect(doc).toMatch(/.*Skeleton.*Skeleton.*Skeleton/)

    });

    it('should have student data when done loading', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state}} >
                    <StudentAssessmentList
                        loadingAssessmentCompetencies={false}
                        loadingAssessmentStandards={false}
                        loadingMarks={false}
                        loadingScores={false}
                        loadingComments={false}
                        enrolledStudents={enrolledStudents}
                        selectedAssessment={selectedAssessment}
                        classes={{}}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        )
        let doc = wrapper.html()
        let text = wrapper.text()

        expect(doc).not.toMatch(/.*Skeleton.*Skeleton.*Skeleton/)
        expect(text).toBe('SamTotal: 3 / 2 standards in 2 tasksSelect all / ClearSave 1and butterflies are free to ' +
        'fly  2fly away GreenTotal: 3 / 2 standards in 2 tasksSelect all / ClearSave 1and butterflies are free to fly  2fly away ')
    });

})