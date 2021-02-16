import React from 'react'
import AssessmentForm from '../../../app/javascript/components/configure/AssessmentForm'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { configuration, ConfigurationContext } from '../../../app/javascript/context/ConfigurationContext'

Enzyme.configure({ adapter: new Adapter() });

describe('<AssessmentForm />', () => {
    let render;
    const dispatch = () => {}

    beforeAll(() => {
        render = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = render(<ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
            <AssessmentForm classes={{}}/>
        </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });
})