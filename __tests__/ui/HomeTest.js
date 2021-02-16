import React from 'react'
import Home from '../../app/javascript/components/Home'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<Home />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {

        const wrapper = shallow(<Home />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})
