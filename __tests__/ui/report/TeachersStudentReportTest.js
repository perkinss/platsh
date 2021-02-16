import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import TeachersStudentReport from "../../../app/javascript/components/report/TeachersStudentReport";
import {ReportsContext} from "../../../app/javascript/context/ReportsContext";
import {MemoryRouter} from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

describe('<TeachersStudentReport />', () => {
    let render, shallow;
    let classes = {
        content: {
            flexGrow: 1,
            padding: theme.spacing(2,0,2,2),
            marginRight: 0,
        },
    }
    let state = {
        selected_student: {
            id: 5, name: "Ed Shearan", unique_id: "edshe@ran.com", created_at: "2019-07-07T05:07:00.505Z", updated_at: "2019-07-07T05:07:00.505Z"
        },
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
    let student = {
        id: 5, name: "Ed Shearan", unique_id: "edshe@ran.com", created_at: "2019-07-07T05:07:00.505Z", updated_at: "2019-07-07T05:07:00.505Z"
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
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                        <TeachersStudentReport classes={classes} student={student} section={section} clearStudent={() => null} />
                    </ReportsContext.Provider>
                </ThemeProvider>
            </MemoryRouter>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the student details on first render', () => {
        const wrapper = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                    <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                        <TeachersStudentReport classes={classes} student={student} section={section}/>
                    </ReportsContext.Provider>
                </ThemeProvider>
            </MemoryRouter>
        );
        let result = wrapper.text()
        expect(result).toContain("Math 9")
        expect(result).toContain("Competency Overview")
        expect(result).toContain("Course Topics Overview")
        expect(result).toContain("Competency Progress Heatmap and Most Recent Mode (MRM)")
    });

})