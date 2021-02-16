import React from 'react'
import Login from '../../app/javascript/components/Login'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import RootAuthContext from '../../app/javascript/context/AuthenticationWrapper'

Enzyme.configure({ adapter: new Adapter() });

describe('<Login />', () => {
    let shallow;

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {

        const wrapper = shallow(<RootAuthContext ><Login /></RootAuthContext>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})