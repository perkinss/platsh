import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import CompetencyObservationTimeSeries from "../../../app/javascript/components/report/CompetencyObservationTimeSeries";

Enzyme.configure({ adapter: new Adapter() });

describe('<CompetencyObservationTimeSeries />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
    }
    let data = [
            { data: [{x: "Nov  3", y: 4}], group: 5, name: "Develop thinking strategies to solve puzzles and play games" },
            { data: [{x: "Nov  3", y: 3}], group: 4, name: "Connect mathematical concepts with each other, with other areas, and with personal interests" }
        ]
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <CompetencyObservationTimeSeries classes={classes} heatMapLoading={false} heatMapData={data} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the heat map', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <CompetencyObservationTimeSeries heatMapLoading={false} classes={classes} heatMapData={data} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Heatmap")
    });

})