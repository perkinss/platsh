import React from 'react'
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import NewTaskForm from '../../../app/javascript/components/configure/NewTaskForm'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<AddTasksForm />', () => {
    let shallow, render, container;
    let classes = {}
    let state = {

        available_grouped_competencies: [
            {
                    groups: [
                        {
                            competencies: [
                                {id: 22, description: "Develop, demonstrate, and apply conceptual understand through play, story, inquiry, and problem solving"},
                                {id: 23, description: "Visualize to explore and illustrate mathematical concepts  and relationships"}
                            ]
                        },
                    ]
            }]
    }

    beforeEach(() => {
        shallow = createShallow();
        render = createRender();
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <NewTaskForm classes={classes} />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });
    
    it('should render the form when the showForm is true', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <NewTaskForm
                        classes={classes}
                        assessmentCompetencies={[]}
                        sectionID={1}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        let doc = wrapper.html()
        expect(doc).toContain('Name')
        expect(doc).toContain('Add / Remove Competencies')
    })



})