import React from 'react'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import ConfigureAssessments from "../../../app/javascript/components/configure/ConfigureAssessments";
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfigureAssessments />', () => {
    let shallow;
    let classes = {
        content: {}
    }
    let state = {}
    beforeAll(() => {
        shallow = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                <ConfigureAssessments classes={classes} />
            </ConfigurationContext.Provider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });


})