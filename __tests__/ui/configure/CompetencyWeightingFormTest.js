import React from 'react'
import TopicWeightingForm from '../../../app/javascript/components/configure/TopicWeightingForm'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import CompetencyWeightingForm from "../../../app/javascript/components/configure/CompetencyWeightingForm";

Enzyme.configure({ adapter: new Adapter() });

describe('<CompetencyWeightingForm />', () => {
    let render;
    let classes = {}
    let state = {
        sections: [
            {
                courses: [
                    {id: 5, title: "Course 1 of course"},
                    {id: 2, title: "Course 2 of course"}
                ]
            },
            {
                courses: [
                    {id: 6, title: "Course 5 of course"},
                    {id: 2, title: "Course 2 of course"}
                ]
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
                    <CompetencyWeightingForm classes={classes} />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})