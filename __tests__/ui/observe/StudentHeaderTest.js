import React from 'react'
import StudentHeader from '../../../app/javascript/components/observe/StudentHeader'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentHeader />', () => {
    let render;
    const dispatch = () => {}
    const observations = {
        marks: {1 : [2,3], 2: [4]},
        competencies: {1 : {2 :3, 3: 2}, 2: {3:4}},
        comments: [],
        score: 4
    }
    let student = {id: 1, name: "Sam I Am"}
    let tasks = [
        {
            id: 1,
            name: "Question 1",
            standards: {1: 'green', 2: 'eggs', 3: 'and'},
            competencies: {2: 'thing', 3: 'thing'}
         },

        {
            id: 2,
            standards: {3: 'and', 4: 'ham'},
            competencies: {3: 'thing'}
        }]
    let assessmentCompetency = {id: 5, description: 'amazingly competent'}

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <StudentHeader
                topic={"A topic"}
                id={1}
                classes={{}}
                student={student}
                tasks={tasks}
                dispatchFormUpdate={dispatch}
                storedStudentObservations={observations}
                inProgressStudentObservations={observations} />
        )
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have some of the content', () => {
        const wrapper = render(
            <StudentHeader
                topic={"A topic"}
                id={1}
                classes={{}}
                student={student}
                tasks={tasks}
                dispatchFormUpdate={dispatch}
                storedStudentObservations={observations}
                inProgressStudentObservations={observations} />
        )
        let doc = wrapper.html()
        expect(doc).toContain(student.name)
        expect(doc).toContain('3 / 5')
        expect(doc).toContain('2 tasks')
        expect(doc).toMatch(/<button[^>]+disabled[^>]+><span[^>]+><svg.*\/svg>Save</)
        expect(doc).not.toContain('scoreslider')
        expect(wrapper.find('button').html()).toContain('Save')
    });

    it('should show the score slider when assessment comeptency present', () => {
        const wrapper = render(
            <StudentHeader
                topic={"A topic"}
                assessmentCompetency={assessmentCompetency}
                id={1}
                classes={{}}
                student={student}
                tasks={tasks}
                dispatchFormUpdate={dispatch}
                storedStudentObservations={observations}
                inProgressStudentObservations={observations}/>
        )
        let doc = wrapper.html()
        expect(doc).toContain(student.name)
        expect(doc).toContain('3 / 5')
        expect(doc).toContain('2 tasks')
        expect(doc).toMatch(/<button[^>]+disabled[^>]+><span[^>]+><svg.*\/svg>Save</)
        expect(doc).toContain('scoreslider')
        expect(doc).toContain('amazingly competent')
        expect(doc).toContain('<input type="hidden" value="4">')
        expect(wrapper.find('button').html()).toContain('Save')

    })

})