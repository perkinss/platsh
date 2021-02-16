import React, {useContext, useEffect, useReducer, useState} from 'react'
import {
    AppBar,
    Chip,
    Container,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Toolbar,
    Typography
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns';
import {useTheme, withStyles} from '@material-ui/core/styles'
import Header from '../Header'
import StudentAssessmentList from "./StudentAssessmentList"
import {ConfigurationContext} from '../../context/ConfigurationContext'
import {configReducer, initialConfigState} from "../../reducers/configurationReducer";
import CircularProgress from "@material-ui/core/CircularProgress";
import RoleValidatingWrapper from "../RoleValidatingWrapper";
import {ROLES} from "../../model/user";
import {RootAuthContext} from "../../context/AuthenticationWrapper";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import 'date-fns';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(1)
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
        padding: theme.spacing(2),
        marginLeft: theme.spacing(1)
    },
    checkbox: {
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(2)
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    sticky: {
        top: theme.spacing(8),
    },
});

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
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

function Observe (props) {
    const { classes } = props
    const { currentUser } = useContext(RootAuthContext);
    const [state, dispatch] = useReducer(configReducer, initialConfigState)

    const [sectionName, setSectionName] = useState('')
    const [filteredStudentName, setFilteredStudentName] = useState([])
    const [filteredStudentList, setFilteredStudentList] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)
    const [selectedAssessment, setSelectedAssessment] = useState(null)
    const [assessmentName, setAssessmentName] = useState([])
    const [assessments, setAssessments] = useState(state.assessments || [])
    const [loadingSections, setLoadingSections] = useState(true)
    const [loadingMarks, setLoadingMarks] = useState(false)
    const [loadingCompetencies, setLoadingCompetencies] = useState(false)
    const [loadingComments, setLoadingComments] = useState(false)
    const [loadingStudents, setLoadingStudents] = useState(false)
    const [loadingAssessments, setLoadingAssessments] = useState(false)
    const [loadingAssessmentStandards, setLoadingAssessmentStandards] = useState(false)
    const [loadingAssessmentCompetencies, setLoadingAssessmentCompetencies] = useState(false)

    const theme = useTheme()

    const handleSelectSection = (event) => {
        setSectionName(event.target.value);
        const section = state.sections.find(section => section.id === event.target.value)
        setSelectedSection(section)
    }

    const handleDateChange = (date) => {
        dispatch({type: 'SET_ASSESSMENT_DATE', assessed_date: date})
    }

    const handleSelectAssessment= (event) => {
        if (assessmentName !== event.target.value) {
            setLoadingMarks(true)
            setLoadingCompetencies(true)
        }

        setAssessmentName(event.target.value)
        const assessment = state.assessments.find(assessment => assessment.id === event.target.value)
        setSelectedAssessment(assessment)
        dispatch({ type: 'SET_CURRENT_ASSESSMENT', assessment: assessment })
    }

    const assessmentList = () => {
        let students = !filteredStudentList || filteredStudentList.length < 1 ? state.students : filteredStudentList
        return (
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <StudentAssessmentList
                    loadingAssessmentCompetencies={loadingAssessmentCompetencies}
                    loadingAssessmentStandards={loadingAssessmentStandards}
                    loadingMarks={loadingMarks}
                    loadingScores={loadingCompetencies}
                    loadingComments={loadingComments}
                    enrolledStudents={students}
                    selectedAssessment={selectedAssessment}
                    classes={classes}/>
            </Grid>
        )

    }

    const handleStudentNameFilter = (event) => {
        setFilteredStudentName(event.target.value)
    }

    const filterStudents = () => {
        let filteredStudents = state.students
        if (filteredStudentName.length > 0) {
            filteredStudents = state.students.filter((student) => {
                return filteredStudentName.includes(student.name)
            })
        }
        setFilteredStudentList(filteredStudents)
    }

    useEffect(() => {
        filterStudents()
    },[filteredStudentName])

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        setLoadingAssessments(true)
        fetch('/api/assessments')
            .then(res => res.json())
            .then(
                (result) => {
                    setLoadingAssessments(false)
                    dispatch({type: 'SET_ASSESSMENTS', assessments: result})
                },
                (error) => {
                    setLoadingAssessments(false)
                    console.log("Error:", error)
                }
            )

        setLoadingSections(true)
        fetch('/api/sections')
            .then(res => res.json())
            .then(
                (result) => {
                    setLoadingSections(false)
                    dispatch({type: 'SET_SECTIONS', sections: result})
                },
                (error) => {
                    setLoadingSections(false)
                    console.log("Error:", error)
                }
            )
    },[]);

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        if (selectedSection){
            setSelectedAssessment(null)
            setAssessmentName('')
            setFilteredStudentList([])
            setFilteredStudentName([])
            setLoadingStudents(true)
            dispatch({type: 'SET_STUDENTS', students: []})
            dispatch({type: 'SET_ASSESSMENT_DATE', assessed_date: null})
            fetch(`/api/students/enrollment/${selectedSection.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoadingStudents(false)
                        dispatch({type: 'SET_STUDENTS', students: result})
                    },
                    (error) => {
                        setLoadingStudents(false)
                        console.log("Error:", error)
                    }
                )
            const sectionAssessments  = state.assessments.filter((assessment) => {
                return assessment.sections.find((assessmentSection) => {
                    return assessmentSection.id === selectedSection.id
                })
            })

            setAssessments(sectionAssessments)
        }
    }, [selectedSection])

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        if (selectedAssessment) {
            setLoadingAssessmentCompetencies(true)
            setLoadingAssessmentStandards(true)
            dispatch({type: 'SET_AVAILABLE_COMPETENCIES', competencies: []})
            dispatch({type: 'SET_AVAILABLE_STANDARDS', standards: []})
            dispatch({type: 'SET_ASSESSMENT_DATE', assessed_date: null})
            fetch(`api/competencies/get_by_assessment/${selectedAssessment.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoadingAssessmentCompetencies(false)
                        dispatch({type: 'SET_AVAILABLE_COMPETENCIES', competencies: result})
                    },
                    (error) => {
                        setLoadingAssessmentCompetencies(false)
                        console.log("Error:", error)
                    }
                )

            fetch(`api/standard/get_all_for_assessment/${selectedAssessment.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        setLoadingAssessmentStandards(false)
                        dispatch({type: 'SET_AVAILABLE_STANDARDS', standards: result})
                    },
                    (error) => {
                        setLoadingAssessmentStandards(false)
                        console.log("Error:", error)
                    }
                )
            setLoadingMarks(true)
            fetch(`api/section/${selectedSection.id}/assessments/${selectedAssessment.id}/marks/list`)
                .then(res => res.json())
                .then(
                    (result) => {
                        dispatch({type: 'SET_MARKS_FROM_FETCHED_OBSERVATIONS', observations: result})
                        dispatch({type: 'SET_ASSESSMENT_DATE', assessed_date: result.assessed_date})
                        setLoadingMarks(false)
                    },
                    (error) => {
                        console.log("Error:", error)
                        setLoadingMarks(false)
                    }
                )
            setLoadingCompetencies(true)
            fetch(`api/section/${selectedSection.id}/assessments/${selectedAssessment.id}/scores/list`)
                .then(res => res.json())
                .then(
                    (result) => {
                        dispatch({type: 'SET_SCORES_FROM_FETCHED_OBSERVATIONS', observations: result})
                        setLoadingCompetencies(false)
                    },
                    (error) => {
                        console.log("Error:", error)
                        setLoadingCompetencies(false)
                    }
                )
            setLoadingComments(true)
            fetch(`api/comments/${selectedAssessment.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        // collect comments into
                        // {studentId: {taskId: comment, taskId: comment}

                        dispatch({type: 'SET_COMMENTS_FROM_FETCH', comments: result})
                        setLoadingComments(false)
                    },
                    (error) => {
                        console.log("Error:", error)
                        setLoadingComments(false)
                    }
                )
        }

    }, [selectedAssessment])

    return (
        <React.Fragment>

            <ConfigurationContext.Provider value={{dispatch: dispatch, state: state}} >

            <Header currentPage={"Observe"}>
                <Container maxWidth={'xl'}>
                        <div className={classes.toolbar} />
                            <RoleValidatingWrapper allowedRoles={[ROLES.TEACHER]}>
                                <AppBar position="sticky" className={classes.sticky}>
                                    <Toolbar>
                                        <Grid container spacing={theme.spacing(1)} >
                                            <> { loadingSections || loadingAssessments ?
                                                <Grid item xs={12} sm={12} md={6} lg={4}>
                                                    <CircularProgress color={"secondary"} />
                                                </Grid>
                                                :
                                                <Grid item xs={12} sm={4} md={3} lg={3}>
                                                    <FormControl className={classes.formControl} fullWidth={true}>
                                                        <InputLabel htmlFor="select-section">Section</InputLabel>
                                                        <Select
                                                            value={sectionName}
                                                            onChange={handleSelectSection}
                                                        >
                                                            {state.sections.map(section => (
                                                                <MenuItem key={section.id} value={section.id}>
                                                                    {section.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            }
                                            </>
                                            <>{
                                                selectedSection ?

                                                    <>{ assessments.length === 0 ?
                                                        <Grid item xs={12} sm={12} md={12} lg={12} style={{paddingTop: 0}}>
                                                            <Typography variant={'body2'}>Hint: You need to add some assessments to this section.</Typography>
                                                        </Grid>
                                                        :
                                                        <Grid item xs={12} sm={4} md={3} lg={3}>
                                                            <FormControl className={classes.formControl} fullWidth={true}>
                                                                <InputLabel htmlFor="select-asmt">Assessment:</InputLabel>
                                                                <Select
                                                                    value={assessmentName || ""}
                                                                    onChange={handleSelectAssessment}
                                                                    input={<Input id="select-asmt"/>}
                                                                >
                                                                    {assessments.map(assessment => (
                                                                        <MenuItem key={assessment.id} value={assessment.id}>
                                                                            {assessment.name}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>

                                                        </Grid>
                                                    }
                                                    </> : ''
                                            }</>
                                            <>
                                                { selectedSection && !loadingAssessments && assessments.length > 0 ?
                                                    <>{ loadingStudents ?
                                                        <Grid item xs={12} sm={6} md={6} lg={4}>
                                                            <CircularProgress color={"secondary"}/>
                                                        </Grid>
                                                        :
                                                        <>
                                                            { state.students.length === 0
                                                                ?
                                                                <Grid item xs={12} sm={12} md={12} lg={12} style={{paddingTop: 0}}>
                                                                    <Typography variant={'body2'}>Hint: You need to add some students to this
                                                                        section before you can assess them.</Typography>
                                                                </Grid>
                                                                :
                                                                <Grid item xs={12} sm={4} md={3} lg={3}>
                                                                    <FormControl className={classes.formControl} fullWidth={true}>
                                                                        <InputLabel htmlFor="select-multiple-chip">Filter Students</InputLabel>
                                                                        <Select
                                                                            multiple
                                                                            value={filteredStudentName}
                                                                            onChange={handleStudentNameFilter}
                                                                            input={<Input id="select-multiple-chip"/>}
                                                                            renderValue={selected => (
                                                                                <div className={classes.chips}>
                                                                                    {selected.map(value => (
                                                                                        <Chip key={value} label={value}
                                                                                              className={classes.chip}/>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            MenuProps={MenuProps}
                                                                        >
                                                                            {state.students.map(student => (
                                                                                <MenuItem key={student.id} value={student.name}
                                                                                          style={getStyles(student.name, filteredStudentName, theme)}>
                                                                                    {student.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                            }</>
                                                    }</>
                                                    : ''}</>
                                            <>
                                                {selectedSection && !loadingAssessments && assessments.length > 0 ?
                                                    <>{loadingStudents ?
                                                        <Grid item xs={12} sm={4} md={3} lg={2}>
                                                            <CircularProgress color={"secondary"}/>
                                                        </Grid>
                                                        :
                                                        <>
                                                            {state.students.length === 0
                                                                ?
                                                                ''
                                                                :
                                                                <Grid item xs={12} sm={4} md={3} lg={3}>
                                                                    <MuiPickersUtilsProvider classes={classes.formControl} utils={DateFnsUtils}>
                                                                        <KeyboardDatePicker
                                                                            disableToolbar
                                                                            variant={'inline'}
                                                                            format={'MMMM dd, yyyy'}
                                                                            margin={'normal'}
                                                                            fullWidth={true}
                                                                            style={{marginTop: '0'}}
                                                                            label={'Assessment Date'}
                                                                            value={state.assessed_date}
                                                                            onChange={handleDateChange}
                                                                            KeyboardButtonProps={{
                                                                                'aria-label' : 'assessment date',
                                                                            }}
                                                                        />
                                                                    </MuiPickersUtilsProvider>
                                                                </Grid>
                                                            }
                                                        </>
                                                    }</>
                                                    :
                                                    ''
                                                }
                                                </>
                                        </Grid>
                                    </Toolbar>
                                </AppBar>

                                {selectedAssessment && state.student_marks && state.comments && state.student_competencies && assessmentList()}
                            </RoleValidatingWrapper>
                </Container>
            </Header>
            </ConfigurationContext.Provider>
        </React.Fragment>

    );

}
export default withStyles(styles)(Observe);