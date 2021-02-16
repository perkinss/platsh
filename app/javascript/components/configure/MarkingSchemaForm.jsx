import React, { useContext, useState } from 'react'
import {
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Grid,
    FormControl,
    InputLabel, Select, Input, MenuItem
} from '@material-ui/core'
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles/index";
import { ConfigurationContext } from "../../context/ConfigurationContext";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    content: {
        padding: theme.spacing(1,2),
        align: 'center'
    }
}));

const useTableStyles = makeStyles(theme => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.primary.light
        }
    }

}))

const StyledTableCell = withStyles(theme => ({
    head: {
        fontSize: 18,
        fontStyle: 'bolder'
    },
    body: {
        fontSize: 18,
        fontStyle: 'bold'
    },
}))(TableCell);

const HighTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },

}))(StyledTableCell);

const MediumTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.common.white,
    },

}))(StyledTableCell);

const LowTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.grey[700],
        color: theme.palette.common.white,
    },

}))(StyledTableCell);

/**
 *

 Level M, H, L

 Base for level eg 1, 2 --> Grade
 Bar for level eg > 1, > 2 --> Grade

 L-Base = 1
 L-Base Grade = 50%
 L-Bar = > 1
 L-Bar Grade = 60%


 */

export default function MarkingSchemaForm(props) {
    let { classes } = props;
    classes = {...classes, ...useStyles()}
    const theme = useTheme()
    const {dispatch, state} = useContext(ConfigurationContext)

    const tableClasses = useTableStyles()
    const highColumnStyle = {
        backgroundColor: theme.palette.primary.light
    }
    const medColumnStyle = {
        backgroundColor: theme.palette.secondary.light
    }

    const lowColumnStyle = {
        backgroundColor: theme.palette.grey[600]
    }

    return(
        <React.Fragment>
            <Typography variant={'h5'}>Standard Marking Schema</Typography>
            <Typography className={classes.content}>Assign the number of successful
                observations required to achieve the corresponding grade.</Typography>
            <Table classes={tableClasses}>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2} >Difficulty</TableCell>
                        <HighTableCell align='center' colSpan={2} >High</HighTableCell>
                        <MediumTableCell align='center' colSpan={2}>Medium</MediumTableCell>
                        <LowTableCell align='center' colSpan={2}>Low</LowTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={2}>Number of Observations</TableCell>
                        <HighTableCell style={highColumnStyle} align='center' >{'> 1'}</HighTableCell>
                        <HighTableCell style={highColumnStyle} align='center' >1</HighTableCell>
                        <MediumTableCell style={medColumnStyle} align='center' >{'> 1'}</MediumTableCell>
                        <MediumTableCell style={medColumnStyle} align='center' >1</MediumTableCell>
                        <LowTableCell style={lowColumnStyle} align='center' >{'> 1'}</LowTableCell>
                        <LowTableCell style={lowColumnStyle} align='center' >1</LowTableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>Grade</TableCell>
                        <HighTableCell style={highColumnStyle}  align='center' >100%</HighTableCell>
                        <HighTableCell style={highColumnStyle} align='center' >90%</HighTableCell>
                        <MediumTableCell style={medColumnStyle} align='center' >80%</MediumTableCell>
                        <MediumTableCell style={medColumnStyle} align='center' >70%</MediumTableCell>
                        <LowTableCell style={lowColumnStyle} align='center' >60%</LowTableCell>
                        <LowTableCell style={lowColumnStyle} align='center' >50%</LowTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </React.Fragment>)

}