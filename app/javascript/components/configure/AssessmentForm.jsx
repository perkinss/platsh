import React, {useContext, useEffect, useState} from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {  Button, Collapse, Divider, Drawer, FormControl, FormControlLabel, Grid, Input, InputLabel, List, ListItem,
    ListItemText, ListSubheader, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Tooltip, Typography, Zoom } from '@material-ui/core'
import {ConfigurationContext} from '../../context/ConfigurationContext'
import ExpandMore from '@material-ui/icons/ExpandMoreRounded'
import ExpandLess from '@material-ui/icons/ExpandLessRounded'
import Help from '@material-ui/icons/HelpRounded'
import AssessmentFormTasks from './AssessmentFormTasks'
import {isEquivalent} from "../../helpers/object_helper"
import Chip from "@material-ui/core/Chip";
import Skeleton from "@material-ui/lab/Skeleton";

const types = ['Test', 'Performance-based', 'Observational']
const ANALYTIC_SCORING_TYPE = 'Analytic'
const HOLISTIC_SCORING_TYPE = 'Holistic'
const scoringTypes = [ANALYTIC_SCORING_TYPE, HOLISTIC_SCORING_TYPE]
const typeDescriptions = {
    'Test': 'Tests use a range of question types including true/false, multiple choice, ordering, short answer/essay, ' +
    'fill-in-the blank, matching, etc. Test assessment types include, but are not limited to: ' +
    ' Quizzes, Diagnostic tests, Formative tests, and Summative tests',
    'Performance-based': 'Performance-based assessment is open-ended and without a single, correct answer. The criteria ' +
    'are addressed in a scoring rubric. Types include, but are not limited to: \n' +
    'Presentations, Portfolios, Performances, Projects, Exhibits/Fairs, and Debates',
    'Observational': 'Observational assessment allows teachers to record and report student demonstrations of learning.  ' +
    'For example, incidental observation is an unplanned opportunity that emerges where the teacher observes some aspect of individual student learning. ' +
    'A planned observation involves deliberate planning of an opportunity for the teacher to observe specific content standards or competencies.'}

const useStyles =  makeStyles(theme => ({
    root: {
        padding: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(2)
    },
    type: {
        marginLeft: theme.spacing(-7)
    },
    helpicon: {
        marginTop: theme.spacing(4)
    },
    taskList: {
        padding: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(1)
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.primary,
        marginTop: theme.spacing(1)
    },
}))
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

function getStyles(name, nameList, theme) {
    return {
        fontWeight:
            nameList.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const makeHeaderStyles =  makeStyles(theme => ({
    root: {
        background: theme.palette.primary.dark,
        opacity: '.99',
        fontSize: '2em'
    }

}))

const clearButtonStyles = makeStyles(theme => ({
    root: {
        cursor: 'pointer',
    },
}))

const drawerWidth = '40%'

const drawerStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    }
}))

const assessmentCompetencyHelp = `
Select an assessment-wide competency when all tasks reflect the same competency.
You can select competencies for the tasks as well, but not the same one.
`

