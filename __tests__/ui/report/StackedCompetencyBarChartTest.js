import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import StackedCompetencyBarChart from "../../../app/javascript/components/report/StackedCompetencyBarChart";

Enzyme.configure({ adapter: new Adapter() });

describe('<StackedCompetencyBarChart />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
    }

    const series =   [{
        name: 'Reasoning and Modelling',
        data: [3.5, 1.0, 2.5]
    }, {
        name: 'Connecting and Reflecting',
        data: [1, 2.5, 1.5]
    }
    ]

    const categories = ['Liz', 'Ashlee Yin', 'Michael Dorn']

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
                    <StackedCompetencyBarChart
                        classes={classes}
                        section={section}
                        series={series}
                        categories={categories}
                        calcStudentGrade={()=>{}}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have some data', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StackedCompetencyBarChart
                        classes={classes}
                        section={section}
                        series={series}
                        categories={categories}
                        calcStudentGrade={()=>{}}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let chart = wrapper.find('#chart')
        expect(chart).not.toBeNull()
    });

    it('should have a spinner when loading ', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StackedCompetencyBarChart
                        classes={classes}
                        section={section}
                        series={series}
                        loading={true}
                        categories={categories}
                        calcStudentGrade={()=>{}}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let chart = wrapper.find('#chart')
        expect(chart).not.toBeNull()
        expect(wrapper.html()).toMatch(/CircularProgress/)
    });


})