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
        width: '60px'
    }
}))


export default function StandardsDashboard(props) {
    const { show, details, classes, theRef } = props
    const progressClasses = useStyles();
    const topBarClasses = topBarStyle();
    const tooltipClasses = tooltipStyles();
    const standardBarClasses = standardBarStyle()

    // TODO: remove the 'details.details' check when we create a competencies dashboard
    if (!show || !details.details) {
        return null
    }
    const classAverage = details.details.reduce((sum, detail) => {
        // TODO: format this calculation
        return sum + detail.average
    }, 0)/details.details.length

    return (
        <React.Fragment>
            <Typography paragraph variant={'h6'} ref={theRef}>{details.name||details.title}</Typography>
            <div >
            <Table size={'small'} autoFocus>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell colSpan={3}>
                            Number of tasks in level
                        </TableCell>
                        <TableCell width={'50%'}>
                            Class Average
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell/>
                        <TableCell padding={'none'} align={'center'}>
                            <Chip
                            avatar={
                                <Avatar>
                                    <Star/>
                                </Avatar>
                            }
                            label={
                                <React.Fragment>
                                    <Typography variant={'h6'}>L</Typography>
                                </React.Fragment>
                            }
                        />
                        </TableCell>
                        <TableCell padding={'none'} align={'center'}>
                        <Chip
                            avatar={
                                <Avatar>
                                    <Star/>
                                </Avatar>
                            }
                            label={
                                <React.Fragment>
                                    <Typography variant={'h6'}>M</Typography>
                                </React.Fragment>
                            }
                            color={'secondary'}
                            style={{marginLeft: '3px'}}
                        />
                        </TableCell>
                        <TableCell  padding={'none'} align={'center'}>
                        <Chip
                            avatar={
                                <Avatar>
                                    <Star/>
                                </Avatar>
                            }
                            label={
                                <React.Fragment>
                                    <Typography variant={'h6'}>H</Typography>
                                </React.Fragment>
                            }
                            color={'primary'}
                            style={{marginLeft: '3px'}}
                        />
                        </TableCell>
                        <TableCell>
                            <Tooltip classes={tooltipClasses} title={classAverage.toFixed(0) + '%'} placement="right-start" TransitionComponent={Zoom}>
                            <LinearProgress
                                classes={topBarClasses}
                                className={progressClasses.progressBar}
                                variant='determinate' value={classAverage}>
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
                                <TableCell  padding={'none'} align={'center'}>
                                    <Chip
                                        label={<Typography >{detail.l_count}</Typography>}
                                        className={classes.chip}
                                    />
                                </TableCell>
                                <TableCell padding={'none'} align={'center'} >
                                    <Chip
                                        label={<Typography> {detail.m_count}</Typography>}
                                        className={classes.chip}
                                        color={'secondary'}
                                    />

                                </TableCell>
                                <TableCell  padding={'none'} align={'center'}>
                                    <Chip
                                        label={<Typography> {detail.h_count}</Typography>}
                                        className={classes.chip}
                                        color={'primary'}
                                    />
                                </TableCell>
                                <TableCell with={'50%'}>
                                    <Grow
                                        in={show}
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={1000}
                                    >
                                        <Tooltip classes={tooltipClasses} title={detail.average.toFixed(0) + '%'} placement="right-start" TransitionComponent={Zoom}>
                                            <LinearProgress
                                                color={'primary'}
                                                classes={standardBarClasses}
                                                className={progressClasses.progressBar}
                                                variant='determinate'
                                                value={detail.average}/>
                                        </Tooltip>
                                    </Grow>
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