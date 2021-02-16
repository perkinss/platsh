import React, {useContext} from 'react'
import {CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/BuildRounded";
import {ReportsContext} from "../../context/ReportsContext";

export default function SectionSelect(props) {
    const {loading, sectionName, handleSelectSection, isStudent} = props

    const { state } = useContext(ReportsContext)
    if (loading) {
        return (
            <CircularProgress color={"primary"}/>
        )
    }

    if (state?.sections.length === 0) {
        if (isStudent) {
            return (
                <NoData/>
            )
        }
        return (
            <NoConfiguredSections/>
        )
    }

    return (
        <FormControl className={''} fullWidth={true}>
            <InputLabel htmlFor="select-section">Section</InputLabel>
            <Select
                name={'sectionSelect'}
                value={sectionName}
                onChange={handleSelectSection}
                input={<Input id="select-section"/>}
            >
                {state.sections.map(section => (
                    <MenuItem key={section.id} value={section.id}>
                        {section.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

    )
}

function NoConfiguredSections(props) {
    return (
        <>
            <Typography variant={'h6'}>Section Configuration and Data not found!</Typography>
            <br/>
            <Typography variant={"body1"} align={"left"}>To begin, configure some sections and assessments. Once you
                have sections with
                enrolled students, and assessments for those sections, you can begin to make observations on those
                assessments. Once there is data for some of your students, you will be able to return to this page
                to see reports on them.</Typography>
            <br/>
        </>
    )
}

function NoData(props) {
    return (
        <>
            <Typography variant={'h6'}>Reports not found!</Typography>
            <br/>
            <Typography variant={"body1"} align={"left"}>To begin, you must be enrolled in some courses and be invited by the teacher
                to view the reports</Typography>
            <Typography variant={"body1"} align={"left"}>
                Start with the wrench icon &nbsp; <BuildIcon fontSize={"small"}/> &nbsp;in the menu.</Typography>
            <br/>
        </>
    )
}
