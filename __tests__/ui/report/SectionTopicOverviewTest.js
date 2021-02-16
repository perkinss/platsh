import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import SectionReportOverview from "../../../app/javascript/components/report/SectionReportOverview";
import {ReportsContext} from "../../../app/javascript/context/ReportsContext";
import {MemoryRouter} from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

describe('<SectionReportOverview />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
        section_loading: {
            topics: false,
            competency: false,
        },
        student_loading: {
            competency: false,
            topics: false,
            heat_map: false,
            standards: false,
            comments: false,
        },
    }
    let section = {
        name: 'New at the Zoo...',
        courses: [
            {
                title: 'Math 9'
            }
        ]
    }
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                        <SectionReportOverview classes={classes} section={section} />
                    </ReportsContext.Provider>
                </ThemeProvider>
            </MemoryRouter>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the student details on first render', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                    <SectionReportOverview classes={classes} section={section}/>
                </ReportsContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Math 9")
    });

})