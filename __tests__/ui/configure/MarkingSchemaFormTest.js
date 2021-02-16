import React from 'react'
import StudentForm from '../../../app/javascript/components/configure/StudentForm'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import MarkingSchemaForm from "../../../app/javascript/components/configure/MarkingSchemaForm";

Enzyme.configure({ adapter: new Adapter() });

describe('<MarkingSchemaForm />', () => {
    let render;
    let classes = {}
    let state = {
        students: []
    }

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <MarkingSchemaForm />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})