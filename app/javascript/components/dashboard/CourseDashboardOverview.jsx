import React, { useContext, useEffect } from 'react'
import { CircularProgress, Paper } from '@material-ui/core'
import CourseDashboard from './CourseDashboard'
import {ConfigurationContext} from "../../context/ConfigurationContext";
import {withStyles} from "@material-ui/core/styles/index";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
    section: {
        padding: theme.spacing(.5),
        margin: theme.spacing(3, 0, 5, 0)
    }
})


function CourseDashboardOverview(props) {
    const { classes } = props
    const { state } = useContext(ConfigurationContext)

    const courses = state.courses

    return (
        <div className={classes.content}>
            {!courses && <Paper className={classes.paper}> <CircularProgress className={classes.progress} color={'secondary'} /></Paper>}

        {courses && Object.keys(courses).length > 0 &&
            <React.Fragment>

                {Array.from(Object.keys(courses)).map(courseId => {
                    return (
                        <CourseDashboard courseId={courseId} course={courses[courseId]} classes={classes} key={`course-${courses[courseId].title}`}/>
                    )
                })}
            </React.Fragment>

        }
        </div>

    )
}
export default withStyles(styles)(CourseDashboardOverview);
