import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import CourseDashboardOverview from "../../../app/javascript/components/dashboard/CourseDashboardOverview";
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'

Enzyme.configure({ adapter: new Adapter() });

describe('<CourseDashboardOverview />', () => {
    let render;
    let classes = {

    }
    let state = {
        courses: {
            1: {
                title: "Math 9",
                sections: {
                    17:
                    {
                        name: "New at the Zoo...",
                    }
                }
            }}}
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <CourseDashboardOverview classes={classes} />
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
                    <CourseDashboardOverview classes={classes} />
                </ConfigurationContext.Provider>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Math 9")
        expect(result).toContain("CourseDashboard-expand")
        // everything hidden by default.

    });



})