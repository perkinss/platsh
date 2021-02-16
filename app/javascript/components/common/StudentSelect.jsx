import React, {useContext} from "react";
import {ReportsContext} from "../../context/ReportsContext";
import {CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select} from "@material-ui/core";

export default function StudentSelect(props) {
    const { classes, studentName, handleSelectStudent, loading } = props

    if (loading) {
        return (
            <Grid item xs={12} sm={12} md={6} lg={4}>
                <CircularProgress color={'primary'} />
            </Grid>
            )
    }

    const {state} = useContext(ReportsContext)

    return (
        <FormControl className={classes.formControl} fullWidth={true}>
            <InputLabel htmlFor="select-student">Student</InputLabel>
            <Select
                value={studentName || ''}
                onChange={handleSelectStudent}
                input={<Input id="select-student"/>}
            ><MenuItem value="">
                <em>None</em>
            </MenuItem>
                {state.students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                        {student.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}