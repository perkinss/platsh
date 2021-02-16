import React from 'react'
import StandardCheckbox from '../../../app/javascript/components/observe/StandardCheckbox'
import { createRender, createMount } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<StandardCheckbox />', () => {
    let render, mount;
    const dispatch = () => {}
    const configuration = {
        student_marks: {
            1: {1: {1: 1}}
        }
    }
    const classes = {}

    beforeAll(() => {
        render = createRender();
        mount = createMount();
    })

    afterAll(() => {
        mount.cleanUp()
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <StandardCheckbox studentId={1} taskId={1} classes={classes} id={2} />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should be checked if the standard is present', () => {
        const wrapper = mount(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <StandardCheckbox studentId={1} taskId={1} classes={classes} id={1} isChecked={true} />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper.find('.checkbox')).not.toBeNull()
        expect(wrapper.html()).toContain('checked')
    });

    it('should not be checked if the standard is not present', () => {
        const wrapper = mount(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <StandardCheckbox studentId={1} taskId={1} classes={classes} id={20} />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper.find('.checkbox')).not.toBeNull()
        expect(wrapper.html()).not.toContain('checked')
    });

})
