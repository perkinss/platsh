import React, {useContext, useEffect, useState} from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import classnames from "classnames";
import {ConfigurationContext} from "../../context/ConfigurationContext";
import Help from "@material-ui/icons/HelpRounded";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import Skeleton from "@material-ui/lab/Skeleton";
import DateFnsUtils from "@date-io/date-fns";
import {dayIsDifferent} from "../../helpers/date_helper";
import DateRangeSection from "../common/DateRangeSection";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(2)
    },
    list: {
        minWidth: 500,
        width: 500
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));

function getStyles(name, nameList, theme) {
    return {
        fontWeight:
            nameList.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function ReportingPeriodForm(props) {
    const { setShowForm, setShowSnackbar } = props
    const classes = useStyles()
    const theme = useTheme()

    // shared configuration state:
    const {dispatch, state} = useContext(ConfigurationContext)
    // form local state:
    let selectedPeriod = state.selected_period

    const [periodName, setPeriodName] = useState(selectedPeriod?.name || '');
    const [selectedSection, setSelectedSection] = useState(selectedPeriod?.section?.id || null)
    const [sectionTopics, setSectionTopics] = useState([])
    const [selectedTopics, setSelectedTopics] = useState(selectedPeriod?.contents.map(c => c.id) || [])
    const [startDate, setStartDate] = useState(selectedPeriod?.period_start || null)
    const [endDate, setEndDate] = useState(selectedPeriod?.period_end || null)
    const [periodLoading, setPeriodLoading] = useState(false)

    const handlePeriodChange = (event) => {
        setPeriodName(event.target.value);
    };

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value)
    };

    const handleStartDateChange = (date) => {
        setStartDate(date)
    };

    const handleEndDateChange = (date) => {
        setEndDate(date)
    };

    const handleSave = (event) => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify({
            name: periodName.trim(),
            section: selectedSection,
            topics: selectedTopics,
            period_start: startDate,
            period_end: endDate,
        })
        let id = selectedPeriod?.id || ''
        fetch(`/api/reporting_period/${id}`,     {
            method: 'POST',
            body: body,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        }).then(res => {
            return res.json();
        }).then(result => {
            dispatch({ type: 'ADD_OR_UPDATE_REPORTING_PERIOD', reporting_period: result })
            setShowSnackbar({open:true,variant:"success",message:"Success! Saved it!"})
            handleCancel()
        })
    }

    const handleCancel = (event) => {
        setSelectedSection(null)
        setSelectedTopics([])
        setStartDate(null)
        setEndDate(null)
        setPeriodName('')
        dispatch({ type: 'SET_SELECTED_PERIOD', period: null})
        setShowForm(false)
    }

    const saveShouldBeDisabled = () => {
        return  emptyValues() || (selectedPeriod && !valuesHaveBeenEdited())
    }

    const emptyValues = () => {
        return periodName.trim() === '' || !selectedTopics?.length
    }

    const valuesHaveBeenEdited = () => {
        return (
            selectedPeriod.name !== periodName ||
            selectedTopics.sort().toString() !== selectedPeriod.contents.map(c=> `${c.id}`).sort().toString() ||
            dayIsDifferent(new Date(startDate?.toString()), new Date(selectedPeriod.period_start)) ||
            dayIsDifferent(new Date(endDate?.toString()), new Date(selectedPeriod.period_end))
        )
    }

    const loadTopics = (section_courses_content_json) => {
        setSectionTopics(section_courses_content_json)
        setSelectedTopics(selectedPeriod?.contents.map( topic => `${topic.id}`) || [])
        setPeriodLoading(false)
    }

    const handleTopicChange = (e, selected) => {
        let value = e.target.value
        if (selected === true && !selectedTopics?.includes(`${value}`)) {
            let copy = [...selectedTopics]
            copy.push(`${value}`)
            setSelectedTopics(copy)
        } else if (selected === false) {
            let copy = [...selectedTopics]
            copy.splice(copy.indexOf(value), 1)
            setSelectedTopics(copy)
        }
    }

    useEffect(() => {
        if (selectedSection) {
            fetch(`api/section/${selectedSection}/contents`)
                .then(res => res.json())
                .then(
                    (result) => {
                        loadTopics(result)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
    },[selectedSection])

    useEffect(() => {
        if (state.selected_period) {
            setPeriodLoading(true)
            setPeriodName(selectedPeriod.name)
            setSelectedSection(selectedPeriod.section.id)
            fetch(`api/section/${selectedSection}/contents`)
                .then(res => res.json())
                .then(
                    (result) => {
                        loadTopics(result)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
    }, [state.selected_period])

    const getCheckbox = (topic) => {

        if (state.selected_period) {
            return (
                <Checkbox
                    checked={selectedTopics.includes(`${topic.id}`) || false}
                    onChange={handleTopicChange}
                    name={topic.name}
                    value={`${topic.id}`}
                />)
        } else {
            return (
                <Checkbox
                    onChange={handleTopicChange}
                    name={topic.name}
                    value={`${topic.id}`}
                />
            )
        }


    }

    if (periodLoading) {
        return <Skeleton variant={'rect'} height={"700"} />
    }

    return (
        <React.Fragment>
        { periodLoading && <Skeleton variant={'rect'} height={"700"} /> }
            {!periodLoading && <div style={{paddingTop: theme.spacing(3)}}>
                <Grid container alignContent={'space-between'} alignItems={'center'} spacing={theme.spacing(.25)}>
                    <Grid item xs={12} xl={12}>
                        <Grid container alignContent={'space-between'} alignItems={'center'}>
                            <Grid item xs={1}>
                                <Tooltip
                                    title={'Reporting periods control the data that is included when generating reports.'}>
                                    <Help
                                        aria-haspopup="true"
                                        className={classes.helpicon}
                                    >?</Help>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={11}>
                                <Typography variant={'h4'}>
                                    {selectedPeriod ? `Edit ${selectedPeriod.name}` : 'Create a New Reporting Period'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Typography variant={'h6'}>
                            <TextField
                                id={'section-name'}
                                fullWidth={true}
                                className={classnames(classes.margin, classes.textField)}
                                variant="outlined"
                                label="Reporting Period Name"
                                name={"period"}
                                value={periodName}
                                onChange={handlePeriodChange}
                            >
                            </TextField>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
                        <FormControl className={classes.formControl} fullWidth={true}>
                            <InputLabel htmlFor="select-section">Select Section</InputLabel>
                            <Select
                                value={selectedSection || ''}
                                onChange={handleSectionChange}
                                input={<Input id="select-section"/>}
                                MenuProps={MenuProps}
                            >
                                {Array.from(state.sections).map((section, index) => {
                                    return (<MenuItem key={section.id} value={section.id}>
                                        {section.name || ''}
                                    </MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <DateRangeSection
                            fromDate={startDate}
                            toDate={endDate}
                            setFromDate={handleStartDateChange}
                            setToDate={handleEndDateChange}
                            callback={() => {}}
                        />

                    </Grid>
                    {selectedSection && sectionTopics &&
                    <Grid item xs={12} xl={12}>
                        <Paper className={classes.paper} elevation={1}>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormLabel component="legend">Topics:</FormLabel>
                                <FormGroup>
                                    {Array.from(sectionTopics).map((course) => {
                                        return course.contents.map((topic) => {
                                            return <FormControlLabel
                                                key={topic.id}
                                                control={
                                                    getCheckbox(topic)
                                                }
                                                label={topic.name}
                                            />
                                        })
                                    })}
                                </FormGroup>
                                <FormHelperText>Select at least one topic to be included in the report</FormHelperText>
                            </FormControl>
                        </Paper>
                    </Grid>
                    }
                </Grid>
                <br/>
                <br/>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSave}
                    disabled={saveShouldBeDisabled()}>
                    Save
                </Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
            }
        </React.Fragment>
    );
}
export default ReportingPeriodForm
