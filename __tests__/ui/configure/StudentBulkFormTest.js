import React from 'react'
import StudentForm from '../../../app/javascript/components/configure/StudentForm'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import StudentBulkForm from "../../../app/javascript/components/configure/StudentBulkForm";

Enzyme.configure({ adapter: new Adapter() });

describe('<StudentBulkForm />', () => {
    let render;
    let classes = {}
    let state = {
        students: []
    }
    let schools = [{id: 1, name: 'aha'}, {id: 1, name: '2kool4'}]

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentBulkForm classes={classes} schools={[]}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have schools', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <StudentBulkForm classes={classes} schools={schools}/>
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper.text()).toContain('Bulk Import')
        expect(wrapper.text()).toContain('CSV')
        expect(wrapper.text()).toContain('Details')
    });

})