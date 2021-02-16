import React from 'react'
import ConfigureStudents from '../../../app/javascript/components/configure/ConfigureStudents'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { configuration, ConfigurationContext } from '../../../app/javascript/context/ConfigurationContext'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider} from "@material-ui/styles";

Enzyme.configure({ adapter: new Adapter() });

describe('<ConfigureStudents />', () => {
    let shallow, render;
    const dispatch = () => {}
    let state = {
        students: [
            {id: 1, name: 'Sam the cat', unique_id: 'a cat is good', school: 1},
            {id: 3, name: 'Katt the cat', unique_id: 'a cat si bueno', school: 1},
        ]
    }

    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(<ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
            <ConfigureStudents classes={{}}/>
        </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should display the students', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <ConfigureStudents classes={{}}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.html()).toContain('Sam the cat')
        expect(wrapper.html()).toContain('Katt the cat')
    });
})