import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import TeachersStudentReport from "../../../app/javascript/components/report/TeachersStudentReport";
import SectionReportOverview from "../../../app/javascript/components/report/SectionReportOverview";
import StackedTopicBarChart from "../../../app/javascript/components/report/StackedTopicBarChart";

Enzyme.configure({ adapter: new Adapter() });

describe('<StackedTopicBarChart />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
    }
    const series =   [{
        name: 'Operations',
        data: [12.5, 10, 12.5, 8, 7, 12.5, 12.5]
    }, {
        name: 'Exponents',
        data: [10, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5]
    }, {
        name: 'Polynomials',
        data: [12.5, 12.5, 11, 9, 12.5, 12.5, 12.5]
    }, {
        name: 'two-variable linear relations',
        data: [12.5, 7, 12.5, 8, 6, 12.5, 12.5]
    }, {
        name: 'linear equations',
        data: [12.5, 12, 12.5, 12.5, 12, 12.5, 12]
    },
        {
            name: 'proportional reasoning',
            data: [12.5, 5, 5, 10, 10, 8, 5]
        },
        {
            name: 'statistics',
            data: [10, 2, 0, 0, 3, 0, 5]
        },
        {
            name: 'financial literacy',
            data: [12, 1, 1, 3,1, 3, 3]
        }
    ]

    const categories = ['Liz', 'Ashlee Yin', 'Michael Dorn', 'Worf', 'Buzz', 'Liz', 'Zoe']

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
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StackedTopicBarChart
                        classes={classes}
                        section={section}
                        series={series}
                        categories={categories}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StackedTopicBarChart
                        classes={classes}
                        section={section}
                        series={series}
                        categories={categories}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let chart = wrapper.find('#chart')
        expect(chart).not.toBeNull()
    });

    it('should be empty if there is no data', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StackedTopicBarChart
                        classes={classes}
                        section={section}
                        series={[]}
                        categories={categories}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let chart = wrapper.find('#chart')
        expect(chart).not.toBeNull()
        expect(wrapper.html()).toContain('No data available')

    });

    it('should have a spinner when loading', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StackedTopicBarChart
                        classes={classes}
                        section={section}
                        series={[]}
                        categories={categories}
                        loading={true}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let chart = wrapper.find('#chart')
        expect(chart).not.toBeNull()
        expect(wrapper.html()).toMatch(/CircularProgress/)

    });

})