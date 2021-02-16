import React, { useState, useEffect, useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FormControl, Divider, Button, Typography, TextField, Paper, Grid, InputLabel, Select, Input, MenuItem
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/SendRounded'
import { ConfigurationContext } from '../../context/ConfigurationContext'
import StudentBulkForm from "./StudentBulkForm"
import {isNullOrUndefined} from "../../helpers/object_helper"

const useStyles =  makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    chip: {
        margin: theme.spacing(1)
    },
    centerspinner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
}))

function StudentForm(props) {
    let { cancel, setShowSnackbar, classes, schools, grades, student } = props
    const {state, dispatch} = useContext(ConfigurationContext)

    let initialStudent = student ? {...student} : {}
    let firstName = initialStudent.name ? initialStudent.name.substr(0, initialStudent.name.indexOf(' ')) : ''

    classes = {...classes, ...useStyles()}
    const theme = useTheme()
    const [studentName, setStudentName] = useState(initialStudent.name  || '')
    const [preferredName, setPreferredName] = useState( initialStudent.preferred_name || firstName)
    const [pronoun, setPronoun] = useState(initialStudent.pronoun || '')
    const [uniqueID, setUniqueID] = useState(initialStudent.unique_id || '')
    const [email, setEmail] = useState(initialStudent.email || '')
    const [grade, setGrade] = useState(initialStudent.grade || '')
    const [school, setSchool] = useState(initialStudent.school ? initialStudent.school : '')
    const [emailFocused, setEmailFocused] = useState(false)

    const handleNameChange = (event) => {
        setStudentName(event.target.value)
    }

    const handleUniqueIDChange = (event) => {
        setUniqueID(event.target.value)
    }

    const handleEmailChange = (event) => {
        setEmailFocused(true)
        setEmail(event.target.value)
    }

    const handleGradeChange = (event) => {
        setGrade(event.target.value)
    }

    const handleSchoolChange = (event) => {
        setSchool(event.target.value)
    }

    const handlePronounChange = (event) => {
        setPronoun(event.target.value)
    }

    const handlePreferredNameChange = (event) => {
        setPreferredName(event.target.value)
    }

    const handleInvite = () => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify({ email: email })

        fetch(`/api/students/${student.id}/invite`,
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
                setShowSnackbar({ open:true, variant:"success", message:response.message })
                handleCancelStudent()
            })
            .catch(error => console.log("ERROR: ", error))
    }

    const handleSaveStudent = (event) => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify({name: studentName, unique_id: uniqueID, school: school.id, grade: grade, email: email, pronoun: pronoun, preferred_name: preferredName })
        let close = (event.target.innerHTML === 'Save')

        if (initialStudent.id) {
            fetch(`/api/students/${student.id}`,
                {
                    method: 'PUT',
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
                    dispatch({type:'UPDATE_STUDENT', student: response})
                    handleCancelStudent()
                })
                .catch(error => console.log("ERROR: ", error))
        } else {
            fetch('/api/students/new',
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
                    dispatch({type:'ADD_STUDENT', student:response})
                    if (close) {
                        handleCancelStudent()
                    } else {
                        setStudentName('')
                        setUniqueID('')
                    }
                })
                .catch(error => console.log("ERROR: ", error))
        }
    }

    const handleCancelStudent = () => {
        setStudentName('')
        setUniqueID('')
        setGrade('')
        setSchool('')
        setEmail('')
        setPreferredName('')
        cancel()
    }

    const saveShouldBeDisabled = () => {
        return !studentName || !uniqueID || notUnique(uniqueID) || !school || invalidEmail(email)
    }

    const handleBlurUniqueID = () => {
        setUniqueID(uniqueID?.trim())
    }

    const handleBlurEmail = () => {
        setEmailFocused(false)
        setEmail(email?.trim())
    }

    const handleBlurStudentName = () => {
        setStudentName(studentName?.trim())
    }

    const notUnique = (value) => {
        return [...state.students].filter(s => s.id !== student.id).map(s => s.unique_id).includes(value)
    }

    const invalidEmail = () => {
        if (isNullOrUndefined(email) || email === '') {
            return false
        }
       return  !email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
    }

    useEffect(() => {
        if (student) {
            setStudentName(student.name)
            setGrade(student.grade)
            setSchool(schools.find(school => school.id === student.school))
            setUniqueID(student.unique_id)
            setEmail(student.email)
            setPronoun(student.pronoun)
            setPreferredName(student.preferred_name || firstName)
        }
    }, [student])

    return (
        <React.Fragment>
            <div className={classes.content}>
            <div style={{paddingTop: theme.spacing(4)}}>
                {student
                    ? <Typography variant={'h6'}>Editing {student.name}</Typography>
                    : <Typography variant={'h6'}>Add New Students to the System</Typography>
                }
            </div>
            <Paper className={classes.root}>
                <Grid container alignContent={'space-between'} alignItems={'center'} spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth={true} required>
                            <InputLabel htmlFor="select-school">Select School</InputLabel>
                            <Select
                                value={school || ''}
                                variant={'outlined'}
                                onChange={handleSchoolChange}
                                input={<Input id="select-school" />}
                            >
                                {schools.map(school => (
                                    <MenuItem key={school.id} value={school}>
                                        {school.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth={true} >
                        <InputLabel htmlFor="select-grade">Select Grade</InputLabel>
                            <Select
                                value={grade || ''}
                                variant={'outlined'}
                                onChange={handleGradeChange}
                                input={<Input id="select-grade" />}
                            >
                                {grades.map(grade => (
                                    <MenuItem key={grade} value={grade}>
                                        {grade}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl  fullWidth={true} variant={'outlined'}>
                            <TextField
                                value={studentName || ''}
                                variant={'outlined'}
                                id={"student-name"}
                                onChange={handleNameChange}
                                label={"Student name"}
                                required
                                onBlur={handleBlurStudentName}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant={'outlined'} fullWidth={true}>
                            <TextField
                                value={uniqueID || ''}
                                variant={'outlined'}
                                id={"unique-student-id"}
                                onChange={handleUniqueIDChange}
                                label={"Unique identifier"}
                                error={notUnique(uniqueID)}
                                helperText={notUnique(uniqueID) ? 'That identifier has been taken!' : ' '}
                                required
                                onBlur={handleBlurUniqueID}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Grid container alignContent={'space-between'} alignItems={'flex-start'} spacing={4}>
                            <Grid item xs={8} sm={8}>
                                <FormControl variant={'outlined'} fullWidth={true}>
                                    <TextField
                                        value={email || ''}
                                        variant={'outlined'}
                                        id={"student-email"}
                                        onChange={handleEmailChange}
                                        label={"Email address (optional)"}
                                        error={!emailFocused && invalidEmail()}
                                        helperText={!emailFocused && invalidEmail() ? 'invalid email address' : ' '}
                                        onBlur={handleBlurEmail}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <Button
                                    className={classes.button}
                                    variant={'contained'}
                                    size={"large"}
                                    onClick={handleInvite}
                                    disabled={!student || !email || invalidEmail()}
                                >
                                    <Typography variant={'subtitle2'}>Invite &nbsp;&nbsp; </Typography> <SendIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Divider/>
                        <Typography>
                            Report card comment preferences
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <FormControl variant={'outlined'} fullWidth={true}>
                            <TextField
                                value={preferredName}
                                variant={'outlined'}
                                id={"student-preferred-name"}
                                onChange={handlePreferredNameChange}
                                label={"Preferred name for report card comments"}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <FormControl variant={'outlined'} fullWidth={true}>
                            <Select
                                value={pronoun || 'They/Them/Their'}
                                variant={'outlined'}
                                onChange={handlePronounChange}
                                input={<Input id="select-pronoun" />}
                                label={"Select the preferred pronoun for student gender"}
                            >
                               <MenuItem value={'He/Him/His'}>
                                   He/Him/His
                                </MenuItem>
                                <MenuItem value={'She/Her/Her'}>
                                    She/Her/Her
                                </MenuItem>
                                <MenuItem value={'They/Them/Their'}>
                                    They/Them/Their
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12}>
                        <Divider/>
                        <Button onClick={handleSaveStudent} disabled={saveShouldBeDisabled()}>Save</Button>
                        {!student && <Button onClick={handleSaveStudent} disabled={saveShouldBeDisabled()}>Save and Add Another</Button>}
                        <Button onClick={handleCancelStudent}>Cancel</Button>
                    </Grid>
                </Grid>
            </Paper>
            <StudentBulkForm classes={classes} schools={schools} setShowSnackbar={setShowSnackbar} />
            </div>
        </React.Fragment>
    );
}
export default StudentForm
