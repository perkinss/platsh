import React, { useContext, useState, useEffect } from 'react'
import {
    Typography, Paper, Grid, Slider, InputLabel, Select, Input, MenuItem, Grow, TextField,
    Table, TableHead, TableRow, TableCell, TableBody, Button, withStyles
} from '@material-ui/core'
import {useTheme, makeStyles, fade} from "@material-ui/core/styles";
import { ConfigurationContext } from "../../context/ConfigurationContext";
import ReactApexChart from "react-apexcharts";

const useStyles = makeStyles(theme => ({
    weights: {
        padding: theme.spacing(2,0)
    }
}));

const StyledSlider = withStyles(theme => ({
    thumb: {
        height: theme.spacing(4),
        width: theme.spacing(4),
        backgroundColor: theme.palette.primary,
        border: '10px solid',
        borderColor: theme.palette.secondary.main,
        boxShadow: `0px 0px 0px ${19}px ${fade(theme.palette.secondary.dark, 0.16)}`,
    },
    track: {
        backgroundColor: theme.palette.secondary.dark,
        height: theme.spacing(2),
    },
    rail: {
        height: theme.spacing(2),
        borderRadius: 0,
        backgroundColor: theme.palette.primary.dark,
    },


}))(Slider);


export default function CourseWeightingForm(props) {
    let { classes, setShowSnackbar } = props;
    classes = { ...classes, ...useStyles() }
    const theme = useTheme()
    const {dispatch, state} = useContext(ConfigurationContext)

    const [weightings, setWeightings] = useState([])
    const [currentContentsWeighting, setCurrentContentsWeighting] = useState(10)
    const [currentCompetencyWeighting, setCurrentCompetencyWeighting] = useState(90)
    const [formHasUnsavedChanges, setFormHasUnsavedChanges] = useState(false)

    useEffect(() => {
        fetch('/api/course_weighting')
            .then(res => res.json())
            .then(
                (result) => {
                    setWeightings(result)
                },
                (error) => {
                    //TODO:Error snackbar
                    console.log("Error:", error)
                }
            )
    }, [])

    useEffect(() => {
        if (weightings && state.selected_course_id) {
            let course = weightings.course_weights.find((weighting) => {
                return weighting.id === Number(state.selected_course_id)
            })
            setCurrentContentsWeighting(course.contents_weight)
            setCurrentCompetencyWeighting(100 - course.contents_weight)
        }
    }, [weightings, state.selected_course_id])

    const handleSaveWeights = () => {
        const courseWeight = { course: state.selected_course_id, contents_weight: currentContentsWeighting }
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify(courseWeight)
        fetch(`api/course/${state.selected_course_id}/course_weighting/save`,
            {
                method: 'POST',
                body: body,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            })
            .then(res => res.json())
            .then(response => {
                setShowSnackbar({open:true,variant:"success",message:"Successfully Saved!"})
                updateWeightings(response)
            })
            .catch(error => console.log("ERROR: ", error))

        setFormHasUnsavedChanges(false)
    }

    /**
     * Once we have received a successful response, update the local state to reflect the new ratio
     * @param data - the successfully saved course data.
     */
    const updateWeightings = (data) => {
        let w = weightings
        let course_to_update = w.course_weights.find( course => course.id === data.id)
        let course_weights = w.course_weights.filter( course => course.id !== data.id)
        course_to_update.contents_weight = data.contents_weight
        course_weights.push(course_to_update)
        w.course_weights = course_weights
        setWeightings(w)
    }

    const saveIsDisabled = () => {
        return !formHasUnsavedChanges
    }

    const handleSliderChange = (event, value ) => {
        setCurrentContentsWeighting(value)
        setCurrentCompetencyWeighting(100 - value)
        setFormHasUnsavedChanges(true)
    }

    return(
        <React.Fragment>
            <Grid container spacing={theme.spacing(1)} alignContent={'space-between'} alignItems={'flex-start'}>
                <Grid item xs={12} lg={12}>
                    { state.selected_course_id && <Grow
                        in={!!weightings}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                    <Paper elevation={4}  className={classes.paper}>

                       <Grid container spacing={theme.spacing(0)} >
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography variant={'h5'}>Course Content vs Competency Weighting</Typography>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12}>
                                <br/>
                                <StyledSlider
                                    id={'course-weight-slider'}
                                    value={currentContentsWeighting}
                                    min={0}
                                    max={100}
                                    step={1}
                                    aria-labelledby="configuration-slider"
                                    onChange={handleSliderChange}
                                />
                            </Grid>
                           <Grid item xs={6} sm={6} md={6}>
                               <br/>
                               <Typography variant={'h5'}>Content:</Typography>
                               <Typography variant={'h2'}>{currentContentsWeighting} %</Typography>
                           </Grid>
                           <Grid item xs={6} sm={6} md={6}>
                               <br/>
                               <Typography variant={'h5'}>Competencies:</Typography>
                               <Typography variant={'h2'}>{currentCompetencyWeighting} %</Typography>
                           </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Button color={'secondary'} onClick={handleSaveWeights} disabled={saveIsDisabled()}>Save</Button>
                            </Grid>

                        </Grid>

                    </Paper>
                    </Grow>
                        }
                </Grid>
            </Grid>

        </React.Fragment>
        )

}