function AssessmentForm(props) {
    let { setShowAssessmentForm, coursesLoading, courseList, setShowSnackbar, showAssessmentForm, templateAssessment, classes } = props

    if (!showAssessmentForm) {
        return null
    }

    const {state, dispatch} = useContext(ConfigurationContext)

    classes = {...classes, ...useStyles()}
    const headerclasses = makeHeaderStyles()
    const clearButtonClass = clearButtonStyles()
    const drawerClasses = drawerStyles()
    const theme = useTheme()

    const [initialTasks, setInitialTasks] = useState(state.current_assessment.tasks ? [...state.current_assessment.tasks] : [])

    const [initialCourses, setInitialCourses] = useState(state.current_assessment.courses ? [...state.current_assessment.courses] : [])
    const [initialSections, setInitialSections] = useState(state.current_assessment.sections ? [...state.current_assessment.sections] : [])
    const [initialSectionIds, setInitialSectionIds] = useState( state.current_assessment.sections ? state.current_assessment.sections.map(s => s.id) : [])
    const [initialType, setInitialType] = useState(state.current_assessment.type ? state.current_assessment.type.name :  '')
    const [initialName, setInitialName] = useState(state.current_assessment.name || '')
    const [initialSelectedCompetency, setInitialSelectedCompetency] = useState(state.current_assessment.competency || '')

    const [typeName, setTypeName] = useState(initialType)
    const [scoringTypeName, setScoringTypeName] = useState(state.current_assessment.scoring_type ? state.current_assessment.scoring_type.name :  ANALYTIC_SCORING_TYPE)
    const [assessmentName, setAssessmentName] = useState(initialName)

    const [selectedSections, setSelectedSections] = useState(initialSections)
    const [selectedCourses, setSelectedCourses] = useState(initialCourses)
    const [currentTasks, setCurrentTasks] = useState(initialTasks)

    const [typeDescription, setTypeDescription]= useState(typeDescriptions[initialType])
    const [assessment, setAssessment] = useState(state.current_assessment)
    const [showCompetencyDrawer, setShowCompetencyDrawer] = useState(false)
    const [expandGroup, setExpandGroup] = useState({})
    const [selectedCompetency, setSelectedCompetency] = useState(initialSelectedCompetency)
    const [competency, setCompetency] = useState(initialSelectedCompetency)
    const [saveDisabled, setSaveDisabled] = useState(true)
    const [selectedSectionIds, setSelectedSectionIds] = useState(initialSectionIds)

    const [filteredSections, setFilteredSections] = useState(state.sections)
    const [filteredSectionIds, setFilteredSectionIds] = useState(state.sections.map( s => s.id))
    const [showTaskForm, setShowTaskForm] = useState(Object.keys(assessment).length === 0)

    const [standardsLoading, setStandardsLoading] = useState(false)
    const [competenciesLoading, setCompetenciesLoading] = useState(false)

    const showNewTask = (value) => {
        setShowTaskForm(value)
    }

    const handleTypeChange = (event) => {
        setTypeName(event.target.value)
        setTypeDescription(typeDescriptions[event.target.value])
        setAssessment({...assessment, type: event.target.value })
    }

    const handleScoringTypeChange = (event) => {
        setScoringTypeName(event.target.value)
        setAssessment({...assessment, scoring_type: event.target.value })
    }

    const handleCourseChange = (event) => {
        setSelectedCourses(event.target.value)
        setSelectedSections([])
        setSelectedSectionIds([])
    }

    const handleSelectCompetency = (event) => {
        setSelectedCompetency(event.target.value)
        setCompetency(state.available_competencies.find(competency => `${competency.id}` === event.target.value))
    }

    const clearCompetency = (event) => {
        setSelectedCompetency('')
        setCompetency('')
    }

    const closeCompetencyDrawer = (event) => {
        setShowCompetencyDrawer(false)
    }

    const handleOpenCompetencyDrawer = (event) => {
        setShowCompetencyDrawer(true)
    }

    const handleExpandTopic = (index) => {
        if (expandGroup && expandGroup[`${index}`]) {
            setExpandGroup({...expandGroup, [`${index}`]: false})
        } else {
            setExpandGroup({...expandGroup, [`${index}`]: true})
        }
    }

    const isAssessmentFormDirty = () => {
        return !(isEquivalent(initialTasks, currentTasks) &&
            initialType === typeName &&
                isEquivalent(initialSectionIds, selectedSectionIds) &&
                initialName === assessmentName &&
                isEquivalent(initialSelectedCompetency, selectedCompetency)
        )
    }

    const handleCancel = () => {
        setShowAssessmentForm(false)
        dispatch({type:'SET_CURRENT_ASSESSMENT', assessment: {}})
    }

    const handleAssessmentNameChange = (event) => {
        setSaveDisabled(false)
        setAssessmentName(event.target.value)
    }

    // TODO later: all tasks should be 'deleteable' meaning archive if observations exist
    const handleDeleteTask = (event, val, n) => {
        setShowTaskForm(false)
        dispatch({ type: 'REMOVE_TASK_FROM_CURRENT_ASSESSMENT', task: {id: val.id, name: val.name} })
    }

    const handleSectionChange = (event) => {
        let selected = state.sections.filter (section => section.id === event.target.value)
        setSelectedSections(selected)
        setSelectedSectionIds(event.target.value)
    }

    const handleSaveAssessment = (shareAssessment) => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content

        let body = JSON.stringify({
            name: assessmentName.trim(),
            type: typeName,
            scoring: scoringTypeName,
            sections: selectedSectionIds,
            courses: selectedCourses.map( course => course.id ),
            competency: selectedCompetency,
            tasks: state.current_assessment.tasks})

        setAssessmentName('')
        setTypeName('')
        setScoringTypeName(ANALYTIC_SCORING_TYPE)

        setAssessment({})
        if (isEdit()) {
            fetch(`/api/assessments/${state.current_assessment.id}`,
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

                    dispatch({type:'UPDATE_ASSESSMENT', assessment: response.assessment})
                    if (shareAssessment) {
                        shareAssessment(response.assessment.id)
                    }
                    handleCancel()
                })
                .catch(error => console.log("ERROR: ", error))
        } else {
            fetch('/api/assessments/new',
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
                    dispatch({type:'ADD_ASSESSMENT', assessment: response})
                    if (shareAssessment) {
                        shareAssessment(response.id)
                    }
                    handleCancel()
                })
                .catch(error => console.log("ERROR: ", error))
        }
    }

    const handleShareAssessment = () => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content

        const shareAssessment = (assessmentId) => {
            fetch(`/api/assessments/${assessmentId}/share`,
                {
                    method: 'POST',
                    body: '{}',
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
                    setShowSnackbar({open:true,variant:"success",message:"Successfully Shared!"})
                    dispatch({type:'ADD_SHARED_ASSESSMENT', assessment: response})
                    dispatch({type:'UPDATE_ASSESSMENT', assessment: response})
                })
                .catch(error => console.log("ERROR: ", error))
        }

        const stopSharingAssessment = (assessmentId) => {
            fetch(`/api/assessments/${assessmentId}/share`,
                {
                    method: 'DELETE',
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
                    setShowSnackbar({open:true,variant:"success",message:"Successfully Stopped Sharing!"})
                    dispatch({type:'REMOVE_SHARED_ASSESSMENT', assessment: response})
                    dispatch({type:'UPDATE_ASSESSMENT', assessment: response})
                })
                .catch(error => console.log("ERROR: ", error))
        }

        if (isShared()) {
            stopSharingAssessment(state.current_assessment.id)
        }
        else if (!saveDisabled) {
            handleSaveAssessment(shareAssessment)
        }
        else {
            shareAssessment(state.current_assessment.id)
        }
    }

    const getStandardsAndCompetencies = () => {

        if (selectedCourses.length > 0){
            const urlstring = selectedCourses.reduce((string, course) =>{
                return string ? string + `&course[]=${course.id}` : `course[]=${course.id}`
            },'')
            const params = encodeURI(urlstring)

            setStandardsLoading(true)
            setCompetenciesLoading(true)
            fetch(`/api/standards/get_all_for_course?${params}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        dispatch({type: 'SET_AVAILABLE_STANDARDS', standards: result})
                        setStandardsLoading(false)
                    },
                    (error) => {
                        console.log("Error:", error)
                        setStandardsLoading(false)
                    }
                )

            fetch(`/api/competencies/get_by_course?${params}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        dispatch({type: 'SET_AVAILABLE_COMPETENCIES', competencies: result})
                        setCompetenciesLoading(false)
                    },
                    (error) => {
                        console.log("Error:", error)
                        setCompetenciesLoading(false)
                    }
                )
        }

    }

    const flattenedTasks = Object.entries(currentTasks).map(([key, value]) =>
        `${key}:${Object.entries(value).map(([subKey, subValue]) => {
            if (typeof subValue === 'object') {
                return `${subKey}:${Object.entries(subValue).map(([deepKey, deepValue]) => `${deepKey}:${deepValue}`)}`
            } else {
                return `${subKey}:${subValue}`
            }
        })}`
    )

    const isEdit = () => Boolean(state.current_assessment && state.current_assessment.id)
    const isShared = () => Boolean(state.current_assessment && state.current_assessment.shared)
    const isShareDisabled = () => Boolean(templateAssessment) || (saveDisabled && !isEdit())
    const isHolistic = () => scoringTypeName === HOLISTIC_SCORING_TYPE

    useEffect(() => {
        if (selectedCourses.length > 0) {
            getStandardsAndCompetencies()
            let selectedCourseIds = selectedCourses.map(c => c.id).sort()
            let filtered = state.sections.filter( section => {
                // find only sections that have all the selected course ids.
                let sectionCourseIds = section.courses.map(c => c.id)
                let intersection = sectionCourseIds.filter(value => selectedCourseIds.includes(value)).sort()
                return isEquivalent(intersection, selectedCourseIds)
            })
            setFilteredSections(filtered)
            setFilteredSectionIds(filtered.map(s => s.id))
        } else {
            setFilteredSections(state.sections)
            setFilteredSectionIds(state.sections.map(s => s.id))
        }
    }, [selectedCourses, state.sections])

    /**
     * an effect to set the save field disabled if the assessment is in an unsaveable state.
     */
    useEffect(() => {
        let emptyFields = selectedCourses.length === 0 || assessmentName === '' || typeName === ''
        let hasNoTasks = flattenedTasks.length === 0
        const tasks = Object.values(currentTasks)
        let hasNoCompetencies = !competency && tasks && !tasks.find(task => task.competencies && task.competencies.length > 0)
        setSaveDisabled(!isAssessmentFormDirty() || hasNoTasks || emptyFields || hasNoCompetencies )

    }, [
        selectedSectionIds,
        flattenedTasks.toString(),
        assessmentName,
        typeName,
        competency
    ])

    /**
     * an effect that waits for the available competencies to load so that it can display the assessment competency description, if there is one
     */
    useEffect(() => {
        if (selectedCompetency && state.available_competencies.length > 0) {
            setCompetency(state.available_competencies.find(competency => `${competency.id}` === `${selectedCompetency}`))
        }
    },[state.current_assessment, state.available_competencies])

    useEffect(() => {
        if (isEdit()) {
            setAssessmentName(state.current_assessment.name)
            setTypeName(state.current_assessment.type.name)
            setScoringTypeName(state.current_assessment.scoring_type.name)
            setTypeDescription(state.current_assessment.type.description)
            setSelectedCompetency(state.current_assessment.competency)
            setCurrentTasks(state.current_assessment.tasks)
            setSelectedCourses(state.current_assessment.courses)
            setSelectedSections(state.current_assessment.sections)
            setSelectedSectionIds(state.current_assessment.sections.map(section => section.id))
        }
    }, [state.current_assessment && state.current_assessment.id])

    useEffect(() => {
        if (state.current_assessment && state.current_assessment.tasks && state.current_assessment.tasks.length > 0) {
            setCurrentTasks(state.current_assessment.tasks)
        }
    }, [state.current_assessment && state.current_assessment.tasks])

    // If a template is provided, set the form values to match the provided template
    useEffect(() => {
        if (templateAssessment) {
            setAssessmentName(templateAssessment.name)
            setTypeName(templateAssessment.type.name)
            setTypeDescription(templateAssessment.type.description)
            setScoringTypeName(templateAssessment.scoring_type.name)
            setSelectedCompetency(templateAssessment.competency)
            if (state.available_competencies.length > 0) {
                setCompetency(state.available_competencies.find(competency => competency.id === templateAssessment.competency))
            }
            // Ensure the selected courses are the same instances used in the drop down list
            setSelectedCourses(courseList.filter(course => templateAssessment.courses.some(templateCourse => templateCourse.id == course.id)))
            // Reset the current assessment tasks
            const templateTaskValues =  templateAssessment.tasks.map(task => {
                return { name: task.name, standards: {...task.standards}, competencies: [...task.competencies], deletable: true }
            })
            dispatch({type:'SET_TASKS_ON_CURRENT_ASSESSMENT', tasks: templateTaskValues})
        }
    }, [templateAssessment && templateAssessment.id])

    return (
        state.current_assessment && (coursesLoading || standardsLoading || competenciesLoading )
            ?
            <Paper className={classes.paper} elevation={1}>
                <Skeleton variant="rect" width={'100%'} height={300} />
            </Paper>
            :
           <> <div style={{paddingTop: theme.spacing(4)}}>
                <Typography variant={'h6'}>{isEdit() ?  `Edit Assessment '${assessmentName}'` : "Create New Assessment"}</Typography>
            </div>
            <Paper className={classes.paper} elevation={1}>
                <Grid container alignContent={'space-between'} alignItems={'center'} spacing={theme.spacing(.25)}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Grid container alignContent={'space-between'} alignItems={'center'} >
                            <Grid item xs={1}>
                                <Tooltip title={typeDescription || ''}>
                                <Help
                                    aria-haspopup="true"
                                    className={classes.helpicon}
                                >?</Help>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={11}>
                                <FormControl fullWidth={true} required>
                                    <InputLabel htmlFor="select-assessment-type">Assessment Type</InputLabel>
                                    <Select
                                        value={typeName}
                                        variant={'outlined'}
                                        onChange={handleTypeChange}
                                        input={<Input id="select-assessment-type" />}
                                    >
                                        {types.map(type => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <TextField
                            required
                            fullWidth={true}
                            variant="outlined"
                            label="Name the assessment"
                            name={"assessmentName"}
                            value={assessmentName}
                            onChange={handleAssessmentNameChange}
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <FormControl className={''} fullWidth={true} required={!state.current_assessment || state.current_assessment.tasks && state.current_assessment.tasks.length === 0}>
                        <InputLabel htmlFor="select-courses">{state.current_assessment && state.current_assessment.tasks && state.current_assessment.tasks.length > 0 ? 'Courses' : 'Select Courses'}</InputLabel>
                        <Select
                            required
                            fullWidth={true}
                            multiple
                            disabled={state.current_assessment && state.current_assessment.tasks && state.current_assessment.tasks.length > 0}
                            value={selectedCourses || []}
                            onChange={handleCourseChange}
                            input={<Input id="select-courses" />}
                            renderValue={selected => {
                                return (
                                <div className={classes.chips}>
                                    {selected.map((value, index) => {
                                        return (
                                            <Chip key={`chip-${value.id}`} label={value.title} className={classes.chip} />
                                        )
                                    })}
                                </div>
                            )}}
                            MenuProps={MenuProps}
                        >
                            {Array.from(courseList).map((course) => {
                                const selectedCourseTitles = selectedCourses.map(selectCourse => selectCourse.title)
                                return (<MenuItem key={`course-select-${course.id}`} value={course}
                                                  style={getStyles(course.title, selectedCourseTitles, theme)}>
                                    {course.title}
                                </MenuItem>)
                            })}
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <FormControl className={''} fullWidth={true} >
                            <InputLabel htmlFor="select-multiple-chip">Use in sections:</InputLabel>
                            <Select
                                disabled={filteredSections.length === 0}
                                multiple
                                value={selectedSectionIds}
                                onChange={handleSectionChange}
                                input={<Input id="select-sections" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map((value, index) => {
                                            if (!state.sections.find(s => s.id === value)) {
                                                return null
                                            } else {
                                                return (
                                                    <Chip
                                                        key={`chip-${index}`}
                                                        label={state.sections.find(s => s.id === value).name}
                                                        className={classes.chip}
                                                    />
                                                    )
                                            }
                                        })}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {filteredSectionIds.map((sectionId) => {
                                    return (<MenuItem key={`section-select-${sectionId}`} value={sectionId}
                                                      style={getStyles(sectionId, selectedSectionIds, theme)}>
                                        {state.sections.find(s => s.id === sectionId) ? state.sections.find(s => s.id === sectionId).name : '' }
                                    </MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Grid container alignContent={'space-between'} alignItems={'center'}>
                            <Grid item xs={12}>
                                <FormControl fullWidth={true} required>
                                    <InputLabel htmlFor="select-scoring-type">Scoring Type</InputLabel>
                                    <Select
                                        value={scoringTypeName}
                                        variant={'outlined'}
                                        disabled={isEdit() || Boolean(selectedCompetency) || currentTasks.length > 1}
                                        onChange={handleScoringTypeChange}
                                        input={<Input id="select-scoring-type"/>}
                                    >
                                        {
                                            scoringTypes.map(type => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    {!isHolistic() ?
                        <Grid item xs={12} md={6} lg={4}>
                            <Grid container alignContent={'flex-start'} alignItems={'center'}>
                                <Grid item xs={1}>
                                    <Tooltip title={assessmentCompetencyHelp}>
                                        <Help
                                            aria-haspopup="true"
                                        >?</Help>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={11} md={11}>
                                    <Tooltip title={!selectedCourses ? 'Select a course for the assessment in order ' +
                                        'to be able to select standards for the assessment\'s tasks.  The courses  ' +
                                        'selected determine the standards available' : ''}>
                                        <div>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                className={classes.button}
                                                disabled={selectedCourses.length === 0}
                                                onClick={handleOpenCompetencyDrawer}>
                                                Select Assessment-wide Competency
                                            </Button>
                                        </div>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid> : ''
                    }
                    <Grid item xs={12} md={12} lg={6}>
                        {competency &&
                            <Grid container alignContent={'space-between'} alignItems={'flex-start'} >
                                <Grid item >
                                    <Typography variant={'caption'}>Selected Competency:</Typography>
                                    <Zoom in={true} style={{ transitionDelay: '500ms'}} >
                                        <Typography variant={'subtitle1'}>{competency.description}</Typography>
                                    </Zoom>
                                </Grid>
                                <Grid item >
                                    <Typography classes={clearButtonClass} onClick={clearCompetency} variant={'h6'}>x</Typography>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Grid>
                <Divider />
                <AssessmentFormTasks
                    classes={classes}
                    loading={competenciesLoading || standardsLoading}
                    selectedCourses={selectedCourses}
                    selectedCompetency={selectedCompetency}
                    isHolistic={isHolistic()}
                    currentTasks={currentTasks}
                    showTaskForm={showTaskForm}
                    showNewTask={showNewTask}
                    handleDeleteTask={handleDeleteTask}
                />
                <Divider/>
                <Grid container alignContent={'stretch'} alignItems={'stretch'} spacing={theme.spacing(.25)}>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary"  className={classes.button} onClick={handleSaveAssessment} disabled={saveDisabled}>
                            Save Assessment
                        </Button>
                        <Button variant="contained" color="default"  className={classes.button} onClick={handleShareAssessment} disabled={isShareDisabled()}>
                            {isShared() ? "Stop Sharing" : (saveDisabled ? "Share Assessment" : "Save and Share Assessment") }
                        </Button>
                        <Button variant="contained" color={"secondary"}  className={classes.button} onClick={handleCancel} >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Drawer
                open={showCompetencyDrawer}
                anchor={"right"}
                onClose={closeCompetencyDrawer}
                className={drawerClasses.drawer}
                classes={{
                    paper: drawerClasses.drawerPaper
                }}
            >
                <Button onClick={closeCompetencyDrawer}>Done</Button>
                <Button onClick={clearCompetency}>Clear</Button>
                {Array.from(state.available_grouped_competencies).map((course) => {
                    return (
                        <List
                            key={`list-${course.id}`}
                            component="div"
                            aria-labelledby="nested-list-subheader"

                            subheader={
                                <ListSubheader
                                    component="div"
                                    inset={true}
                                    classes={headerclasses}
                                    className={headerclasses.root}
                                    syles={{opacity: 1}}
                                    id="nested-list-subheader">
                                    {course.title}
                                </ListSubheader>
                            }
                            className={classes.root}
                        >
                            {course.groups.map((group) => {
                                return (
                                    <React.Fragment key={`group${group.id}-${course.id}`}>
                                        <ListItem key={`${group.id}-${course.id}`} button onClick={() => handleExpandTopic(`${group.id}-${course.id}`)}>
                                            <ListItemText primary={group.title}/>
                                            {expandGroup[`${group.id}-${course.id}`] ? <ExpandLess/> : <ExpandMore/>}
                                        </ListItem>
                                        <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                            <Collapse key={`collapse-${group.id}-${course.id}`} in={expandGroup[`${group.id}-${course.id}`]} timeout="auto" unmountOnExit>
                                                <RadioGroup
                                                    aria-label="assessment-competency"
                                                    name="asessment-competency"
                                                    className={classes.group}
                                                    value={`${selectedCompetency}`}
                                                    onChange={handleSelectCompetency}
                                                >
                                                {group.competencies.map((c) => {
                                                    const checked = `${selectedCompetency}` === `${c.id}`
                                                    return (
                                                        <Tooltip key={`competency-${c.id}`} title={c.description} placement={"bottom-start"}>
                                                            <FormControlLabel
                                                                key={`competency-${c.id}`}
                                                                value={c.id}
                                                                control={<Radio
                                                                    checked={checked}
                                                                />}
                                                                label={
                                                                    <Typography noWrap={true} >{c.description}</Typography>}

                                                                checked={checked}
                                                            />
                                                        </Tooltip>
                                                    )
                                                })
                                                }
                                            </RadioGroup>
                                        </Collapse>
                                        </div>
                                    </React.Fragment>
                                )
                            })}
                        </List>
                    )
                })
                }
            </Drawer>
        </>
    );
}
export default AssessmentForm
