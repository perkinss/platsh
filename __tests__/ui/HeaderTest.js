import React from 'react'
import Header from '../../app/javascript/components/Header'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<Header />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(<Header />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})