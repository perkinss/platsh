import React, { useContext, useState } from 'react'
import {
    Typography,
    TableCell,
    Paper,
    Grid,
    FormControl,
    InputLabel, Select, Input, MenuItem
} from '@material-ui/core'
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles/index";
import { ConfigurationContext } from "../../context/ConfigurationContext";
import MarkingSchemaForm from "./MarkingSchemaForm";
import TopicWeightingForm from "./TopicWeightingForm";
import CompetencyWeightingForm from "./CompetencyWeightingForm";
import CourseWeightingForm from "./CourseWeightingForm";

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

export default function ConfigureSchemas(props) {
    let { classes, setShowSnackbar } = props;
    classes = {...classes, ...useStyles()}
    const theme = useTheme()
    const {dispatch, state} = useContext(ConfigurationContext)

    const handleCourseSelect = (event, value) => {
        // setFormHasUnsavedChanges(false)
        dispatch({type: "SET_SELECTED_COURSE_ID", course_id: event.target.value})
    }

    let courses = []
    state.sections.forEach(section => {
        section.courses.forEach(course => {
            courses[course.id] = course.title
        })
    })

    return <div className={classes.content}>

        <Paper className={classes.paper}>
            <Grid container spacing={theme.spacing(1)} alignContent={'space-between'} alignItems={'flex-start'}>
                <Grid item xs={12} xl={12}>
                    <MarkingSchemaForm setShowSnackbar={setShowSnackbar}/>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Typography className={classes.content}>Select a course and then enter an integer weighting for the course, topics or competency groups.</Typography>
                    <FormControl className={''} fullWidth={true}>
                        <InputLabel htmlFor="select-section">Course</InputLabel>
                        <Select
                            value={state.selected_course_id || ''}
                            onChange={handleCourseSelect}
                            input={<Input id="select-section" />}
                        >
                            {Object.keys(courses).map(course_id => (
                                <MenuItem key={course_id} value={course_id}>
                                    {courses[course_id]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} xl={12}>
                    <CourseWeightingForm setShowSnackbar={setShowSnackbar} classes={classes}/>
                </Grid>
                <Grid item xs={12} xl={12}>
                    <TopicWeightingForm setShowSnackbar={setShowSnackbar} classes={classes}/>
                </Grid>
                <Grid item xs={12} xl={12}>
                    <CompetencyWeightingForm setShowSnackbar={setShowSnackbar} classes={classes}/>
                </Grid>
            </Grid>
        </Paper>
    </div>

}