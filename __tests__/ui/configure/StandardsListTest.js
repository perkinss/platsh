import React from 'react'
import StandardsList from '../../../app/javascript/components/configure/StandardsList'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<StandardsList />', () => {
    let render;
    const dispatch = () => {}
    const configuration = { standards:{0: {id: 22, name: "operations", standards:
                    [{id: 1, description: "compare and order rational numbers"},
                    {id: 2, description: "estimate the square root of rational number"}]}}}

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <StandardsList />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})