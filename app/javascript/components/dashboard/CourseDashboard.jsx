import React, { useContext, useState, useEffect } from 'react'
import { Grid, Typography, Paper, Collapse, IconButton } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded'
import SectionDashboard from './SectionDashboard'
import {ConfigurationContext} from "../../context/ConfigurationContext";
import {withStyles} from "@material-ui/core/styles/index";
import clsx from "clsx";
import {makeStyles} from "@material-ui/styles/index";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(3),
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
        padding: theme.spacing(0),
        margin: theme.spacing(3,0,5,0)
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    item: {
        padding: theme.spacing(0),
        margin: theme.spacing(0)
    }
})

function CourseDashboard(props) {
    const { course, courseId, classes } = props
    const [expanded, setExpanded] = useState(false)
    const[loading, setLoading] = useState(false)
    const { state, dispatch } = useContext(ConfigurationContext)
    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    useEffect(() => {
        setLoading(true)
        course.sections.forEach(section => {
            setLoading(false)
            fetch(`/api/dashboard/${courseId}/section/${section.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoading(false)
                        dispatch({type: 'ADD_SECTION_TO_DASHBOARD', dashboard: result, courseId: courseId })
                    },
                    (error) => {
                        setLoading(false)
                        console.log("Error:", error)
                    }
                )
        })

    },[]);

    return (
        <Paper className={classes.paper} key={`course-${course.title}`}>
            <Typography variant={'h4'} align={'left'}>{course.title}
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </Typography>
            <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                <Grid container spacing={5}>
                    { loading || !state.dashboard || Object.keys(state.dashboard).length === 0 ? <CircularProgress /> :
                    <Grid item xs={12} xl={12}>
                        {Object.values(course.sections).map(section => {
                            return <SectionDashboard
                                section={section}
                                classes={classes}
                                key={`section-${section.id}`}
                                courseId={courseId}
                                loading={loading}
                            />
                        })}
                    </Grid>}
                </Grid>
            </Collapse>
        </Paper>
    )
}
export default withStyles(styles)(CourseDashboard)