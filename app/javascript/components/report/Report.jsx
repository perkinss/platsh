import React, { useState, useReducer, useEffect, useContext }  from 'react'
import {
    Paper,
    Container,
    Grid,
    MenuItem,
    IconButton,
    Tooltip,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ListItem,
    ListItemIcon,
    FormControlLabel, Checkbox, List, ListSubheader, Divider, makeStyles, SwipeableDrawer, ListItemText, Collapse,
} from '@material-ui/core'
import { withStyles, useTheme } from '@material-ui/core/styles'
import { ChevronRight, ExpandMore, MoreHorizRounded } from "@material-ui/icons";
import Header from '../Header'
import TeachersStudentReport from './TeachersStudentReport'
import StudentSectionReport from './StudentSectionReport'
import SectionReportOverview from "./SectionReportOverview";
import RoleValidatingWrapper from "../RoleValidatingWrapper";
import ReportGenerator from "./ReportGenerator";
import SectionSelect from "../common/SectionSelect";
import StudentSelect from "../common/StudentSelect";
import ReportPeriodSelect from "../common/ReportPeriodSelect";
import DateRangeSection from "../common/DateRangeSection";
import {RootAuthContext} from "../../context/AuthenticationWrapper";
import {ROLES} from "../../model/user";
import {initialReportsState, reportsReducer} from "../../reducers/reportsReducer";
import {ReportsContext} from '../../context/ReportsContext'
import {
    fetchSections,
    fetchStudents,
    fetchAllStudentReportData,
    fetchAllSectionReportData,
    fetchReportingPeriods, fetchSectionsTopics
} from '../../api/reportApi'
import Menu from "@material-ui/core/Menu";
import Card from "@material-ui/core/Card";

const makeListHeaderStyles =  makeStyles(theme => ({
    root: {
        background: theme.palette.primary.dark,
        opacity: '.8',
        fontSize: '2em',
        width: '100%'
    },

}))


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: window.innerWidth < 900 ? theme.spacing(1) : theme.spacing(4),
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
    tabs: {
        padding: theme.spacing(9,0,1,9),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
        maxWidth: '94%'
    },
    card: {
        padding: theme.spacing(4),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    title: {
        textAlign: 'center'
    },
    textField: {
        flexBasis: 600,
        width: '70%'
    },
    margin: {
        margin: theme.spacing(1),
    },
    fab: {
        margin: theme.spacing(1)
    },
    snackbar: {
        backgroundColor: theme.palette.primary.dark
    },
    success: {
        backgroundColor: theme.palette.primary.dark,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'pre-wrap',
        color: theme.palette.grey[300],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    filterButton: {
        marginTop: theme.spacing(1)
    }
});

function Report (props) {
    const { classes, testState } = props
    let [state, dispatch] = useReducer(reportsReducer, initialReportsState, () => initialReportsState )
    const { currentUser } = useContext(RootAuthContext);
    state = testState || state
    const theme = useTheme()

    const [reportName, setReportName] = useState('')
    return (
        <React.Fragment>
            <ReportsContext.Provider value={{dispatch: dispatch, state: state}} >
            <Header currentPage={"Section and Student Reports"} headerTitle={reportName || 'Section and Student Reports'}>
            <Container maxWidth={'lg'} spacing={theme.spacing(2)} className={classes.content}>
                    <div className={classes.toolbar} />
                    <RoleValidatingWrapper allowedRoles={[ROLES.TEACHER, ROLES.STUDENT]}>
                        {
                            currentUser.isStudent()
                                ?
                                <StudentReports state={state} dispatch={dispatch} classes={classes} setReportName={setReportName} />
                                :
                                <TeacherReports
                                    classes={classes}
                                    state={state}
                                    dispatch={dispatch}
                                    setReportName={setReportName}
                                />
                        }
                    </RoleValidatingWrapper>
            </Container>
            </Header>
            </ReportsContext.Provider>
        </React.Fragment>
    );
}

