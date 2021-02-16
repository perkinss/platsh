import React, {useContext, useEffect, useState} from 'react'
import {
    Avatar,
    Button,
    Checkbox,
    Chip,
    Collapse,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    Grid,
    Grow,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    TextField,
    Tooltip,
    Typography,
    Zoom
} from '@material-ui/core'
import {makeStyles, useTheme} from '@material-ui/styles'
import ExpandMore from '@material-ui/icons/ExpandMoreRounded'
import ExpandLess from '@material-ui/icons/ExpandLessRounded'
import StarBorder from '@material-ui/icons/StarBorder'
import Star from '@material-ui/icons/StarRounded'
import TurnedIn from '@material-ui/icons/TurnedInRounded'
import TurnedInNot from '@material-ui/icons/TurnedInNot'

import {ConfigurationContext} from '../../context/ConfigurationContext'
import Skeleton from "@material-ui/lab/Skeleton";

const makeHeaderStyles =  makeStyles(theme => ({
    root: {
        background: theme.palette.primary.dark,
        opacity: '.99',
        fontSize: '2em',
        width: '100%'
    },

}))

const makeListStyles =  makeStyles(theme => ({
    root: {
        width: '100%'
    }
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

export default function EditableTaskForm(props) {

    let {classes, selectedCourses, possiblyNewTask, editMode, isHolistic, handleDeleteTask, assessmentCompetencyId, loading } = props
    let drawerClasses = drawerStyles()
    const headerclasses = makeHeaderStyles()
    const listClass = makeListStyles()
    const theme = useTheme()
    const {dispatch, state} = useContext(ConfigurationContext)

    const generateSelectedCompetencies = (baseCompetencies) => {
        return baseCompetencies && baseCompetencies.length > 0 ?
            baseCompetencies.reduce((obj, key) => {
                obj[key] = true
                return obj
            }, {}) : {}
    }

    const generateSelectedStandards = (baseStandards) => {
        if (Object.keys(baseStandards).length > 0) {
            return Object.keys(baseStandards).reduce((obj, key) => {
                obj[key] = true
                return obj
            }, {})
        } else {
            return {}
        }
    }

    const [task, setTask] = useState(possiblyNewTask)
    const [taskName, setTaskName] = useState(possiblyNewTask.name)
    const [selectedStandards, setSelectedStandards] = useState(generateSelectedStandards(possiblyNewTask.standards))
    const [selectedCompetencies, setSelectedCompetencies] = useState(generateSelectedCompetencies(possiblyNewTask.competencies))
    const [standards, setStandards] = useState(possiblyNewTask.standards)
    const [competencies, setCompetencies] = useState(possiblyNewTask.competencies)
    const [editing, setEditing] = useState(editMode)


    const [showStandardDrawer, setShowStandardDrawer] = useState(false)
    const [showCompetencyDrawer, setshowCompetencyDrawer] = useState(false)

    const [chipColor, setChipColor] = useState({1: 'secondary'})
    const [expandSublist, setExpandSublist] = React.useState({});

    const handleTaskNameChange = (event) => {
        setTaskName(event.target.value)
    }

    const doDelete = (event) => {
        handleDeleteTask(event, {name: taskName, id: task.id})
        handleDoneTask(event)
    }

    const handleDoneTask = (event) => {
        setEditing(false)
    }

    const handleEdit = (event) => {
        setEditing(!editing)
    }

    const handleOpenStandardsDrawer = () => {
        setShowStandardDrawer(!showStandardDrawer)
    }

    const handleOpenCompetencyDrawer = () => {
        setshowCompetencyDrawer(!showCompetencyDrawer)
    }

    useEffect(() => {
        if (assessmentCompetencyId && competencies.length > 0) {
            let filtered = competencies.filter(id => `${id}` !== `${assessmentCompetencyId}`)
            setCompetencies(filtered)
            setSelectedCompetencies(generateSelectedCompetencies(filtered))
        }

    },[assessmentCompetencyId])

    const standardRows = () => {
        if (state.available_content_standards && standards) {
            let stan = [].concat.apply([],Array.from(state.available_content_standards).map((course) => {
                return [].concat.apply([], course.contents.map((content) => {
                    return content.standards.filter((standard) => {
                        return standards && (Object.keys(standards).includes(`${standard.id}`) || Object.keys(standards).includes(standard.id))
                    })
                }))
            }))
            let chips = stan.map(standard => {
                let chipProps = {}
                if ( editing) {
                    chipProps = { onClick: () => handleClickChip(standard.id) }
                }
                return (
                    <Grow
                        key={`animation-${standard.id}`}
                        in={true}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                            <Tooltip title={standard.description} >
                            <Chip
                                key={`standard-${standard.id}`}
                                avatar={
                                    <Avatar>
                                        <Star/>
                                    </Avatar>
                                }
                                label={
                                    <React.Fragment>
                                        <Typography>
                                            {!isHolistic ? <strong> {standards[standard.id]} </strong> : ""}
                                            {standard.description}
                                        </Typography>
                                    </React.Fragment>
                                }
                                className={classes.chip}
                                color={standards[standard.id] === 'M' ? 'secondary' : standards[standard.id] === 'H' ? 'primary' : 'default'}
                                {...chipProps}
                            />
                            </Tooltip>
                        </div>
                    </Grow>
                )
            })

            if (chips.length > 0 ) {
                return (
                    <Grid item sm={12}>
                        { editing && !isHolistic ?
                            <React.Fragment>
                                <Typography variant={'caption'} style={{paddingLeft: '5px', paddingBottom: '5px'}}>
                                Click to set the level of difficulty (<b>L</b>ow, <b>M</b>edium
                                or <b>H</b>igh):</Typography>
                            <br/>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Typography variant={'caption'} style={{paddingLeft: '5px', paddingBottom: '5px'}}>
                                    Standards:</Typography>
                                <br/>
                            </React.Fragment>
                        }
                        {chips}
                    </Grid>
                )
            }

        }
    }

    const competencySection = () => {

        if (competencies && competencies.length > 0) {
            let com = [].concat.apply([],Array.from(state.available_grouped_competencies).map((course) => {
                return [].concat.apply([],course.groups.map((group) => {
                    return group.competencies.filter((competency) => {
                        return competencies && (competencies.includes(`${competency.id}`) || competencies.includes(competency.id))
                    })
                }))
            }))

            return (
                <React.Fragment>
                    <Grid item sm={12}>
                        <Divider/>
                        <Typography variant={'caption'}>{ (task && editing) ? 'Selected ' :'' }Competencies: </Typography>
                        <List aria-label={"List of competencies selected for task"} dense={true}>
                            {com.map(competency =>
                                <Zoom in={true} style={{ transitionDelay: '500ms' }}  key={`list-animation-${competency.id}`}>
                                    <ListItem key={`standard-${competency.id}`} >
                                        <ListItemText
                                            className={listClass.root}
                                            disableTypography={true}
                                            primary={
                                                <Tooltip title={competency.description}>
                                                <Typography noWrap={true} variant={'body1'}>{competency.description}</Typography>
                                                </Tooltip>
                                            }
                                            primaryTypographyProps={{noWrap: true}}
                                            />
                                    </ListItem>
                                </Zoom>)}
                        </List>
                    </Grid>
                </React.Fragment>
            )
        }
    }

    const handleClickChip = (value) => {
        if (editing) {
            switch (standards[value]) {
                case 'L' :
                    setStandards({...standards, [value]: 'M'})
                    setChipColor({...chipColor, [value]: 'secondary'})
                    break;
                case 'M' :
                    setStandards({...standards, [value]: 'H'})
                    setChipColor({...chipColor, [value]: 'primary'})
                    break;
                case 'H' :
                    setStandards({...standards, [value]: 'L'})
                    setChipColor({...chipColor, [value]: 'default'})
                    break;
                default:
                    break;
            }
        }

    }

    const handleUpdateTask = (event) => {

        let updatedTask = {id: task.id, name: taskName.trim(), standards: standards, competencies: competencies, deletable: task.deletable }
        setTask(updatedTask)
        dispatch({ type: 'UPDATE_TASK_IN_CURRENT_ASSESSMENT', task: updatedTask })
        if (event.target.innerHTML === 'Done') {
            handleDoneTask(event)
        }
    }

    const handleStandardCheck = (event) => {
        let s = event.target.value
        setSelectedStandards({...selectedStandards, [s]: !selectedStandards[s]})
    }

    const closeDrawer = () => {

        if (showStandardDrawer) {
            const selected = Object.keys(selectedStandards)
                .filter(key => selectedStandards[key]).reduce((obj, key) => {
                    obj[key] = standards[key] || 'M'
                    return obj
                }, {})
            setStandards(selected)
            setShowStandardDrawer(false)
        }

        if (showCompetencyDrawer) {
            const selected = Object.keys(selectedCompetencies)
                .filter(key => selectedCompetencies[key])
            const numbered = selected.map( s => Number(s))
            setCompetencies(selected)
            setshowCompetencyDrawer(false)
        }

    }

    const handleExpandTopic = (index) => {
        if (expandSublist && expandSublist[index]) {
            setExpandSublist({...expandSublist, [index]: false})
        } else {
            setExpandSublist({...expandSublist, [index]: true})
        }
    }

    const handleCompetencyCheck = (event) => {
        let c = event.target.value
        setSelectedCompetencies({...selectedCompetencies, [c]: !selectedCompetencies[c]})
    }

    const getDrawerContents = () => {
        let drawerContent = null

        if (state.available_content_standards.length > 0 && showStandardDrawer) {
            drawerContent = Array.from(state.available_content_standards).map((course, index) => {
                return (
                    <List
                        key={`list-${course.id}-${index}`}
                        component="div"
                        aria-labelledby="nested-list-subheader"

                        subheader={
                            <ListSubheader
                                component="div"
                                inset={true}
                                classes={headerclasses}
                                className={headerclasses.root}
                                styles={{opacity: .25}}
                                id="nested-list-subheader">
                                {course.title}
                            </ListSubheader>
                        }
                        className={classes.root}
                    >
                        {course.contents.map((content, index) => {
                            return (
                                <React.Fragment >
                                    <ListItem key={`list-${index}-${content.id}`} button onClick={() => handleExpandTopic(index)}>
                                        <ListItemText primary={content.name}/>
                                        {expandSublist[index] ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Collapse in={expandSublist[index]} timeout="auto" unmountOnExit>
                                        {content.standards.map((standard, index) => {
                                            return (
                                                <List key={`l-${index}-${standard.id}`} component="div" disablePadding>
                                                    <ListItem button className={classes.nested}
                                                              onChange={handleStandardCheck}>
                                                        <ListItemIcon>
                                                            <Tooltip title={standard.description} placement={"bottom-start"}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        icon={<StarBorder/>}
                                                                        checkedIcon={<Star/>}
                                                                        value={standard.id}
                                                                        checked={selectedStandards[standard.id] || false}/>}
                                                                label={standard.description}
                                                            />
                                                                </Tooltip>

                                                        </ListItemIcon>
                                                    </ListItem>
                                                </List>
                                            )
                                        })
                                        }
                                    </Collapse>
                                    </div>

                                </React.Fragment>
                            )
                        })}
                    </List>
                )
            })
        } else if (state.available_grouped_competencies && showCompetencyDrawer) {
            drawerContent = Array.from(state.available_grouped_competencies).map((course, index) => {
                return (
                    <List
                        key={`list-${index}`}
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
                        {course.groups.map((group, index) => {
                            return (
                                <React.Fragment key={`${group.id}-${index}`}>
                                    <ListItem key={index} button onClick={() => handleExpandTopic(index)}>
                                        <ListItemText primary={group.title}/>
                                        {expandSublist[index] ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Collapse in={expandSublist[index]} timeout="auto" unmountOnExit>
                                        {group.competencies.map((competency, index) => {
                                            const disabled = `${competency.id}` === `${assessmentCompetencyId}`
                                            return (
                                                <List key={`l-${index}`} component="div" disablePadding disabled={disabled}>
                                                    <ListItem
                                                        button
                                                        className={classes.nested}
                                                        disabled={disabled}
                                                        onChange={handleCompetencyCheck}
                                                    >
                                                        <Tooltip title={competency.description} placement={"bottom-start"}>
                                                        <ListItemIcon>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        icon={<TurnedInNot/>}
                                                                        checkedIcon={<TurnedIn/>}
                                                                        value={competency.id}
                                                                        disabled={disabled}
                                                                        checked={selectedCompetencies[competency.id.toString()] || false}/>}
                                                                label={competency.description}
                                                            />
                                                        </ListItemIcon>
                                                        </Tooltip>
                                                    </ListItem>
                                                </List>
                                            )
                                        })
                                        }
                                    </Collapse>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </List>
                )
            })
        }

        return drawerContent
    }

    return (
    <React.Fragment>
        {loading ?
        <Paper  elevation={8} className={classes.root} id={'add-task-form'}>
            <Skeleton variant="rect" width={'100%'} height={500} />
        </Paper>
            :
        <Paper  elevation={8} className={classes.root} id={'add-task-form'}>
            {!editing ?  <Typography variant={'h6'}>{taskName}</Typography> :
            <FormControl className={''} fullWidth={true}>
                <TextField
                    value={taskName}
                    variant={'outlined'}
                    id={"task-name"}
                    onChange={handleTaskNameChange}
                    label={"Name"}
                    required
                />
            </FormControl> }
            <Grid container spacing={theme.spacing(.5)}>
                {standardRows()}
                {editing && <Grid item sm={12}>
                    <Tooltip title={!selectedCourses ? 'Select a course for the assessment in order ' +
                        'to be able to select standards for the assessment\'s tasks.  The courses used in the ' +
                        'selected section determine the standards available' : ''}>
                        <div>
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                                disabled={!selectedCourses}
                                onClick={handleOpenStandardsDrawer}>
                                Add / Remove Standards
                            </Button>
                        </div>
                    </Tooltip>
                </Grid>}
                {competencySection()}
                { editing && <Grid item sm={12}>
                    <Tooltip title={!selectedCourses ? 'Select a course for the assessment in order ' +
                        'to be able to select competencies. ' : ''}>
                        <div>
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                                disabled={!selectedCourses}
                                onClick={handleOpenCompetencyDrawer}>
                                Add / Remove Competencies
                            </Button>
                        </div>
                    </Tooltip>
                </Grid>
                }

                <Grid item sm={12}>
                    <Divider/>
                    { editing ?
                        <React.Fragment><Button onClick={handleUpdateTask}>Done</Button><Button onClick={handleDoneTask}>Cancel</Button></React.Fragment>
                    :
                        <React.Fragment>
                            <Button onClick={handleEdit}>Edit</Button>
                            { !isHolistic &&
                                <Tooltip
                                    title={task.deletable ? '' : 'Not deletable: Observations have been made on this task'}>
                                    <div>
                                        <Button onClick={doDelete} disabled={!task.deletable}>Delete</Button>
                                    </div>
                                </Tooltip>
                            }
                        </React.Fragment>
                    }
                </Grid>
            </Grid>
        </Paper>}
        <Drawer
            open={showStandardDrawer || showCompetencyDrawer}
            anchor={"right"}
            onClose={closeDrawer}
            classes={{
                paper: drawerClasses.drawerPaper
            }}
            className={drawerClasses.drawer}
        >
            <Button onClick={closeDrawer}>Done</Button>

            {getDrawerContents()}
        </Drawer>

    </React.Fragment>
    );
}
