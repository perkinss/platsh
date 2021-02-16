import React from 'react'
import CommentWidget from '../../../app/javascript/components/observe/CommentWidget'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'

Enzyme.configure({ adapter: new Adapter() });

describe('<CommentWidget />', () => {
    let render;

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(<CommentWidget id={1} />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

})