import React from 'react'
import AssessmentList from '../../../app/javascript/components/configure/AssessmentList'
import { createShallow } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<AssessmentList />', () => {
    let render;

    beforeAll(() => {
        render = createShallow();
    })

    it('should match the snapshot', () => {
        const wrapper = render(<AssessmentList />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

  // Test with a data fetch somehow

})
