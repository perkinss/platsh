import React from 'react'
import ConfigureSchemas from '../../../app/javascript/components/configure/ConfigureSchemas'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { configuration, ConfigurationContext } from '../../../app/javascript/context/ConfigurationContext'

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfigureSchemas />', () => {
    let render;
    const dispatch = () => {}

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(<ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
            <ConfigureSchemas classes={{}}/>
        </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should contain competency configuration and course selection', () => {
        const wrapper = render(<ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
            <ConfigureSchemas classes={{}}/>
        </ConfigurationContext.Provider>);
        expect(wrapper.html()).toContain('Standard Marking Schema');
        expect(wrapper.html()).toContain('Select a course ');
    });
})