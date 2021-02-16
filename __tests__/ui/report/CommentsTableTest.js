import React, { useState } from 'react'
import { createRender, createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ReportsContext } from "../../../app/javascript/context/ReportsContext";
import theme from "../../../app/javascript/styles/theme";
import { ThemeProvider } from '@material-ui/styles'
import CommentsTable from "../../../app/javascript/components/report/CommentsTable";

Enzyme.configure({ adapter: new Adapter() });

describe('<CommentsTable />', () => {
    let render;
    let classes = {
        content: {}
    }
    let section = { id: 21, name: "section 1"
    }
    let state = {
        comments: [
            {
                assessment: "Ch 6 Test",
                task: "2",
                created_at: "2020-04-11T01:14:48.406Z",
                comment: "Such a smart alec, that Abby.  I would really like to see her try harder"
            }
        ]
    }
    let student = {
        id: 5, name: "Ed Shearan", unique_id: "edshe@ran.com", created_at: "2019-07-07T05:07:00.505Z", updated_at: "2019-07-07T05:07:00.505Z"
    }
    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{dispatch: () => {}, state: {} }} >
                    <CommentsTable classes={classes} student={student} section={section} />
                </ReportsContext.Provider>
            </ThemeProvider>
                );
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should have the right title', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ReportsContext.Provider value={{dispatch: () => {}, state: state }} >
                    <CommentsTable classes={classes} student={student} section={section} />
                </ReportsContext.Provider>
            </ThemeProvider>
        );
        expect(wrapper.text()).toContain("Comments");
        expect(wrapper.text()).toContain("Note: Comments can only be viewed by you, not by your students.");
    });
})