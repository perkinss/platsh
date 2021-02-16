import React from 'react'
import Dashboard from '../../../app/javascript/components/Dashboard'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<Dashboard />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(<Dashboard />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})