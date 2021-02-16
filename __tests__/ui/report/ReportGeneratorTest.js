import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ReportsContext } from "../../../app/javascript/context/ReportsContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import ReportGenerator from "../../../app/javascript/components/report/ReportGenerator";
import {MemoryRouter} from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

describe('<ReportGenerator />', () => {
    let render, shallow;
    let section, student, state;
    let classes = {
        content: {}
    }

    beforeEach(() => {
        shallow = createShallow();
        render = createRender();
        section = {
            id: 1,
            name: 'Foo'
        }
        student = {
            id: 850,
            name: "Jane",
            unique_id: "Jane",
            school: 2,
            deletable: true,
            grade: "12",
            has_enrollments: false,
            email: "p.sh@w.com",
            pronoun_1: "She",
            pronoun_2: "Her"
        }
        state = {
            topic_averages:
                {
                    1: {
                        850: [{
                            id: 5,
                            title: "Pre-calculus 11",
                            course_marks: [
                                {
                                    id: 13,
                                    name: "Rational Functions",
                                    mark: 83.33333333333333,
                                    weight: 1,
                                },
                                {
                                    id: 15,
                                    name: "Inequalities",
                                    mark: 80,
                                },
                                {
                                    id: 12,
                                    name: "Polynomial Factoring",
                                    mark: 75,
                                }
                            ]
                        },],
                    },
                },
            reporting_periods: [
                {
                    id: 1,
                    name: 'werowrw',
                    contents: [
                        {
                            course_id: 7,
                            id: 111,
                            name: "Applications of Integration",
                        },
                        {
                            course_id: 7,
                            id: 105,
                            name: "Differentiation: Definition and Fundamental Properties",
                        },
                        {
                            course_id: 7,
                            id: 3,
                            name: "Applications of Integration",
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'BAH',
                    contents: [
                        {
                            course_id: 7,
                            id: 1,
                            name: "THOUGHTS of Integration",
                        },
                        {
                            course_id: 7,
                            id: 5,
                            name: "Differentiation: ELUSIVE Properties",
                        },
                        {
                            course_id: 7,
                            id: 11,
                            name: "Applications of PROPERTIES",
                        },
                    ],
                },
            ]
        }
    });

    it('should match the snapshot when hidden', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                    <ReportGenerator classes={classes} showGenerator={false} />
                </ReportsContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper.html()).toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should match the snapshot when loading', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{dispatch: () => {}, state: {} }} >
                    <ReportGenerator classes={classes} student={student} section={section} showGenerator={true} />
                </ReportsContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toMatchSnapshot()
    });

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{state: state }} >
                    <ReportGenerator
                        classes={classes}
                        showGenerator={true}
                        student={student}
                        section={section}
                        testLoadingState={false}
                    />
                </ReportsContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result.toMatchSnapshot)
        expect(result).toContain('Comments for Jane')
        expect(result).toContain('Foo')
        expect(result).not.toContain('<textarea')
    });


})