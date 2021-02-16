import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import CompetencyObservationList from "../../../app/javascript/components/observe/CompetencyObservationList";
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<CompetencyObservationList />', () => {
    let render;
    let question = {
        id: 15,
        name: 'Question 1',
        contentStandards: [
            1, 2, 3,
        ],
        levels: [
            1, 0, 2
        ],
        competencies: [
           1,2,3
        ],
        schemas: [1]
    }
    let scores = {1: 4, 2: 3, 3: 0}
    let comment = {id: 0, student_id: 7, task_id: 15, comment: "This is a comment"}
    let state = {
        available_competencies : [{id: 1, description: "Competency 1"},{id: 2, description: "C 2"},{id: 3, description: "C 3"}],
        students: [{id: 7, name: 'Jane'}],
        selectedAssessment: {
            tasks: [{id: 15, competencies: [1,2,3]}]
        },
        student_competencies: {7: {15: scores}},
        comments: [comment]
    }
    let dispatch = () => {}
    const classes = {}

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{state: state}} >
                <CompetencyObservationList task={question} studentId={7} scores={scores} comment={{}} dispatchFormUpdate={dispatch} classes={classes}/>
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have loaded the initial marks', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{state: state}} >
                <CompetencyObservationList task={question} studentId={7} scores={scores} comment={comment} dispatchFormUpdate={dispatch} classes={classes}/>
            </ConfigurationContext.Provider>);
        expect(wrapper.html()).toContain('>4<')
        expect(wrapper.html()).toContain('>3<')
        expect(wrapper.html()).toContain('>0<')
        expect(wrapper.html()).toContain('Competency 1')
        expect(wrapper.html()).toContain('C 2')
        expect(wrapper.html()).toContain('C 3')
    });


})