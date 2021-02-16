import React, { useState, useEffect, useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMoreRounded'
import ExpandLess from '@material-ui/icons/ExpandLessRounded'
import { FormControl, MenuItem, Button, InputLabel, Select, Chip, ListItemIcon, Checkbox, FormControlLabel, ListSubheader,
        Input, Divider, Typography, TextField, List, ListItem, Drawer, ListItemText, Paper, Tooltip, Collapse } from '@material-ui/core'
import classnames from "classnames";
import {ConfigurationContext} from "../../context/ConfigurationContext";
import StandardsList from './StandardsList'
import {Fade} from "@material-ui/core/index";
import {extractFirstName, getPreferredName} from "../../helpers/name_helper";

const grades = [
    '12', '11','10', '9', '8','7','6', '5', '4',  '3', '2', '1', 'K',
]

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

function CourseSectionForm(props) {
    const { setShowForm, setShowSnackbar } = props
    const classes = useStyles()
    const theme = useTheme()

    // shared configuration state:
    const {dispatch, state} = useContext(ConfigurationContext)
    let selectedSection = state.selected_section

    const [selectedStudents, setSelectedStudents] = useState(state.students.reduce((obj, student) => {
        obj[student.id] = false;
        return obj
    },{}))

    // form local state:
    const [gradeName, setGradeName] = useState([]);
    const [subjectName, setSubjectName] = useState([]);
    const [courseName, setCourseName] = useState([]);
    const [sectionName, setSectionName] = useState("");
    const [courseList, setCourseList] = useState([])
    const [filteredCourses, setFilteredCourses] = useState(courseList)
    const [showStudentDrawer, setShowStudentDrawer] = useState(false)
    const [subjects, setSubjects] = useState([])
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [expandSublist, setExpandSublist] = useState({})

    const handleGradeChange = (event) =>{
        setGradeName(event.target.value)
    }

    const filterCourses = () => {
        let filteredList = courseList
        if (subjectName.length > 0) {
            filteredList = courseList.filter((course) => {
                return subjectName.includes(course.subject)
            })
        }
        if (gradeName.length > 0) {
            filteredList = filteredList.filter((course) => {
                return gradeName.includes(course.grade)
            })
        }
        setCourseName([])
        setFilteredCourses(filteredList)
    }

    const handleSubjectChange = (event, element) =>{
        setSubjectName(event.target.value)
    }

    const handleCourseChange = (event) => {
        setUnsavedChanges(true)
        setCourseName(event.target.value );
    };

    const handleNameChange = (event) => {
        setUnsavedChanges(true)
        setSectionName(event.target.value );
    };

    const handleBlurSection = (event) => {
        setUnsavedChanges(true)
        setSectionName(event.target.value.trim())
    }

    const handleCancel = (event) => {
        setShowForm(false)
        setUnsavedChanges(false)
        dispatch({type: "SET_SELECTED_SECTION", section: null})
    }

    const handleExpandGrade = (grade) => {
        if (expandSublist[grade]) {
            setExpandSublist({...expandSublist, [grade]: false})
        } else {
            setExpandSublist({...expandSublist, [grade]: true})
        }
    }

    useEffect(()=> {
        if (selectedSection) {
            fetch(`api/standard/getAllForSection/${selectedSection.id}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        dispatch({type: 'SET_AVAILABLE_STANDARDS', standards: result})
                    },
                    (error) => {
                        console.log("Error:", error)
                    }
                )
            setFilteredCourses(selectedSection.courses.map(course => course.title))
            setSectionName(selectedSection.name)
            setCourseName(selectedSection.courses.map(course => course.title))

            let studentIds = selectedSection.students.map( student => student.id )
            const selected = state.students.reduce((obj, student) => {
                obj[student.id] = studentIds.includes(student.id);
                return obj
            },{})
            setSelectedStudents(selected)
            let courseOptions = selectedSection.courses.map((course) =>{
                return { value: course.id, label: course.title, subject: course.subject, grade: course.grade };
            })
            setCourseList(courseOptions)
            setFilteredCourses(courseOptions)
            setUnsavedChanges(false)
        }
     }, [state.selected_section] )

    useEffect(() => {
        fetch('/api/courses')
            .then(res => res.json())
            .then(
                (result) => {
                    let courseOptions = result.map((course) =>{
                        return { value: course.id, label: course.title, subject: course.subject, grade: course.grade };
                    })
                    let courseSubjects = result.map( course => course.subject ).filter( (value, index, self) => self.indexOf(value) === index)
                    setCourseList(courseOptions)
                    setFilteredCourses(courseOptions)
                    setSubjects(courseSubjects)
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    useEffect(() => {
        !selectedSection && filterCourses()
    },[gradeName, subjectName])

    const saveSection  = () => {

        let studentIds = Object.keys(selectedStudents).filter(key => selectedStudents[key])
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let url = '/api/sections/new'
        if (selectedSection) {
            url = `api/sections/${selectedSection.id}`
        }
        let body = JSON.stringify({name: sectionName, courses: courseName, students: studentIds, authenticity_token: token})
        fetch(url,
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
               setUnsavedChanges(false)
               dispatch({type: selectedSection ? 'UPDATE_SECTION' : 'ADD_SECTION', section:response})
               dispatch({type: 'CLEAR_SELECTED_SECTION'})
               setShowForm(false)
           })
           .catch(error => {
               setShowSnackbar({open:true,variant:"error",message:"Unable to save section"})
               console.log("ERROR: ", error)
           })
    }

    const disableCourseList = () => {
        return filteredCourses.length === 0
    }

    const closeDrawer = (event) => {
        if (showStudentDrawer) {

        }
        setShowStudentDrawer(!showStudentDrawer)
    }

    const handleOpenStudentDrawer = () => {
        setShowStudentDrawer(!showStudentDrawer)
    }

    const handleUserCheck = (event, value) => {
        setUnsavedChanges(true)
        setSelectedStudents({...selectedStudents, [event.target.value]: value})
    }

    const selectedStudentNames = () => {
        let students = state.students.filter(student => selectedStudents[student.id] )
        return students.reduce((object, student)=> {
            return object ? object + ", "+ getPreferredName(student) : getPreferredName(student)
        }, '')
    }

    const saveShouldBeDisabled = () => {
        return !sectionName || !courseName || courseName.length === 0 || !unsavedChanges
    }

    const enrollees = () => {
       return (
           <Paper className={classes.paper} onClick={handleOpenStudentDrawer}>
               <Typography variant={"h6"}>Enrolled Students</Typography>
                    <Typography>
                        {selectedStudentNames()}
                    </Typography>
            </Paper>
       )
    }

    const getNumberForGrade = (grade) => {
        const numeric = Number.parseInt(grade)
        if (Number.isInteger(numeric)) {
            return numeric
        }
        else if (grade === 'K') {
            return 0
        }
        return -1
    }

    const enrollmentDrawer = () => {

        if (showStudentDrawer) {
            const studentsByGrade = Object.entries(state.students.reduce((result, student) => {
                const grade = student.grade || "not set"
                if (!result[grade]) {
                    result[grade] = []
                }
                result[grade].push(student)
                return result
            }, {}))
            studentsByGrade.sort((a, b) => getNumberForGrade(b[0]) - getNumberForGrade(a[0]))

            return (
                <div className={classes.list}>
                    <Drawer open={showStudentDrawer} anchor={"right"} onClose={closeDrawer}>
                        <Button onClick={closeDrawer}>Done</Button>
                        <List>
                            {
                                studentsByGrade.map(([grade, students]) => {
                                    return (
                                        <React.Fragment key={grade}>
                                            <ListItem button onClick={() => handleExpandGrade(grade)}>
                                                <ListItemText primary={`Grade ${grade}`}/>
                                                {expandSublist[grade] ? <ExpandLess/> : <ExpandMore/>}
                                            </ListItem>
                                            <Collapse in={expandSublist[grade]} timeout="auto" unmountOnExit>
                                                <List key={`l-${grade}`} component="div" disablePadding>
                                                    {students.map((student) => {
                                                        return (
                                                            <Tooltip placement={'left'} key={`tooltip-${student.id}`} title={student.unique_id}
                                                                     TransitionComponent={Fade} TransitionProps={{timeout: 600}}>
                                                                <ListItem button key={student.id}>
                                                                    <ListItemIcon>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={selectedStudents[student.id] || false}
                                                                                    tabIndex={-1}
                                                                                    onChange={handleUserCheck}
                                                                                    value={student.id}
                                                                                />
                                                                            }
                                                                            label={student.name}
                                                                        />
                                                                    </ListItemIcon>
                                                                </ListItem>
                                                            </Tooltip>
                                                        )
                                                    })}
                                                </List>
                                            </Collapse>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </List>
                    </Drawer>
                </div>
            )
        }
    }

    const canEditCourse = !state.selected_section ||
        (state.selected_section && state.selected_section.assessments && state.selected_section.assessments.length !== 0)

    let courseNameList = ''
    if (state.selected_section ) {
        courseNameList = state.selected_section.courses.reduce((list, c) => { return list ? list + ", " + c.title : c.title }, '')
    } else {
        courseNameList = courseName
    }

    return (
        <React.Fragment>
            <br/>
            <Typography variant={'h6'}>
                <TextField
                    id={'section-name'}
                    fullWidth={true}
                    className={classnames(classes.margin, classes.textField)}
                    variant="outlined"
                    label="Section name"
                    name={"section"}
                    value={sectionName}
                    onChange={handleNameChange}
                    onBlur={handleBlurSection}
                >
                </TextField>
            </Typography>
            {!state.selected_section && <FormControl className={classes.formControl} >
                <InputLabel htmlFor="select-multiple-chip">Filter Courses by Grade</InputLabel>
                <Select
                    multiple
                    value={gradeName}
                    onChange={handleGradeChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip key={value} label={value} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {grades.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name, gradeName, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>}
            {!state.selected_section && <FormControl className={classes.formControl} >
                <InputLabel htmlFor="select-multiple-chip">Filter Courses by Subject</InputLabel>
                <Select
                    multiple

                    value={subjectName}
                    onChange={handleSubjectChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip key={value} label={value} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {subjects.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name, subjectName, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>}

            {canEditCourse && <FormControl className={classes.formControl} fullWidth={true}>
                <InputLabel htmlFor="select-multiple-chip">Select Courses</InputLabel>
                <Select
                    multiple
                    value={courseName}
                    onChange={handleCourseChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map((value, index) => (
                                <Chip key={index} label={value} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                    disabled={disableCourseList()}
                >
                    {Array.from(filteredCourses).map((course, index) => {
                        return (<MenuItem key={course.value} value={course.label}
                                  style={getStyles(course.label, courseName, theme)}>
                            {course.label}
                        </MenuItem>)
                    })}
                </Select>
            </FormControl>}
            <Typography>{courseNameList}</Typography>


            <br/><br/>
            <Divider />
            {enrollmentDrawer()}
            <Divider />
            {enrollees()}
            <br/>
            <Button variant="contained" color="primary" className={classes.button} onClick={saveSection} disabled={saveShouldBeDisabled()}>
                Save
            </Button>
            <Button variant="contained" color="secondary" className={classes.button} onClick={handleCancel} >
                Cancel
            </Button>
            <Button variant="contained" variant="outlined" color="secondary" className={classes.button} onClick={handleOpenStudentDrawer}>
                Add / Remove Students
            </Button>
            <Divider/>
            <StandardsList classes={classes} />
        </React.Fragment>
    );
}
export default CourseSectionForm
