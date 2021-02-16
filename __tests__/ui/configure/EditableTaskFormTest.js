import React from 'react'
import { createShallow, createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme";
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import EditableTaskForm from "../../../app/javascript/components/configure/EditableTaskForm";

Enzyme.configure({ adapter: new Adapter() });

describe('<EditableTaskForm />', () => {
    let shallow, render, container;
    let classes = {}
    let state = {
        available_content_standards: [{
            title: "Math 9",
            contents: [
                {   id: 1, name: "Know something", standards: [{ id: 3, description: "Add and subtract"}]}
            ]
        }],
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

    let tasks = [{name: 'atask', competencies: [23,22], standards: {3: "M"}}]

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
                    <EditableTaskForm classes={classes} />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    // todo: it would be nice to have where we can show that the form clears the assessemnt competency from the task
    it('should render the readonly form when the showForm is true', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <EditableTaskForm
                        classes={classes}
                        assessmentCompetencyId={'22'}
                        sectionID={1}
                        possiblyNewTask={tasks[0]}
                        editMode={false}
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        let doc = wrapper.html()
        expect(doc).toContain('atask')
        expect(doc).toContain('Edit')
        expect(doc).toContain('Delete')
        expect(doc).not.toContain('Done')
        expect(doc).not.toContain('Cancel')
        expect(doc).toContain('Visualize to explore and illustrate')
    })

    it('should render the form with a task and its standards when there is a task', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <EditableTaskForm
                        classes={classes}
                        assessmentCompetencyId={''}
                        sectionID={1}
                        possiblyNewTask={tasks[0]}
                        editMode={false} />
                        }
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        let doc = wrapper.html()
        expect(doc).toContain(tasks[0].name)
        expect(doc).toContain('>Standards:')
        expect(wrapper.text()).toContain('Add and subtract')
    })

    it('should be in edit mode when edit is true', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: state }} >
                    <EditableTaskForm
                        classes={classes}
                        assessmentCompetencyId={22}
                        sectionID={1}
                        possiblyNewTask={tasks[0]}
                        editMode={true} />
                    }
                    />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        let doc = wrapper.html()
        expect(doc).toContain(tasks[0].name)
        expect(doc).not.toContain('>Standards:')
        expect(wrapper.text()).toContain('Add and subtract')
        expect(wrapper.text()).toContain('Click to set the level of difficulty (Low, Medium or High):')
        expect(doc).toContain('Add / Remove Standards')
        expect(doc).toContain('Add / Remove Competencies')
        expect(doc).toContain('Done')
        expect(doc).toContain('Cancel')

    })


})