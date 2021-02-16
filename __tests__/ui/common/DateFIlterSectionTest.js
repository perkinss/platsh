import DateRangeSection from "../../../app/javascript/components/common/DateRangeSection";
import expect from "expect";
import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import {createRender, createShallow} from "@material-ui/core/test-utils";

Enzyme.configure({ adapter: new Adapter() });

describe('<DateFilterSection />', () => {
    let shallow, render

    beforeAll(() => {
        shallow = createShallow();
        render = createRender()
    })

    it('should match the snapshot', () => {
        const wrapper = shallow(
             <DateRangeSection />
        )
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });
})