function TeacherReports(props) {
    const { currentUser } = useContext(RootAuthContext);
    if (!currentUser.isTeacher()) {
        return null
    }

    const { state, dispatch } = useContext(ReportsContext)
    const { classes , setReportName } = props
    const listHeaderClasses = makeListHeaderStyles()

    const [sectionName, setSectionName] = useState('')
    const [studentName, setStudentName] = useState('')
    const [barHeight, setBarHeight] = useState(50)
    const [loading, setLoading] = useState(true)
    const [reportingConfigLoading, setReportingConfigLoading] = useState(true)
    const [studentsLoading, setStudentsLoading] = useState(false)
    const [showGenerator, setShowGenerator] = useState(false)
    const [toDate, setToDate] = useState(null)
    const [fromDate, setFromDate] = useState(null)
    const [selectedReportingPeriod, setSelectedReportingPeriod] = useState(null)
    const [selectedTopics, setSelectedTopics] = useState([])
    const [expanded, setExpanded] = useState('');
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [topicsDrawerOpen, setTopicsDrawerOpen] = React.useState(false);

    const handleExpandPanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleCloseMenu = (e)  => {
        setAnchorEl(null)
    }

    const handleOpenMenu = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleShowGenerator = (e) => {
        handleCloseMenu(e)
        setShowGenerator(!showGenerator);
    }

    const handleSelectSection = (event) => {
        setShowGenerator(false)
        setSectionName(event.target.value);
        const section = state.sections.find(section => section.id === event.target.value)
        dispatch({type: 'SET_SELECTED_SECTION', section: section})
        setReportName(`Overview for ${section.name}`)
        const nStudents = section.students.length
        if (nStudents < 2) {
            setBarHeight(220)
        } else if (nStudents < 3) {
            setBarHeight(150)
        } else if (nStudents < 5) {
            setBarHeight(100)
        } else if (nStudents < 7) {
            setBarHeight(70)
        }
    }

    const handleSelectStudent = (event) => {
        if (event.target.value) {
            let student = state.students.find(student => student.id === event.target.value)
            setStudentName(event.target.value);
            setReportName(`Report for ${student.name} - ${state.selected_section.name}`)
            dispatch({ type: 'SET_SELECTED_STUDENT', student: student })
        } else {
            clearStudent()
        }
    }

    const handleSelectReportConfig = (event) => {
        setSelectedReportingPeriod(event.target.value)
    }

    const clearReportingPeriod = () => {
        setSelectedReportingPeriod(null)
    }

    const handleSelectTopic = (e, selected) => {
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

    /**
     * Run filter re-runs the required data queries with the selected parameters, such as a date range or group of topics
     *
     * @param e - the event for the button click
     * @param from - the currently selected from date
     * @param to - the currently selected to date
     *
     */
    const runFilter = (e, from, to, topics) => {
        if (sectionName) {
            setExpanded(false)
            if (studentName) {
                fetchAllStudentReportData(dispatch, state, from, to, topics)
            } else {
                fetchAllSectionReportData(dispatch, state, from, to, topics)
            }
        }
    }

    // This effect loads the period data into selectedTopics, fromDate, and toDate when a reporting period is selected
    useEffect(() => {
        if (selectedReportingPeriod) {
            const period = state.reporting_periods.find(p => p.id === selectedReportingPeriod)
            setSelectedTopics(period.contents.map(topic => `${topic.id}`))
            let start, end = ''
            if (period.period_start) {
                start = new Date(period.period_start)
            }
            if (period.period_end) {
                end = new Date(period.period_end)
            }
            setFromDate(start)
            setToDate(end)
        }
    },[selectedReportingPeriod])

    /**
     * This effect loads the reporting periods when the generator is first opened
     */
    useEffect(() => {
        if (state.selected_section) {
            fetchReportingPeriods(dispatch, state, setReportingConfigLoading)
            // TODO: manual topic selection in filter section
            fetchSectionsTopics(dispatch, state)
        }
    },[state.selected_section])

    // Effect to get the teacher's sections on page load
    useEffect(() => {
        fetchSections(dispatch, setLoading)
    },[]);

    // Effect to set the page to not loading after the sections have been set in state, and not before.
    useEffect(() => {
        if (state.sections && !loading) {
            setLoading(false)
        }
    }, [state.sections])

    // Effect to fetch students for selected section
    useEffect(() => {
        if (state.selected_section) {
            clearStudent()
            fetchStudents(dispatch, state, setStudentsLoading)
            fetchReportingPeriods(dispatch, state, setReportingConfigLoading)
            setSelectedReportingPeriod(null)
            setSelectedTopics([])
            setFromDate(null)
            setToDate(null)
            setExpanded(false)
        }
    },[state.selected_section]);

    const clearStudent = () => {
        dispatch({ type: 'SET_SELECTED_STUDENT', student: null})
        setStudentName('')
    }

    const closeGenerator = () => {
        setShowGenerator(false)
    }

    const handleClearFilter = (e) => {
        setSelectedReportingPeriod(null)
        setFromDate(null)
        setToDate(null)
        setSelectedTopics(null)
        runFilter(e,null, null, null)
    }

    const shouldShowSummary = () => {
        return !showGenerator && !fullDataSet
    }

    const fullDataSet = !fromDate && !toDate && !(selectedTopics && selectedTopics.length > 0)

    const applyButtonShouldBeDisabled = () => {
        // they have not selected anything √
        // they have cleared the data √
        // they have selected something and then clicked the button, and the data
        //  is still loading or has loaded (TODO include filter params in state)
        // data has not yet returned from the initial search
        // data has returned from the latest search
        return (!toDate && !fromDate && !(selectedTopics && selectedTopics.length > 0))
    }

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setTopicsDrawerOpen(open)
    }

    const getTopicsDrawerList = () => {

        return state.section_topics?.map((course, index) => {
            return (
                course.contents.map((topic, index) => {
                    return (
                        <List key={`l-${course.id}-${topic.id}`} component="div" disablePadding>
                            <ListItem button>
                                <Tooltip title={topic.description || topic.name } placement={"bottom-start"}>
                                    <ListItemIcon>
                                        <FormControlLabel
                                            control={getCheckbox(topic, selectedTopics)}
                                            label={topic.name}
                                        />
                                    </ListItemIcon>
                                </Tooltip>
                            </ListItem>
                        </List>
                    )
                })
            )
        });
    }

    const getCheckbox = (topic, selected) => {
        return (
            <Checkbox
                onChange={handleSelectTopic}
                name={topic.name}
                value={topic.id}
                checked={selected.includes(`${topic.id}`) || false}
            />
        )
    }

    // render the competency selection drawer:
    const topicDrawer = () => {
        if (topicsDrawerOpen && state.section_topics.length > 0) {
            return (
                state.section_topics.map( (course, index) => {
                    return (
                        <List
                            key={`topics-${index}`}
                            component="div"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    inset={true}
                                    classes={listHeaderClasses}
                                    className={listHeaderClasses.root}
                                    styles={{opacity: 1}}
                                    id="nested-list-subheader">
                                    {course.title}
                                </ListSubheader>
                            }
                            className={classes.root}
                        >
                            <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                { getTopicsDrawerList() }
                            </div>
                        </List>
                    )
                })
            )
        }
    }

    const getTopicsListing = () => {
        const allTopics = []
        state.section_topics.forEach((course) => {
            allTopics.push(...course.contents)
        })
        if (selectedTopics.length > 0) {
            return selectedTopics.reduce((list, topicId) =>{
                let topic = allTopics.find((t) => {
                    return `${t.id}` === `${topicId}`
                })

                return list ? list + ' \u25ca ' + topic?.name : topic?.name
            },'')
        } else {
            return ''
        }
    }

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={2} alignContent={'space-between'} alignItems={'flex-start'}>
                <Grid item xs={11} xl={11}>
                    <Grid container spacing={4} alignContent={'space-between'} alignItems={'flex-start'}>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <SectionSelect
                                loading={loading}
                                sectionName={sectionName}
                                handleSelectSection={handleSelectSection}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            {state.selected_section &&
                            <StudentSelect
                                classes={classes}
                                studentName={studentName}
                                handleSelectStudent={handleSelectStudent}
                                loading={studentsLoading}
                            />
                            }
                        </Grid>
                    </Grid>
                </Grid>
                {state.selected_section &&
                <Grid item xs={1} xl={1}>
                    <IconButton
                        onClick={handleOpenMenu}
                    >
                        <MoreHorizRounded />
                    </IconButton>
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        keepMounted
                        onClose={handleCloseMenu}
                    >
                        <MenuItem
                            selected={false}
                            onClick={handleShowGenerator}
                        >{showGenerator ? "Hide" : " Show"} Generator Section</MenuItem>
                    </Menu>
                </Grid>}
                {state.selected_section &&
                <>
                    <Grid item xs={12} xl={12} style={{marginTop: '10px' }}>
                        <Accordion expanded={expanded === 'panel1' || showGenerator} onChange={handleExpandPanel('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>
                                    { showGenerator ? 'Select Reporting Period and Student' : 'Filter data ... '}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    {state.reporting_periods &&
                                        <ReportPeriodSelect
                                            selectedReportingPeriod={selectedReportingPeriod}
                                            handleSelectReportingPeriod={handleSelectReportConfig}
                                            reportingPeriods={state.reporting_periods}
                                            formControlClass={classes.formControl}
                                            reportingConfigLoading={reportingConfigLoading}
                                            sectionName={state.selected_section.name}
                                        />
                                    }
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                        <DateRangeSection
                                            fromDate={fromDate}
                                            toDate={toDate}
                                            setFromDate={setFromDate}
                                            setToDate={setToDate}
                                            callback={clearReportingPeriod}
                                        />
                                    </Grid>
                                    {sectionName && state.section_topics &&
                                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                            <div >
                                                <Button
                                                    variant={'outlined'}
                                                    name={'competencyReport'}
                                                    onClick={toggleDrawer(true)}
                                                    fullWidth={true}
                                                >
                                                    Select Topics
                                                </Button>
                                                <SwipeableDrawer
                                                    anchor={'right'}
                                                    open={topicsDrawerOpen}
                                                    onClose={toggleDrawer(false)}
                                                    onOpen={toggleDrawer(true)}
                                                    classes={{
                                                        paper: classes.drawerPaper
                                                    }}
                                                    className={classes.drawer}
                                                >
                                                    {topicDrawer()}
                                                </SwipeableDrawer>
                                            </div>
                                        </Grid>}
                                    <Grid item xs={12} xl={12} >
                                        <Grid container spacing={4} justify={"flex-end"}>
                                            <Grid item xs={12} s={6} md={3} lg={2} xl={2} >
                                                <Tooltip  title={"Run report with applied filters"}>
                                                <span>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={(e) => runFilter(e,fromDate, toDate, selectedTopics)}
                                                        endIcon={<ChevronRight />}
                                                        disabled={applyButtonShouldBeDisabled()}
                                                        fullWidth={true}
                                                        className={classes.filterButton}
                                                    >
                                                       Apply
                                                    </Button>
                                                </span>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={12} s={6} md={3} lg={2} xl={2} >
                                                <Tooltip  title={"Clear filters and run report"}>
                                            <span>
                                                <Button
                                                    variant={"outlined"}
                                                    onClick={handleClearFilter}
                                                    endIcon={<ChevronRight />}
                                                    disabled={!toDate && !fromDate && !(selectedTopics && selectedTopics.length > 0)}
                                                    fullWidth={true}
                                                    className={classes.filterButton}
                                                >
                                                   Clear
                                                </Button>
                                            </span>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        { shouldShowSummary() &&
                        <Card className={classes.card}>
                            <>
                                <Typography variant={'body2'} align={"left"}>
                                    Displaying data
                                    { fromDate ? ` from ${fromDate.toDateString()}` : '' }
                                    { toDate ? ` up to  ${toDate.toDateString()}` : '' }
                                </Typography>
                                {(selectedTopics && selectedTopics.length > 0 && state.section_topics.length > 0) &&
                                <Typography variant={'body2'} align={'left'}>
                                    Topics:   {getTopicsListing()}
                                </Typography>
                                }
                        </>
                        </Card>}
                    </Grid>
                </>
                }
                {state.selected_section && !state.selected_student &&
                <Grid item xs={12} xl={12} >
                     <SectionReportOverview
                         section={state.selected_section}
                         classes={classes}
                         barHeight={barHeight}
                         hide={showGenerator}
                         fromDate={fromDate}
                         toDate={toDate}
                     />
                </Grid>
                }
                {(state.selected_student || state.selected_section) &&
                <Grid item xs={12} xl={12}>
                    <ReportGenerator
                        student={state.selected_student}
                        section={state.selected_section}
                        showGenerator={showGenerator}
                        closeGenerator={closeGenerator}
                        fromDate={fromDate}
                        toDate={toDate}
                        selectedTopics={selectedTopics}
                    />
                </Grid>
                }
                {state.selected_student &&
                    <Grid item xs={12} xl={12}>
                        <TeachersStudentReport
                            classes={classes}
                            student={state.selected_student}
                            section={state.selected_section}
                            clearStudent={clearStudent}
                            teacher={true}
                            hide={showGenerator}
                            fromDate={fromDate}
                            toDate={toDate}
                        />
                    </Grid>
                }
            </Grid>
        </Paper>
    );
}

