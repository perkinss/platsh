import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FormControl, Typography, Paper, Grid, InputLabel, Select, Input, MenuItem, Chip, Button } from '@material-ui/core'
import {isEquivalentArrays} from "../../helpers/object_helper";

const useStyles =  makeStyles(theme => ({
    chip: {
        margin: theme.spacing(1)
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
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

function SchoolForm(props) {
    let { setShowSnackbar, classes } = props
    classes = {...classes, ...useStyles()}

    const theme = useTheme()

    const [userSchools, setUserSchools] = useState([])
    const [allSchools, setAllSchools] = useState([])
    const [schoolFilter, setSchoolFilter] = useState([])

    useEffect(() => {
        fetch(`api/schools/get_for_user?strict=true`)
            .then(res => res.json())
            .then( (result) => {
                setUserSchools(result)
                setSchoolFilter(result.map((school) => school.id))
            })
    }, [])

    useEffect(() => {
        fetch(`api/schools`)
            .then(res => res.json())
            .then( (result) => {
                setAllSchools(result)
            })
    }, [])

    const handleSaveSchools = (event) => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify({ schoolIds: schoolFilter })

        fetch(`/api/user/schools`,
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
                setUserSchools(response)
            })
            .catch(error => {
                console.log("ERROR: ", error)
                setShowSnackbar({open:true,variant:"error",message:"Save Failed!"})
            })
    }

    const handleSchoolFilter = (event) => {
        setSchoolFilter(event.target.value)
    }

    const saveShouldBeDisabled = () => {
        const filteredSchoolIds = [...schoolFilter]
        const userSchoolIds = userSchools.map((school) => school.id)

        filteredSchoolIds.sort((a, b) => a - b)
        userSchoolIds.sort((a, b) => a - b)

        return isEquivalentArrays(filteredSchoolIds, userSchoolIds)
    }

    return (
        <div className={classes.content}>
            <Paper>
                <Typography variant={'h6'}>Schools</Typography>
                <Grid container spacing={8} justify={"space-between"} alignItems={"flex-end"}>
                    <Grid item xs={12}>
                        <FormControl className={classes.formControl} fullWidth={true}>
                            <InputLabel htmlFor="school-select">Select your schools</InputLabel>
                            <Select
                                multiple
                                value={schoolFilter}
                                onChange={handleSchoolFilter}
                                input={<Input id="school-select" />}
                                renderValue={selected => {
                                    return (
                                        <div className={classes.chips}>
                                            {selected.map(value => {
                                                const school = allSchools.find((it) => it.id == value) || {}
                                                return (
                                                    <Chip key={value} label={school.name} className={classes.chip} />
                                                )
                                            } )}
                                        </div>
                                    )
                                }}
                                MenuProps={MenuProps}
                            >
                                {allSchools.map(school => (
                                    <MenuItem key={school.id} value={school.id} style={getStyles(school.name, schoolFilter, theme)}>
                                        {school.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <br/>
                <Button variant="contained" color="primary" className={classes.button} onClick={handleSaveSchools} disabled={saveShouldBeDisabled()}>
                    Save
                </Button>
            </Paper>
        </div>
    )
}
export default SchoolForm
