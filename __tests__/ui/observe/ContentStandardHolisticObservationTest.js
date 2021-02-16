import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import ContentStandardHolisticObservation from "../../../app/javascript/components/observe/ContentStandardHolisticObservation";
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext"

Enzyme.configure({ adapter: new Adapter() });

describe('<ContentStandardHolisticObservation />', () => {
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
            1: {1: {1: 6}}
        }
    }

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <ContentStandardHolisticObservation task={question} classes={classes} description={"test"}/>
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})
