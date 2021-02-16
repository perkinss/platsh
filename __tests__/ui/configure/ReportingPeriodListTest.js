import React from 'react'
import ReportingPeriodList from '../../../app/javascript/components/configure/ReportingPeriodList'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from '../../../app/javascript/context/ConfigurationContext'

Enzyme.configure({ adapter: new Adapter() });

describe('<ReportingPeriodList />', () => {
    let shallow, render;
    let configuration = {
        reporting_periods: [
            {
                id: 1,
                name: 'First Report',
                section: {
                    id: 21,
                    name: 'Course 1'
                },
                contents: [
                    {
                        id: 32,
                        name: 'Foo'
                    },
                    {
                        id: 33,
                        name: 'Bar'
                    },
                    {
                        id: 34,
                        name: 'Baz'
                    },
                    ]
            }
        ]
    }
    let dispatch = () =>{}

    beforeAll(() => {
        shallow = createShallow();
        render = createRender();
    })

    it('should match the snapshot when list is empty', () => {
        const wrapper = shallow(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: {reporting_periods: []}}} >
                <ReportingPeriodList />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should match the snapshot when there are reporting periods', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration }} >
                <ReportingPeriodList />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.text()).toMatch(configuration.reporting_periods[0].name)
    });
})
