import {MemoryRouter} from "react-router-dom";
import AuthenticationWrapper from "../../../app/javascript/context/AuthenticationWrapper";
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";
import SectionSelect from "../../../app/javascript/components/common/SectionSelect";
import expect from "expect";
import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Report from "../../../app/javascript/components/report/Report";
import {createRender, createShallow} from "@material-ui/core/test-utils";
import {ReportsContext} from "../../../app/javascript/context/ReportsContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<SectionSelect />', () => {
    let shallow, render
    const emptyState = {
        sections: []
    }
    const state = {
        sections: [
            {id: 1, name: "Math 9", courses: [{ title: 'Math 9'}]},
            {id: 2, name: "Foundations of Mathematics and Precalculus 10", courses: [{ title: 'Calculus'}]},
        ],
    }
    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
            <MemoryRouter>
                <AuthenticationWrapper>
                    <ReportsContext.Provider value={{
                        dispatch: () => {
                        }, state: emptyState
                    }}>
                        <SectionSelect loading={false}/>
                    </ReportsContext.Provider>
                </AuthenticationWrapper>
            </MemoryRouter>
        )
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should show progress when loading', () => {

        const wrapper = render(
            <MemoryRouter>
                <AuthenticationWrapper>
                    <ReportsContext.Provider value={{
                        dispatch: () => {
                        }, state: emptyState
                    }}>
                        <SectionSelect loading={true}/>
                    </ReportsContext.Provider>
                </AuthenticationWrapper>
            </MemoryRouter>);

        let html = wrapper.html()
        expect(html).toContain('CircularProgress')
    })

    it('should show a message when done loading and there are no sections', () => {
        const wrapper = render(
            <MemoryRouter>
                <AuthenticationWrapper>
                    <ReportsContext.Provider value={{
                        dispatch: () => {
                        }, state: emptyState
                    }}>
                        <SectionSelect loading={false}/>
                    </ReportsContext.Provider>
                </AuthenticationWrapper>
            </MemoryRouter>);

        let html = wrapper.html()
        expect(html).toContain('Section Configuration and Data not found!')
    })

    it('should have the default value for the loaded section', () => {
        const wrapper = render(
            <MemoryRouter>
                <AuthenticationWrapper>
                    <ReportsContext.Provider value={{
                        dispatch: () => {
                        }, state: state
                    }}>
                        <SectionSelect loading={false} sectionName={"Math 9"} />
                    </ReportsContext.Provider>
                </AuthenticationWrapper>
            </MemoryRouter>);

        let html = wrapper.html()
        expect(html).toContain('Math 9')
    })
})