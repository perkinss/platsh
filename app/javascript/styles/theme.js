import {createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#512da8',
        },
        secondary: {
            main: '#ab47bc',
        },
        type: 'dark'
    },
    slider: {
        selectionColor: '#F76B1C',
        handleFillColor: '#F76B1C',
        thumb: 'secondary'
    }

})

export default theme
