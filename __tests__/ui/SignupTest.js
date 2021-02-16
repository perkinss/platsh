import React from 'react'
import Signup from '../../app/javascript/components/Signup'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import RootAuthContext from '../../app/javascript/context/AuthenticationWrapper'

Enzyme.configure({ adapter: new Adapter() });

describe('<Signup />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {

        const wrapper = shallow(<RootAuthContext ><Signup /></RootAuthContext>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})