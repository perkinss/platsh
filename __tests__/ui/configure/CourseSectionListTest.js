import React from 'react'
import CourseSectionList from '../../../app/javascript/components/configure/CourseSectionList'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import { ConfigurationContext } from '../../../app/javascript/context/ConfigurationContext'

Enzyme.configure({ adapter: new Adapter() });

describe('<CourseSectionList />', () => {
    let render;
    let configuration = {
        sections: []
    }
    let dispatch = () =>{}

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: configuration}} >
                <CourseSectionList />
            </ConfigurationContext.Provider>);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

  // Test with a data fetch somehow

})
