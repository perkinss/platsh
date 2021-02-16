import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import TeachersStudentReport from "../../../app/javascript/components/report/TeachersStudentReport";
import StudentGradeOverview from "../../../app/javascript/components/report/StudentGradeOverview";
import StudentCompetencyOverview from "../../../app/javascript/components/report/StudentCompetencyOverview";

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentCompetencyOverview />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
    }
    let student = {
        id: 5, name: "Ed Shearan", unique_id: "edshe@ran.com", created_at: "2019-07-07T05:07:00.505Z", updated_at: "2019-07-07T05:07:00.505Z"
    }
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentCompetencyOverview classes={classes} student={student} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the student details on first render', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentCompetencyOverview classes={classes} student={student} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Competency Overview")
    });

})