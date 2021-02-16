import React from 'react'
import Configure from '../../../app/javascript/components/configure/Configure'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<Configure />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(<Configure />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})