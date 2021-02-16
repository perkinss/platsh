import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { createMuiTheme } from "@material-ui/core/styles";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

const lightPickerTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#ab47bc',
        },
        type: 'dark'
    },
});

export default function DateRangeSection(props) {

    const {fromDate, toDate, setFromDate, setToDate, callback } = props

    const handleFromDateChange = (date) => {
        setFromDate(date)
        callback()
    }
    const handleToDateChange = (date) => {
        setToDate(date)
        callback()
    }

    return (
        <Grid container spacing={2} justify={"flex-start"}>
            <Grid item xs={6} sm={6} xl={6}>
                <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                    <ThemeProvider theme={lightPickerTheme}>
                        <DatePicker
                            variant={'dialog'}
                            format={'MMMM dd, yyyy'}
                            margin={'normal'}
                            fullWidth={true}
                            autoOk={true}
                            clearable={true}
                            style={{marginTop: '0'}}
                            label={"From:"}
                            value={fromDate || null}
                            onChange={handleFromDateChange}
                        />
                    </ThemeProvider>
                </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6} sm={6} xl={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <ThemeProvider theme={lightPickerTheme}>
                        <DatePicker
                            variant={'dialog'}
                            format={'MMMM dd, yyyy'}
                            margin={'normal'}
                            fullWidth={true}
                            autoOk={true}
                            clearable={true}
                            style={{marginTop: '0'}}
                            label={"Until:"}
                            value={toDate || null}
                            onChange={handleToDateChange}
                        />
                    </ThemeProvider>
                </MuiPickersUtilsProvider>
            </Grid>
        </Grid>
            )
}