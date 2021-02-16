import React from 'react'
import Report from '../../../app/javascript/components/report/Report'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { MemoryRouter } from 'react-router-dom'
import AuthenticationWrapper from "../../../app/javascript/context/AuthenticationWrapper";
import { ReportsContext } from "../../../app/javascript/context/ReportsContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from "@material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe('<Report />', () => {
    let shallow, render;

    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })
    let state =
        {
            courses: [],
            students: [],
            sections: [
                {
                    name: "New at the Zoo...",
                    content_stats: [
                        {name: "operations", id: 1, percent_included: "71"},
                        {name: "exponents", id: 2, percent_included: "0"},
                    ],
                    courses: [{title: 'Foo', id: 1}]
                }
            ],
            selected_section: {
                name: "New at the Zoo...",
                content_stats: [
                    {name: "operations", id: 1, percent_included: "71"},
                    {name: "exponents", id: 2, percent_included: "0"},
                ],
                courses: [{title: 'Foo', id: 1}]
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

    it('should match the snapshot', () => {
        const wrapper = shallow(<Report />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the right content', () => {
        const wrapper = shallow(<Report />);

        expect(wrapper.text()).toContain('<Report />');
    });

    it('should have the right content when loaded with student and section', () => {
        window.sessionStorage.setItem('authenticated', 'true')
        window.sessionStorage.setItem('authData', JSON.stringify({email:'placeholder',roles:['teacher']}))

        const wrapper = render(
            <MemoryRouter>
                <ThemeProvider theme={theme}>
                <AuthenticationWrapper>
                    <ReportsContext.Provider value={{dispatch: () => {}, state: state }}>
                        <Report testState={state}/>
                    </ReportsContext.Provider>
                </AuthenticationWrapper>
                </ThemeProvider>
            </MemoryRouter>);

        let html = wrapper.html()
        expect(html).toContain('Section');
        expect(html).toContain('Student');
        expect(html).toContain('Section and Student Reports')
    })
})
