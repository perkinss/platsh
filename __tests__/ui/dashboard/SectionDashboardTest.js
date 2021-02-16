import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import SectionDashboard from "../../../app/javascript/components/dashboard/SectionDashboard";
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'

Enzyme.configure({ adapter: new Adapter() });

describe('<SectionDashboard />', () => {
    let render;
    let classes = {
        content: {}
    }
    let state = {
        dashboard : { '1' : { '2': { content_stats: [
                        {name: "operations", id: 1, percent_included: "71"},
                        {name: "exponents", id: 2, percent_included: "0"},
                    ] }}}
    }
    let section = {
        id: 2,
        name: "New at the Zoo...",
    }

    let dashboard = {
        content_stats : [
            {name: "operations", id: 1, percent_included: "71"},
            {name: "exponents", id: 2, percent_included: "0"},
        ]
    }
    let courseId = 1
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: {dashboard: {}} }} >
                    <SectionDashboard classes={classes} section={section} courseId={courseId} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the content details on first render.  If only we could click the button', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <SectionDashboard classes={classes} section={section} courseId={courseId} testData={dashboard}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()

        expect(result).toContain("New at the Zoo")
        expect(result).not.toContain("works")
        expect(result).not.toContain("plays")
        expect(result).toContain("operations")
        expect(result).toContain("exponents")
    });

})