import React from 'react'
import ReportingPeriodForm from '../../../app/javascript/components/configure/ReportingPeriodForm'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<ReportingPeriodForm />', () => {
    let render, shallow;
    const dispatch = () => {}
    const state = {
        sections: [
            {id: 1, name: "Math 9", courses: [{ title: 'Math 9'}]},
            {id: 2, name: "Foundations of Mathematics and Precalculus 10", courses: [{ title: 'Calculus'}]},
            ],
        selected_section: {
            id: 1, contents: [{id: 191}, {id: 202}]
        }

    }

    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: {}}} >
                <ReportingPeriodForm />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the sections data ', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: state}} >
                <ReportingPeriodForm />
            </ConfigurationContext.Provider>);
        const content = wrapper.text()
        expect(content).toContain("Reporting Period")
        expect(content).toContain("Select Section")
        expect(content).toContain('From')
        expect(content).toContain('Until')
    })

    it('should show the selected period name and dates ', () => {

        state.selected_period = {
            id: 14,
            name : "Beep Beep",
            contents: [{id: 1}, {id: 2}],
            section_id: 1,
            period_start: '2020-12-21T12:12:12Z',
            period_end: '2021-02-21T12:12:12Z',
        }
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: state}} >
                <ReportingPeriodForm />
            </ConfigurationContext.Provider>);
        const content = wrapper.text()
        const html = wrapper.html()
        expect(content).toContain("Edit Beep Beep")
        expect(content).toContain("Select Section")
        expect(content).toContain('From')
        expect(content).toContain('Until')
        expect(content).toContain('Save')
        expect(content).toContain('Cancel')
        expect(html).toContain('value="December 21, 2020"')
        expect(html).toContain('value="February 21, 2021"')
    })

})