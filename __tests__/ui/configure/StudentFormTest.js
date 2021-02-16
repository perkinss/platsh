import React from 'react'
import StudentForm from '../../../app/javascript/components/configure/StudentForm'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentForm />', () => {
    let render;
    let classes = {}
    let state = {
        students: []
    }
    let schools = [{id: 1, name: 'Bedrock High'}, {id: 2, name: '2kool4'}]
    let grades = ['1','2']
    let student = {id: '1', name: 'Sam', unique_id: 'Donkeh', school: 1, grade: '2', email: 'sam@bedrock.ca'}

    beforeEach(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} grades={[]} schools={[]}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have schools', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} schools={schools} grades={grades} />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper.html()).toContain('Add New Students')
        expect(wrapper.text()).toContain('Select Grade')
        expect(wrapper.text()).toContain('Select School')
        expect(wrapper.text()).toContain('Save and Add Another')
        expect(wrapper.text()).toContain('Cancel')
    });

    it('should have only save button for editing, and should present with the information of the selected student', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} schools={schools} grades={grades} student={student}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        const doc = wrapper.html()
        const content = wrapper.text()
        expect(doc).toContain('Editing ' + student.name)
        expect(content).toContain('Select Grade')
        expect(content).toContain('Select School')
        expect(content).not.toContain('Save and Add Another')
        expect(content).toContain('Save')
        expect(doc).toContain(student.name)
        expect(doc).toContain(student.unique_id)
        expect(doc).toContain(student.grade)
        expect(doc).toContain(student.email)
        expect(doc).toContain('Select School')
        expect(content).toContain('Cancel')
        expect(doc).toMatch(/id="student-email" value="sam@bedrock.ca"/)
    });

    it('should not disable save if everything is filled', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} schools={schools} grades={grades} student={student}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper.html()).not.toMatch(/<button[^>]+disabled[^>]+><span[^>]+>Save</)
    });

    it('should have error if bad email', () => {
        student.email = '.@@'
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} schools={schools} grades={grades} student={student}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper.text()).toContain('invalid email address')
    });

    it('should disable save if bad email', () => {
        student.email = '.@@'
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} schools={schools} grades={grades} student={student}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper.html()).toMatch(/<button[^>]+disabled[^>]+><span[^>]+>Save</)
    });

    it('should disable save if no school is selected', () => {
        student.school = null
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentForm classes={classes} schools={schools} grades={grades} student={student}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper.html()).toMatch(/<button[^>]+disabled[^>]+><span[^>]+>Save</)
    });

})