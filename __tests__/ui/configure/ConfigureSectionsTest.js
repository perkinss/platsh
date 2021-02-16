import React from 'react'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import ConfigureSections from "../../../app/javascript/components/configure/ConfigureSections";
import { configuration, ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfigureSections />', () => {
    let shallow;
    let classes = {
        content: {}
    }
    let dispatch = () => {}

    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <ConfigureSections classes={classes}/>
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // Test whether clicking the add button opens the course-section panel for the selected course

})
