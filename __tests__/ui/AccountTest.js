import React from 'react'
import Account from '../../app/javascript/components/account/Account'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<Account />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(<Account />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the right content', () => {
        const wrapper = shallow(<Account />);
        expect(wrapper.text()).toContain('<Header />');
    });

})