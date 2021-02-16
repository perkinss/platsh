import React, { useContext, useState, useEffect } from 'react'
import {
    Typography, Paper, Grid, FormControl, InputLabel, Select, Input, MenuItem, Grow, TextField,
    Table, TableHead, TableRow, TableCell, TableBody, Button
} from '@material-ui/core'
import { useTheme,makeStyles } from "@material-ui/core/styles";
import { ConfigurationContext } from "../../context/ConfigurationContext";
import ReactApexChart from 'react-apexcharts'

const useStyles = makeStyles(theme => ({
    weights: {
        padding: theme.spacing(2,0)
    }
}));

export default function TopicWeightingForm(props) {
    let { classes, setShowSnackbar } = props;
    classes = { ...classes, ...useStyles() }
    const theme = useTheme()
    const {dispatch, state} = useContext(ConfigurationContext)

    const [weightings, setWeightings] = useState([])
    const [currentCourseWeighting, setCurrentCourseWeighting] = useState([])
    const [values, setValues] = useState([])

    const [labels, setLabels] = useState([])
    const [formHasUnsavedChanges, setFormHasUnsavedChanges] = useState(false)

    const courses = {}
    state.sections.forEach(section => {
        section.courses.forEach(course => {
            courses[course.id] = course.title
        })
    })

    useEffect(() => {
        fetch('/api/content_weighting/get_for_user_courses')
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
            let course = weightings.find((weighting) => {
                return weighting.id === Number(state.selected_course_id)
            })
            let weights = [], names = []
            course.content_weights.forEach(content => {
                weights.push(content.weight)
                names.push(content.name)
            })
            setValues(weights)
            setLabels(names)
            setCurrentCourseWeighting(course.content_weights)
        }
    }, [weightings, state.selected_course_id])

    const handleChangeWeight = (event, w) => {
        w.weight = event.target.value.replace(/\D/g, '')
        if (event.target.value.length > 0 ) {
            w.weight = Number(w.weight)
        }
        let copy = Array.from(currentCourseWeighting)
        let index = copy.findIndex(a => a.id === w.id )
        copy[index] = w
        setCurrentCourseWeighting(copy)
        setFormHasUnsavedChanges(true)
    }

    const handleBlurWeight = (event, w) => {
        let wt = Array.from(currentCourseWeighting)
        let idx = wt.findIndex(a => a.id === w.id )
        if (event.target.value.length < 1) {
            w.weight = 1
            wt[idx] = w
            setCurrentCourseWeighting(wt)
        }
        let weights = Array.from(values)
        weights[idx] = Number(event.target.value)
        setValues(weights)
    }

    const handleSaveWeights = () => {
        const courseWeight = { course: state.selected_course_id, weights: currentCourseWeighting.map( (wt) => { return { content_id: wt.id, weight: wt.weight } }) }
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify(courseWeight)
        fetch('/api/content_weighting/update',
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
            })
            .catch(error => console.log("ERROR: ", error))


        setFormHasUnsavedChanges(false)
    }

    const saveIsDisabled = () => {
        return !formHasUnsavedChanges
    }

    const chartOptions = {
        chart: {
            width: 300,
            type: 'pie',
            borderColor: theme.palette.grey[800],
            background: theme.palette.grey[800],
        },
        legend: {
            show: window.innerWidth > 800,
            verticalAlign: 'left',
            position: 'bottom',
            itemMargin: {
                horizontal: 2,
                vertical: 5
            }
        },
        theme: {
            mode: 'dark',
            palette: 'palette1',
        },
        grid: {
            borderColor: '#0000',
            strokeDashArray: 7,
        },
        xaxis: {
            lines: {
                show: false,
            }
        },
        yaxis: {
            lines: {
                show: true,
            }
        },
        labels: labels,
        series: values,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 350
                },
                legend: {
                    show: false
                }
            }
        }]
    }

    return(
        <React.Fragment>
            <Grid container spacing={theme.spacing(1)} alignContent={'space-between'} alignItems={'flex-start'}>
                <Grid item xs={12} lg={12}>
                    { currentCourseWeighting.length > 0 &&
                    <Grow
                        in={currentCourseWeighting.length > 0}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                    <Paper elevation={4}  className={classes.paper}>


                        <Grid container spacing={theme.spacing(0)} >
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography variant={'h5'}>Content Standards or Topic Weighting</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                            <Table size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={15} >Topic Name</TableCell>
                                        <TableCell align='center' colSpan={2} >Weighting</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                { currentCourseWeighting.map( (weighting, index) => {
                                    return (
                                   <TableRow key={`weight-${weighting.id}`}>
                                           <TableCell colSpan={15}>{weighting.name}</TableCell>
                                           <TableCell  align='center' ><FormControl className={''} fullWidth={true} >
                                               <TextField
                                                   name={'weight-field'}
                                                   value={weighting.weight}
                                                   onChange={(event) => {handleChangeWeight(event, weighting) }}
                                                   onBlur={(event) => {handleBlurWeight(event, weighting)}}
                                               >
                                               </TextField>
                                           </FormControl></TableCell>
                                       </TableRow>
                                   )
                            })}
                                </TableBody>
                            </Table>
                            </Grid>

                            <Grid item xs={12} sm={6} md={8}>
                                <ReactApexChart options={chartOptions} series={values} type="pie" height="350"/>

                            </Grid>
                            <Grid item xs={12} sm={6} md={8}>
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
