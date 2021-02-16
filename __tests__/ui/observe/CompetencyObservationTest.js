import React from 'react'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import CompetencyObservation from "../../../app/javascript/components/observe/CompetencyObservation";

Enzyme.configure({ adapter: new Adapter() });

describe('<CompetencyObservation />', () => {
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

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(<CompetencyObservation description="test" task={question} classes={classes}/>)
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})