import React from 'react'
import ScoreSlider from '../../../app/javascript/components/observe/ScoreSlider'
import { createRender } from '@material-ui/core/test-utils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import expect from 'expect'
import theme from "../../../app/javascript/styles/theme"
import {ThemeProvider } from '@material-ui/styles'
import {ConfigurationContext} from "../../../app/javascript/context/ConfigurationContext";

Enzyme.configure({ adapter: new Adapter() });

describe('<ScoreSlider />', () => {
    let render;

    beforeAll(() => {
        render = createRender();
    })

    it('should match the snapshot', () => {
        const wrapper = render(<ScoreSlider initialValue={0} />);
        expect(wrapper).not.toBeNull()
        expect(wrapper).toMatchSnapshot()
    });

    it('should render the given value', () => {
        const wrapper = render(
            <ThemeProvider theme={theme}>
                <ConfigurationContext.Provider value={{dispatch: () => {}, state: {} }} >
                    <ScoreSlider classes={{}} id={99} index={0} initialValue={3} handleScoreChange={()=>{}} handleBlur={()=>{}}  />
                </ConfigurationContext.Provider>
            </ThemeProvider>);
        let doc = wrapper.html()
        expect(doc).toContain('<input type="hidden" value="3">')
    })

})