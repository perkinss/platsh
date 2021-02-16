import React from 'react'
import {Typography, Table, TableCell, TableRow, TableFooter, TablePagination, TableSortLabel, TableBody, TableHead,
    Icon, Chip, Avatar, LinearProgress, Grow, Tooltip, Zoom} from '@material-ui/core'
import Star from '@material-ui/icons/StarBorderRounded'
import { makeStyles } from "@material-ui/styles/index";

const useStyles = makeStyles(theme => ({
    progressBar: {
        minHeight: '28px',
        backgroundColor: theme.palette.grey[800],
        opacity: 1,
    },
}))

const standardBarStyle = makeStyles(theme => ({
    bar: {
        backgroundColor: 'rgba(0, 227, 150, 0.85)',
        borderRadius: '2px'
    }
}))

const topBarStyle = makeStyles(theme => ({
    bar: {
        backgroundColor: theme.palette.primary.light,
        borderRadius: '2px'
    }
}))

const tooltipStyles = makeStyles(theme => ({
    tooltip: {
        fontSize: '18px',
        marginLeft: '-120px',
        width: '70px',
        textAlign: 'center'
    }
}))


export default function CompetenciesDashboard(props) {
    const { show, details, theRef } = props
    const progressClasses = useStyles();
    const topBarClasses = topBarStyle();
    const tooltipClasses = tooltipStyles();
    const standardBarClasses = standardBarStyle()

    if (!show || !details.details) {
        return null
    }
    const classModeAverage = details.details.reduce((sum, detail) => {
        return sum + detail.mode
    }, 0)/details.details.length

    const calculateModePercent = (value) => {
         return (value / 4.0 * 100)
    }

    const classPercentage = calculateModePercent(classModeAverage)

    return (
        <React.Fragment>
            <Typography paragraph variant={'h6'} ref={theRef}>{details.name||details.title}</Typography>
            <div >
            <Table size={'small'} autoFocus>
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={2}>Name</TableCell>
                        <TableCell rowSpan={2}>
                            Number of tasks
                        </TableCell>
                        <TableCell width={'50%'}>
                            Class Averages
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Tooltip classes={tooltipClasses} title={classModeAverage.toFixed(2)} placement="right-start" TransitionComponent={Zoom}>
                                <LinearProgress
                                    classes={topBarClasses}
                                    className={progressClasses.progressBar}
                                    variant='determinate' value={classPercentage}>
                                </LinearProgress>
                            </Tooltip>

                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {details.details.map((detail) => {
                        return (
                            <TableRow key={`row-${detail.description}`}>
                                <TableCell  >
                                    {detail.description}
                                </TableCell>
                                <TableCell  >
                                    {detail.count}
                                </TableCell>
                                <TableCell width={'70%'}>
                                    {detail && detail.mode && <Grow
                                        in={show}
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={1000}
                                    >
                                        <Tooltip classes={tooltipClasses} title={detail.mode}
                                                 placement="right-start" TransitionComponent={Zoom}>
                                            <LinearProgress
                                                color={'primary'}
                                                classes={standardBarClasses}
                                                className={progressClasses.progressBar}
                                                variant='determinate'
                                                value={calculateModePercent(detail.mode)}/>
                                        </Tooltip>
                                    </Grow>}
                                </TableCell>
                            </TableRow>
                        )
                    })}

                </TableBody>
            </Table>
            </div>
        </React.Fragment>
    )

}