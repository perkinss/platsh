import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import CompetenciesDashboard from "../../../app/javascript/components/dashboard/CompetenciesDashboard";

Enzyme.configure({ adapter: new Adapter() });

describe('<CompetenciesDashboard />', () => {
    let render;
    let classes = {
        content: {}
    }

    let section = {
        name: "New at the Zoo...",
        competency_stats: [
            {title: "Bee kind",
                id: 1,
                percent_included: "71",
                percent_observed: "22",
                details: [
                    {
                        mode: 3,
                        description: "Bee kind to bees every day",
                        count: 23,
                        id: 8,
                    }]
            },
            {
                title: "Communicating and representing",
                id: 2,
                percent_included: "0",
                percent_observed: "0",
                details: [
                    {
                        mode: 0,
                        description: "what we have heeere is a failure to commun'cate",
                        count: 0,
                        id: 3,
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
                    <CompetenciesDashboard classes={classes} section={section} />
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the details', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <CompetenciesDashboard classes={classes} show={true} details={section.competency_stats[0]} />
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toContain("Bee kind")
        expect(result).not.toContain("Communicating and representing")
    });

    it('should remain hidden if not showing', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <CompetenciesDashboard classes={classes} show={false} details={section.competency_stats[1]} />
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toBeNull()
    })

    it('should remain hidden if no details', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <CompetenciesDashboard classes={classes} show={true} details={''}/>
            </ThemeProvider>
        );
        let result = wrapper.html()
        expect(result).toBeNull()
    })

})