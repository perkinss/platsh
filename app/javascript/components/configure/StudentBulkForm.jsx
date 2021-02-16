import React, {useState,useContext} from 'react'
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid,
    Divider, IconButton, Input, MenuItem, Paper, Typography, Button, InputLabel, Select, Hidden, FormControl, useTheme
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/HelpRounded";
import CloseIcon from '@material-ui/icons/Close';
import { ConfigurationContext } from '../../context/ConfigurationContext';


export default function StudentBulkForm(props) {

    const { classes, schools, setShowSnackbar } = props
    const theme = useTheme()

    const [CSVSchool, setCSVSchool] = useState('')
    const {state, dispatch} = useContext(ConfigurationContext)
    const [chosenFileName, setChosenFileName] = useState('(None Selected)')
    const [openCSVDetails, setOpenCSVDetails] = useState(false)
    const [CSVFile, setCSVFile] = useState('')
    const [csvLoading, setCSVLoading] = useState(false);
    const handleCloseCSVDetails = () => {
        setOpenCSVDetails(false)
    }
    const handleOpenCSVDetails = () => {
        setOpenCSVDetails(true)
    }


    const handleCSVSchoolChange = (event) => {
        setCSVSchool(event.target.value)
    }

    const handleCSVChange = (event) => {
        setCSVFile(event.target.files[0])
        setChosenFileName(event.target.files[0].name)
    }

    const importShouldBeDisabled = () => {
        return !CSVFile || !CSVSchool
    }

    const handleCancelStudent = () => {
        setShowForm(false)
    }

    const handleSaveCSV = (event) => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        const formData = new FormData();
        formData.append('school', CSVSchool.id);
        formData.append('file', CSVFile);
        setCSVLoading(true)
        fetch('/api/students/import', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': token,
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        }).then(res => {
            setCSVLoading(false)
            return res.json();
        }).then(result => {
            setShowSnackbar({open:true,variant:result.status,message:result.message})
            dispatch({type: 'SET_STUDENTS', students: result.students})
        }).catch(error => console.log("ERROR: ", error))
    }

    return (
        <React.Fragment>
        {csvLoading ?
                (<div className={classes.centerspinner}>
                    <CircularProgress className={classes.progress} />
                </div>)
                :
                (
                <React.Fragment>
                    <div style={{paddingTop: theme.spacing(4)}}>
                        <Typography variant={'h6'}>Or Bulk Import Via CSV File
                            <IconButton onClick={handleOpenCSVDetails}>
                                <HelpIcon className={classes.icon} />
                                <Typography variant={'caption'}>(Details)</Typography>
                            </IconButton>
                        </Typography>
                        <Dialog
                            fullWidth={true}
                            maxWidth="md"
                            open={openCSVDetails}
                            onClose={handleCloseCSVDetails}
                            aria-labelledby="CSVDetails-title"
                        >
                            <Grid container>
                                <Grid item xs={11}>
                                    <DialogTitle id="CSVDetails-title">CSV File Format</DialogTitle>
                                </Grid>
                                <Grid item xs={1}>
                                    <DialogActions>
                                        <IconButton key="closeCSVDetails" aria-label="Close" color="inherit" onClick={handleCloseCSVDetails}>
                                            <CloseIcon className={classes.icon} />
                                        </IconButton>
                                    </DialogActions>
                                </Grid>
                                <Grid item xs={12}>
                                    <DialogContent dividers>
                                        <DialogContentText gutterBottom={true}>
                                            The columns must contain a Unique identifier (e.g. PEN), a student name, and a grade K-12. <br/>
                                            The columns may also contain an email address, a preferred name, and a pronoun selection
                                            in the form of 'He/Him/His', 'She/Her/Her', or 'They/Them/Their'<br/>
                                            The first line of the file must be the column headers, and the order of the data in each row must match the
                                            order of the corresponding header fields.<br/>
                                            If there are two optional fields, the data may only be blank for the last field<br/>
                                            If a student with the given unique id is already in the system, their data will be updated with any
                                            new information.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogContent dividers>
                                        <DialogContentText gutterBottom={true}>
                                        Example:
                                        </DialogContentText>
                                         <DialogContentText gutterBottom={true}>
                                        Unique Student ID, Name, Grade<br/>
                                        111111111, 'Jane Doe', 10<br/>

                                        ...
                                         </DialogContentText>
                                         <DialogContentText gutterBottom={true}>
                                             Or:
                                         </DialogContentText>
                                         <DialogContentText gutterBottom={true}>
                                        Unique Student ID, Name, Grade, Email, Preferred Name, Pronoun<br/>
                                        111111111, 'Jane Doe', '9', 'jane@doe.com', 'JayJay', 'She/Her/Her'<br/>
                                        222222222, 'John Smith', '10', ,'He/Him/His'<br/>
                                        ...
                                        </DialogContentText>
                                     </DialogContent>
                                </Grid>
                            </Grid>
                        </Dialog>
                    </div>
                    <Paper className={classes.root}>
                        <Grid container alignContent={'space-between'} alignItems={'center'} spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth={true} required>
                                    <InputLabel htmlFor="select-school-csv">Select School</InputLabel>
                                        <Select
                                            value={CSVSchool}
                                            variant={'outlined'}
                                            onChange={handleCSVSchoolChange}
                                            input={<Input id="select-school-csv" />}
                                        >
                                            {schools.map(CSVSchool => (
                                                <MenuItem key={CSVSchool.id} value={CSVSchool}>
                                                    {CSVSchool.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                </FormControl>
                            </Grid>
                            <Hidden xsDown>
                                <Grid item sm={6}>
                                </Grid>
                            </Hidden>
                            <Grid item xs={12}>
                                <Divider/>
                                <input onChange={handleCSVChange} style={{ display: 'none' }} accept="text/*" className={classes.input} id="student-csv-file" type="file"/>
                                <label htmlFor="student-csv-file">
                                    <Button component="span" className={classes.button}>Choose CSV File</Button>
                                </label>
                                <Typography variant={'caption'}>{chosenFileName}</Typography>
                                <Button onClick={handleSaveCSV} disabled={importShouldBeDisabled()}>Import</Button>
                                <Button onClick={handleCancelStudent}>Cancel</Button>
                            </Grid>
                        </Grid>
                     </Paper>

                </React.Fragment>
                )
        }
        </React.Fragment>
    )
}
