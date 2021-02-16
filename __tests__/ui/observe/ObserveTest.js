import React from 'react'
import Observe from '../../../app/javascript/components/observe/Observe'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import {MemoryRouter} from "react-router";
import AuthenticationWrapper from "../../../app/javascript/context/AuthenticationWrapper";

Enzyme.configure({ adapter: new Adapter() });

describe('<Observe />', () => {
    let shallow, render;


    let state = {
        available_competencies : [{id: 1, description: "Competency 1"},{id: 2, description: "C 2"},{id: 3, description: "C 3"}],
        students: [{id: 7, name: 'Jane'}],
        selected_section: {name: 'aha'},
        selected_assessment: {
            tasks: [{id: 15, competencies: [1,2,3]}]
        },
        student_competencies: {7: {15: {1: 4, 2: 3, 3: 0}}}
    }

    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(<Observe />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have circular progress when loading sections', () => {
        window.sessionStorage.setItem('authenticated', 'true')
        window.sessionStorage.setItem('authData', JSON.stringify({email:'placeholder',roles:['teacher']}))
        const wrapper = render(
            <MemoryRouter>
                <AuthenticationWrapper>
                    <ConfigurationContext.Provider value={{dispatch: () => {}, state: state}} >
                        <Observe />
                    </ConfigurationContext.Provider>
                </AuthenticationWrapper>
            </MemoryRouter>);
        expect(wrapper.html()).toContain("Observe")
        expect(wrapper.html()).toContain("CircularProgress")
    });


})