function StudentReports(props) {
    const { currentUser } = useContext(RootAuthContext);
    if (!currentUser.isStudent()) {
        return null
    }

    // TODO: set the report name in the title for the student-view of the report
    const { classes, dispatch, state, setReportName } = props
    const [userStudents, setUserStudents] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)
    const [loading, setLoading] = useState(false)
    const [toDate, setToDate] = useState(null)
    const [fromDate, setFromDate] = useState(null)

    const loadSectionData = (sectiondata) => {
        dispatch({ type: 'SET_SECTIONS', sections: sectiondata})
    }

    const autoSelectStudent = (section, availableStudents) => {
        if (!section || !availableStudents) {
            dispatch({ type: 'SET_SELECTED_STUDENT', student: null})
            return
        }

        const sectionStudents = availableStudents.filter((student) => section.students.map((stu) => stu.id).includes(student.id))
        dispatch({ type: 'SET_SELECTED_STUDENT', student: sectionStudents[0]})
    }

    const handleSelectSection = (event) => {
        const section = state.sections.find(section => section.id === event.target.value)
        setSelectedSection(section)
        dispatch({ type: 'SET_SELECTED_SECTION', section: section })
        autoSelectStudent(section, userStudents)
    }

    useEffect(() => {
        setLoading(true)
        fetch('/api/sections/student')
            .then(res => res.json())
            .then(
                (result) => {
                    loadSectionData(result)
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
            .finally(() => { setLoading(false) })
    },[]);

    useEffect(() => {
        fetch(`api/students/list/student`)
            .then(res => res.json())
            .then(
                (result) => {
                    setUserStudents(result)
                    setReportName(`Report for ${result[0].preferred_name}`)
                    autoSelectStudent(selectedSection, result)
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    const runFilter = (e) => {
        if (state.selected_section) {
            fetchAllStudentReportData(dispatch, state, fromDate, toDate)
        }
    }

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={4} alignContent={'space-between'} alignItems={'flex-start'}>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <SectionSelect
                        loading={loading}
                        sectionName={selectedSection ? selectedSection.id : ''}
                        handleSelectSection={handleSelectSection}
                        isStudent={true}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
                    <Grid container >
                        <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                            <DateRangeSection
                                fromDate={fromDate}
                                toDate={toDate}
                                setFromDate={setFromDate}
                                setToDate={setToDate}
                            />
                        </Grid>
                        <Grid item xs={2} lg={2} xl={1} >
                            <Tooltip  title={"Run report with applied filters"}>
                            <span>
                                <Button
                                    variant={"contained"}
                                    color={"secondary"}
                                    onClick={runFilter}
                                    endIcon={<ChevronRight />}
                                    disabled={!toDate && !fromDate}
                                    fullWidth={true}
                                    className={classes.filterButton}
                                >
                                   Filter
                                </Button>
                            </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                {!loading && state.selected_student && state.selected_section &&
                <Grid item xs={12} xl={12}>
                    <StudentSectionReport
                        classes={classes}
                        student={state.selected_student}
                        section={selectedSection}
                        teacher={false}
                        fromDate={fromDate}
                        toDate={toDate}
                    />
                </Grid>
                }
            </Grid>
        </Paper>
    )
}

export default withStyles(styles)(Report);