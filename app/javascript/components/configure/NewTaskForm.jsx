import React, { useState, useContext, useEffect } from 'react'
import { FormControl, List, ListSubheader, ListItemText, ListItem, ListItemIcon,
    Tooltip, Paper, TextField, Grid, Button, Typography, Chip, Drawer, Collapse, Checkbox, FormControlLabel,
    Avatar, Divider, Grow, Zoom } from '@material-ui/core'
import { useTheme, makeStyles } from '@material-ui/styles'
import ExpandMore from '@material-ui/icons/ExpandMoreRounded'
import ExpandLess from '@material-ui/icons/ExpandLessRounded'
import StarBorder from '@material-ui/icons/StarBorder'
import Star from '@material-ui/icons/StarRounded'
import TurnedIn from '@material-ui/icons/TurnedInRounded'
import TurnedInNot from '@material-ui/icons/TurnedInNot'

import { ConfigurationContext } from '../../context/ConfigurationContext'

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

const drawerWidth = '30%'

const drawerStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    }
}))


export default function NewTaskForm(props) {

    let {classes, selectedCourses, isHolistic, setShowTaskForm, assessmentCompetencyId } = props
    const headerclasses = makeHeaderStyles()
    const listClass = makeListStyles()
    const drawerClasses = drawerStyles()
    const theme = useTheme()
    const {dispatch, state} = useContext(ConfigurationContext)

    const [taskName, setTaskName] = useState('')
    const [selectedStandards, setSelectedStandards] = useState({})
    const [selectedCompetencies, setSelectedCompetencies] = useState({})
    const [competencies, setCompetencies] = useState([])
    const [standards, setStandards] = useState([])

    const [showStandardDrawer, setShowStandardDrawer] = useState(false)
    const [showCompetencyDrawer, setshowCompetencyDrawer] = useState(false)

    const [chipColor, setChipColor] = useState({1: 'secondary'})
    const [expandSublist, setExpandSublist] = React.useState({});

    const generateSelectedCompetencies = (baseCompetencies) => {
        return baseCompetencies.length > 0 ?
            baseCompetencies.reduce((obj, key) => {
                obj[key] = true
                return obj
            }, {}) : {}
    }

    const handleTaskNameChange = (event) => {
        setTaskName(event.target.value)
    }

    const handleCancelTask = (event) => {
        setStandards({})
        setSelectedStandards({})
        setTaskName('')
        setCompetencies({})
        setSelectedCompetencies({})
        setShowTaskForm(false)
    }

    const disableSave = () => {
        return (!taskName || Object.keys(standards).length === 0)
    }

    const handleOpenStandardsDrawer = () => {
        setShowStandardDrawer(!showStandardDrawer)
    }

    const handleOpenCompetencyDrawer = () => {
        setshowCompetencyDrawer(!showCompetencyDrawer)
    }

    /**
     * When the user changes the section ID the course standards may change, making the current selection for the open
     * task form invalid.  Once a task has been saved, however, there's no going back!
     *
     * TODO: soon users will select courses for assessments, not sections, and we will filter still based on valid
     * standards for the given courses.  This way we will be able to use the section as a multi-select that will allow the user
     *  to associate/dissociate the section and assessment, but keep the course selection for the assessmet current
     *  When they choose courses for an assessment, the selection won't be able to be changed once tasks are added.
     *  The only sections that will be allowed to be associated will be sections that contain all of those courses.
     *  Otherwise ... BOOM! goes the reporting/ dashboard backend.
     */
    useEffect(() => {
        if (state.available_content_standards) {
            let stan = Object.keys(selectedStandards).filter( standardId => {
                return state.available_content_standards.find( course => {
                    return course.contents.find( content => {
                        return content.standards.find(s => {
                            return `${s.id}` === standardId
                        })
                    })
                })
            })
            if (stan.length === 0) {
                setSelectedStandards({})
                setStandards({})
            } else {
                let newSelection = {}, newChipStandards = {}
                stan.forEach( id => {
                    newSelection[id] = selectedStandards[id]
                    newChipStandards[id] = standards[id]
                })
                setSelectedStandards(newSelection)
                setStandards(newChipStandards)
            }
        }
    }, [state.available_content_standards])

    useEffect(() => {
        if (assessmentCompetencyId && competencies.length > 0) {
            let filtered = competencies.filter(id => `${id}` !== `${assessmentCompetencyId}`)
            setCompetencies(filtered)
            setSelectedCompetencies(generateSelectedCompetencies(filtered))
        }

    },[assessmentCompetencyId])

    const standardRows = () => {
        if (state.available_content_standards && standards) {
            let stan = Array.from(state.available_content_standards).map((course) => {
                return course.contents.map((content) => {
                    return content.standards.filter((standard) => {
                        return standards && (Object.keys(standards).includes(`${standard.id}`) || Object.keys(standards).includes(standard.id))
                    })
                }).flat()
            }).flat()
            let chips = stan.map(standard => {
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
                                           {!isHolistic ? <strong> {standards[standard.id]} </strong> : ''}
                                           {standard.description}
                                       </Typography>
                                    </React.Fragment>
                                }
                                className={classes.chip}
                                color={standards[standard.id] === 'M' ? 'secondary' : standards[standard.id] === 'H' ? 'primary' : 'default'}
                                onClick={() => handleClickChip(standard.id)}
                            />
                            </Tooltip>
                        </div>
                    </Grow>
                )
            })

            if (chips.length > 0 ) {
                return (
                    <Grid item sm={12}>
                        { !isHolistic ?
                            <React.Fragment>
                                <Typography variant={'caption'} style={{paddingLeft: '5px', paddingBottom: '5px'}}>
                                    Click to set the level of difficulty (<b>L</b>ow, <b>M</b>edium
                                    or <b>H</b>igh):</Typography>
                                <br/>
                            </React.Fragment> : ''
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
                        <Typography variant={'caption'}>Selected Competencies:</Typography>
                        <List aria-label={"List of competencies selected for task"}>
                            {com.map(competency =>
                                <Zoom in={true} style={{ transitionDelay: '500ms' }}  key={`list-animation-${competency.id}`}>
                                    <ListItem key={`standard-${competency.id}`} style={{ overflow: 'invisible' }}  >
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

    const handleSaveTask = (event) => {
        let task = { name: taskName.trim(), standards: standards, competencies: competencies, deletable: true }

        dispatch({ type: 'ADD_TASK_TO_CURRENT_ASSESSMENT', task: task })


        setTaskName('')
        setSelectedCompetencies({})
        setSelectedStandards({})
        setStandards({})
        setCompetencies({})
        if (event.target.innerHTML === 'Save') {
            handleCancelTask(event)
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
            setCompetencies(numbered)
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

        if (state.available_content_standards && showStandardDrawer) {
            drawerContent = Array.from(state.available_content_standards).map((course, index) => {
                return (
                    <List
                        key={`list-${index}-${course.id}`}
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
                        {course.contents.map((content, index) => {
                            return (
                                <React.Fragment key={`course-${index}-${course.id}`}>
                                    <ListItem button onClick={() => handleExpandTopic(`${course.id}-${content.id}`)}>
                                        <ListItemText primary={content.name}/>
                                        {expandSublist[`${course.id}-${content.id}`] ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Collapse in={expandSublist[`${course.id}-${content.id}`]} timeout="auto" unmountOnExit>
                                        {content.standards.map((standard, index) => {
                                            return (
                                                <List key={`l-${`${course.id}-${standard.id}`}`} component="div" disablePadding>
                                                    <ListItem button className={classes.nested}
                                                              onChange={handleStandardCheck}>
                                                        <Tooltip title={standard.description} placement={"bottom-start"}>
                                                        <ListItemIcon>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        icon={<StarBorder/>}
                                                                        checkedIcon={<Star/>}
                                                                        value={standard.id}
                                                                        checked={selectedStandards[standard.id] || false}/>}
                                                                label={standard.description}
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
        } else if (state.available_grouped_competencies && showCompetencyDrawer) {
            drawerContent = Array.from(state.available_grouped_competencies).map((course, index) => {
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
                        {course.groups.map((group, index) => {
                            return (
                                <>
                                    <ListItem key={`${course.id}-${group.id}`} button onClick={() => handleExpandTopic(`${course.id}-${group.id}`)}>
                                        <ListItemText primary={group.title}/>
                                        {expandSublist[`${course.id}-${group.id}`] ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Collapse in={expandSublist[`${course.id}-${group.id}`]} timeout="auto" unmountOnExit>
                                        {group.competencies.map((competency, index) => {
                                            const disabled = `${competency.id}` === `${assessmentCompetencyId}`
                                            return (
                                                <List key={`${course.id}-${competency.id}`} component="div" disablePadding>
                                                    <ListItem button className={classes.nested}
                                                              onChange={handleCompetencyCheck}>
                                                        <Tooltip title={competency.description} placement={"bottom-start"}>
                                                        <ListItemIcon>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        disabled={disabled}
                                                                        icon={<TurnedInNot/>}
                                                                        checkedIcon={<TurnedIn/>}
                                                                        value={competency.id}
                                                                        checked={selectedCompetencies[competency.id] || false}/>}
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
                                </>
                            )
                        })}
                    </List>
                )
            })
        }

        return drawerContent
    }

    const noCourses = () => {
        return !selectedCourses || selectedCourses.length === 0
    }
     return (
    <React.Fragment>
        <Paper  elevation={8} className={classes.root} id={'add-task-form'}>
            <FormControl className={''} fullWidth={true}>
                <TextField
                    value={taskName}
                    variant={'outlined'}
                    id={"task-name"}
                    onChange={handleTaskNameChange}
                    label={"Name task / test question"}
                    required
                />
            </FormControl>
            <Grid container spacing={theme.spacing(.5)}>
                {standardRows()}
                <Grid item sm={12}>
                    <Tooltip title={(noCourses()) ? 'Select a course for the assessment in order ' +
                        'to be able to select standards for the assessment\'s tasks.  The courses used in the ' +
                        'selected section determine the standards available' : ''}>
                        <div>
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                                disabled={noCourses()}
                                onClick={handleOpenStandardsDrawer}>
                                Add / Remove Standards
                            </Button>
                        </div>
                    </Tooltip>
                </Grid>
                {competencySection()}
                <Grid item sm={12}>
                    <Tooltip title={!selectedCourses ? 'Select a course for the assessment in order ' +
                        'to be able to select competencies. ' : ''}>
                        <div>
                            <Button
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                                disabled={noCourses()}
                                onClick={handleOpenCompetencyDrawer}>
                                Add / Remove Competencies
                            </Button>
                        </div>
                    </Tooltip>
                </Grid>

                <Grid item sm={12}>
                    <Divider/>
                    <React.Fragment>
                        <Button onClick={handleSaveTask} disabled={disableSave()}>Save</Button>
                        { !isHolistic &&
                            <>
                                <Button onClick={handleSaveTask} disabled={disableSave()}>Save and Create Another</Button>
                                <Button onClick={handleCancelTask} id={"cancel"}>Cancel</Button>
                            </>
                        }
                    </React.Fragment>
                </Grid>
            </Grid>
        </Paper>
        <Drawer
            open={showStandardDrawer || showCompetencyDrawer}
            anchor={"right"}
            onClose={closeDrawer}
            className={drawerClasses.drawer}
            classes={{
                paper: drawerClasses.drawerPaper
            }}
        >
            <Button onClick={closeDrawer}>Done</Button>

            {getDrawerContents()}
        </Drawer>

    </React.Fragment>
    );
}
