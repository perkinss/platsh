import React from 'react'
import CourseSectionForm from '../../../app/javascript/components/configure/CourseSectionForm'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<CourseSectionForm />', () => {
    let render, shallow;
    const dispatch = () => {}
    const state = {
        selected_section: {
            assessments: [{name: 'a1'}],
            courses: [
                {id: 1, title: "Math 9", grade: "9", subject: "Mathematics"},
                {id: 2, title: "Foundations of Mathematics and Precalculus 10", grade: "10", subject: "Mathematics"}
                ],
            students: ['John', 'Sara'],
            created_at: "2019-08-04T19:49:47.319Z",
            id: 17,
            name: "New at the Zoo...",
            updated_at: "2019-08-04T19:49:47.319Z",
            user_id: 1,
        },
        students: ['John', 'Sara', 'Sam', 'Bugs Bunny'],
        courses: [
            {id: 1, title: "Math 9", grade: "9", subject: "Mathematics"},
            {id: 2, title: "Foundations of Mathematics and Precalculus 10", grade: "10", subject: "Mathematics"},
            {id: 1, title: "Math 10", grade: "10", subject: "Mathematics"},
            {id: 2, title: "Science 10", grade: "10", subject: "Science"},
            ],
    }

    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: {}}} >
                <CourseSectionForm />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the selected section data ', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: state}} >
                <CourseSectionForm />
            </ConfigurationContext.Provider>);
        const content = wrapper.text()
        expect(content).toContain("Section name")
        expect(content).toContain("​Math 9")
        expect(content).toContain("Enrolled Students")
    })

    it('should render without assessments ', () => {
        let newState = {
            selected_section: {
                courses: [
                    {id: 1, title: "Math 9", grade: "9", subject: "Mathematics"}
                ],
                created_at: "2019-08-04T19:49:47.319Z",
                id: 17,
                name: "New at the Zoo...",
                updated_at: "2019-08-04T19:49:47.319Z",
                user_id: 1,
            },
            students: ['John', 'Sara', 'Sam', 'Bugs Bunny'],
            courses: [
                {id: 1, title: "Math 9", grade: "9", subject: "Mathematics"},
            ]
        }
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: newState}} >
                <CourseSectionForm />
            </ConfigurationContext.Provider>);
        const content = wrapper.text()
        expect(content).toContain("Section name")
        expect(content).toMatch(/.*Math 9.*/)
        expect(content).toContain("Enrolled Students")
    })

})