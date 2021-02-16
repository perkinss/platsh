import React, { useState , useEffect, useContext } from 'react'
import { Typography, Fab, Paper, Chip, Tooltip, InputLabel, Select, Input, MenuItem, FormControl, Grid, TextField
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddRounded'
import StudentForm from "./StudentForm"
import {ConfigurationContext} from "../../context/ConfigurationContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {getPreferredName} from "../../helpers/name_helper";

const useStyles =  makeStyles(theme => ({
    studentList: {
        padding: theme.spacing(8),
        margin: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(1)
    }
}))

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
const grades = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'K']

export default function ConfigureStudents(props) {
    let { setShowSnackbar, classes } = props;
    classes = {...classes, ...useStyles()}
    const {state, dispatch} = useContext(ConfigurationContext)

    const [showForm, setShowForm] = useState(false)
    const [schools, setSchools] = useState([])
    const [schoolFilter, setSchoolFilter] = useState([])
    const [gradeFilter, setGradeFilter] = useState([])
    const [filteredStudents, setFilteredStudents] = useState(state.students)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStudent, setSelectedStudent] = useState('')
    const theme = useTheme()

    const handleClickPlus = (event) => {
        setShowForm(!showForm)
    }

    useEffect(() => {
        fetch(`api/schools/get_for_user`)
                .then(res => res.json())
                .then( (result) => {
                    setSchools(result)
                })

    }, [])

    useEffect(() => {
        filterStudents()
    }, [schoolFilter, state.students, gradeFilter, searchTerm])

    const handleSelectStudent = (student) => {
        setSelectedStudent(student)
        setShowForm(true)
    }

    const handleCancel = () => {
        setSelectedStudent({})
        setShowForm(false)
    }

    const filterStudents = () => {
        let filteredList = state.students
        if (schoolFilter.length > 0) {
            const schoolIds = schoolFilter.map( school => school.id)
            filteredList = state.students.filter( student => schoolIds.includes(student.school))
        }
        if (gradeFilter.length > 0) {
            filteredList = filteredList.filter( student => gradeFilter.includes(student.grade))
        }
        if (searchTerm.length > 0) {
            filteredList = filteredList.filter( student => {
                return student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.unique_id.toLowerCase().includes(searchTerm.toLowerCase())
            })
        }
        setFilteredStudents(filteredList)
    }

    const handleSchoolFilter = (event) => {
        setSchoolFilter(event.target.value)
    }

    const handleGradeFilter = (event) => {
        setGradeFilter(event.target.value)
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleDeleteStudent = (event, student) => {
        const enrollmentMsg = student.has_enrollments ? `  ${student.name} is currently enrolled in at least one course...` : ''
        if (confirm(`You sure you want to delete ${student.name}?${enrollmentMsg}`)) {
            let token = document.querySelector('head>meta[name="csrf-token"]').content
            fetch(`api/students/${student.id}`,
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
                    if (response.message === 'Success!') {
                        dispatch({type: 'REMOVE_STUDENT', id: student.id})
                        setShowSnackbar({open: true, variant: "success", message: "Successfully Deleted!"})
                    } else {
                        setShowSnackbar({open: true, variant: "error", message: response.message})
                    }
                })
                .catch(error => console.log("ERROR: ", error))
        }

    }

    const getFab = () => {
        if(showForm) {
            return null;
        }
        return (
            <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={handleClickPlus} >
                <AddIcon />
            </Fab>
        );
    }

    const getForm = () => {
        if (showForm) {
            return  <StudentForm
                classes={classes}
                cancel={handleCancel}
                setShowSnackbar={setShowSnackbar}
                schools={schools}
                grades={grades}
                student={selectedStudent}
                />
        }
    }

    useEffect(() => {
      if (!state.students || state.students.length === 0) {
          setShowForm(true)
      }
    },[])

    return (
        <div className={classes.content}>
            <Paper className={classes.studentList}>
                <Typography variant={'h6'}>Students</Typography>
                <Grid container spacing={8} justify={"space-between"} alignItems={"flex-end"}>
                    <Grid item xs={6} lg={4}>
                        <FormControl className={classes.formControl} fullWidth={true}>
                            <InputLabel htmlFor="filter-school-select">Filter Students by School</InputLabel>
                             <Select
                                multiple
                                value={schoolFilter}
                                onChange={handleSchoolFilter}
                                input={<Input id="filter-school-select" />}
                                renderValue={selected => {
                                    return (
                                        <div className={classes.chips}>
                                            {selected.map(value => {
                                                return (
                                                    <Chip key={value.id} label={value.name} className={classes.chip} />
                                                )
                                            } )}
                                        </div>
                                    )
                                }}
                                MenuProps={MenuProps}
                            >
                                {schools.map(school => (
                                    <MenuItem key={school.id} value={school} style={getStyles(school.name, schoolFilter, theme)}>
                                        {school.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} lg={4}>
                        <FormControl className={classes.formControl} fullWidth={true}>
                            <InputLabel htmlFor="filter-grade-select">Filter Students by Grade</InputLabel>
                            <Select
                                multiple
                                value={gradeFilter}
                                onChange={handleGradeFilter}
                                input={<Input id="filter-grade-select" />}
                                renderValue={selected => {
                                    return (
                                        <div className={classes.chips}>
                                            {selected.map(value => {
                                                return (
                                                    <Chip key={value} label={value} className={classes.chip} />
                                                )
                                            } )}
                                        </div>
                                    )
                                }}
                                MenuProps={MenuProps}
                            >
                                {grades.map(grade => (
                                    <MenuItem key={grade} value={grade} style={getStyles(grade, schoolFilter, theme)}>
                                        {grade}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <FormControl variant={'outlined'} fullWidth={true}>
                            <TextField
                                value={searchTerm}
                                variant={'outlined'}
                                id={"search-field"}
                                onChange={handleSearch}
                                label={"Search on Name or Unique Student ID"}
                            />
                        </FormControl>
                    </Grid>
                <Grid item xs={12}>

                    {filteredStudents.map((student, index) => {
                        const deleteProps = student.deletable ? { onDelete: (event) => {handleDeleteStudent(event, student)} } : {}
                        return (
                            <Tooltip key={`tooltip-${student.id}`} title={`${getPreferredName(student)} - ${student.unique_id}`}>
                                <Chip
                                    color={'primary'}
                                    key={`student-${student.id}`}
                                    label={student.name}
                                    className={classes.chip}
                                    onClick={() => { handleSelectStudent(student) }}
                                    {...deleteProps }
                                />
                            </Tooltip>
                        )
                    })}
                </Grid>
                </Grid>
            </Paper>

            {getForm()}
            {getFab()}

        </div>
    )
}
