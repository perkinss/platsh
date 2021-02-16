import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import ContentStandardObservationList from "../../../app/javascript/components/observe/ContentStandardObservationList";
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext"
import {ThemeProvider} from "@material-ui/styles";
import theme from "../../../app/javascript/styles/theme";

Enzyme.configure({ adapter: new Adapter() });

describe('<ContentStandardObservationList />', () => {
    let render;
    let task = {
        id: 1,
        name: "Elton John",
        standards: {
            1: 'you',
            2: 'almost',
            3: 'had me',
            4: 'roped'
        }
    }

    const classes = {}
    const dispatch = () => {}
    const configuration = {
        student_marks: {
            1: {1: {1: 1}},
            2: {1: {2: 1}}
        },
        available_standards: [
            {id: 1, description: "and butterflies are free to fly"},
            {id: 2, description: "fly away"},
            {id: 3, description: "bye bye"},
            {id: 4, description: "someone saved my life tonight, sugar bear"}
        ]
    }

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                    <ContentStandardObservationList task={task} classes={classes} studentId={1} standardObservations={configuration.student_marks[1][1]}
                                                    dispatchFormUpdate={dispatch} isHolistic={false}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})
