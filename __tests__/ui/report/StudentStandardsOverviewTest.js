import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import StudentStandardsOverview from "../../../app/javascript/components/report/StudentStandardsOverview";
import { ReportsContext } from "../../../app/javascript/context/ReportsContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentStandardsOverview />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
        topic_averages: {
            3: {
                5:
                    [{ id: 25,
                        course_marks: [
                            {
                                id: 111,
                                name: "Applications of Integration",
                                mark: null,
                                weight: 5
                            }
                        ]
                    }]
            }
        }
    }
    let section = {
        id: 3,
        courses: {
            1: {
                id: 25
            }
        }
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
                <ReportsContext.Provider value={{dispatch: () => {}, state: {} }} >
                    <StudentStandardsOverview classes={classes} student={student} loading={true} tabIndex={1} section={section} />
                </ReportsContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.html()).toContain("CircularProgress")
        expect(wrapper.find('#student-content-chart').html()).toBeNull()
    });

    it('should have the student details on first render', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentStandardsOverview classes={classes} student={student} section={section} tabIndex={1} />
                </ReportsContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Topics Overview")
        let chart = wrapper.find("#student-content-chart")
        expect(chart.html()).not.toBeNull()
    });

})