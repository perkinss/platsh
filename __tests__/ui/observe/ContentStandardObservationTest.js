import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import ContentStandardObservation from "../../../app/javascript/components/observe/ContentStandardObservation";
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext"

Enzyme.configure({ adapter: new Adapter() });

describe('<ContentStandardObservation />', () => {
    let render;
    let question = {
        id: 1,
        name: 'Question 1',
        contentStandards: [
            1, 2, 3,
        ],
        levels: [
            1, 0, 2
        ],
        competencies: [
            2
        ],
        schemas: [1]
    }

    const classes = {}
    const dispatch = () => {}
    const configuration = {
        student_marks: {
            1: {1: {1: 1}}
        }
    }

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <ContentStandardObservation task={question} classes={classes} description={"test"}/>
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})


/**import { configuration, ConfigurationContext } from "../../app/javascript/context/ConfigurationContext";

 Enzyme.configure({ adapter: new Adapter() });

 describe('<StudentHeader />', () => {
    let render;
    const dispatch = () => {}
    const configuration = {}

    beforeAll(() => {
        render = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
            <StudentHeader topic={"A topic"} competency={"Fantastico"} id={1} classes={{}}/>
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });


 **/