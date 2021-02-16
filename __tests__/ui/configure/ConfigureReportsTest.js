import React from 'react'
import ConfigureReports from '../../../app/javascript/components/configure/ConfigureReports'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from '../../../app/javascript/context/ConfigurationContext'

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfigureReports />', () => {
    let shallow;
    let configuration = {
        sections: []
    }
    let dispatch = () =>{}

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <ConfigureReports />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})
