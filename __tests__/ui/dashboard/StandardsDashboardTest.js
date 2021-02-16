import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import StandardsDashboard from "../../../app/javascript/components/dashboard/StandardsDashboard";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'

Enzyme.configure({ adapter: new Adapter() });

describe('<StandardsDashboard />', () => {
    let render;
    let classes = {
        content: {}
    }

    let section = {
        name: "New at the Zoo...",
        content_stats: [
            {name: "operations",
                id: 1,
                percent_included: "71",
                details: [
                    {
                        average: 80,
                        description: "write and evaluate Powers",
                        h_count: 0,
                        id: 8,
                        l_count: 0,
                        m_count: 2
                    }
                    ]
            },
            {name: "exponents", id: 2, percent_included: "0",details: [
                    {
                        average: 80,
                        description: "write and evaluate Powers",
                        h_count: 0,
                        id: 8,
                        l_count: 0,
                        m_count: 2
                    }]
                    },
        ]
    }
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                    <StandardsDashboard classes={classes} section={section} />
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the details', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <StandardsDashboard classes={classes} show={true} details={section.content_stats[0]} />
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("operations")
        expect(result).not.toContain("exponents")
    });

    it('should remain hidden if not showing', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <StandardsDashboard classes={classes} show={false} details={section.content_stats[0]} />
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toBeNull()
    })

    it('should remain hidden if no details', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <StandardsDashboard classes={classes} show={true} details={''}/>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toBeNull()
    })

})