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

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentGradeOverview />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {

    }

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentGradeOverview classes={classes} />
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
                    <StudentGradeOverview classes={classes} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Content Total:")
        expect(result).toContain("Competency Total:")
        expect(result).toContain("Overall Score: *")
        expect(result).toContain("tasks assessed so far")
    });

    it('should show N/A if there is no data', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentGradeOverview classes={classes} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        expect(wrapper.text()).toContain('Competency Total:N/A')
        expect(wrapper.text()).toContain('Content Total:N/A')
        expect(wrapper.text()).toContain('Overall Score: *')
    });

    it('should have circular progress indicator while waiting to load', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentGradeOverview classes={classes} competenciesLoading={true} contentLoading={true}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        expect(wrapper.text()).not.toContain('N/A')
        expect(wrapper.html()).toMatch(/.*CircularProgress.*CircularProgress.*CircularProgress/)

    });

    it('should have competency data when available, and circular progress for content when content waiting to load', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentGradeOverview classes={classes} competenciesLoading={false} competencyTotal={50} contentLoading={true}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        expect(wrapper.text()).not.toContain('N/A')
        expect(wrapper.text()).toMatch(/.*Competency Total:50 %.*Content Total:.*/)
        expect(wrapper.html()).toMatch(/.*Competency Total:.*50 %.*CircularProgress.*CircularProgress/)
    });

    it('should have content data when available, and circular progress for competency when competency waiting to load', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentGradeOverview classes={classes} competenciesLoading={true} contentTotal={80} contentLoading={false}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        expect(wrapper.text()).not.toContain('N/A')
        expect(wrapper.text()).toMatch(/Competency Total:.*Content Total:80 %.*/)
        expect(wrapper.html()).toMatch(/.*CircularProgress.*CircularProgress.*Content Total:.*80 %/)
    });

    it('should calculate the correct course grade when data is completely loaded', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentGradeOverview
                        classes={classes}
                        competencyTotal={50}
                        competenciesLoading={false}
                        contentTotal={80}
                        contentLoading={false}
                        topicsWeighting={75}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let expected = ((50.0 * 25.0 ) + (80.0 * 75.0))/100
        expect(wrapper.text()).not.toContain('N/A')
        expect(wrapper.text()).toMatch(/Competency Total:50 %Content Total:80 %/)
        expect(wrapper.html()).toMatch(/.*Overall Score:.*Competency Total:.*50 %.*Content Total:.*80 %/)
        expect(wrapper.html()).not.toContain('CircularProgress')

    });

})