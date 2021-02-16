import React, {useContext} from 'react'
import {Typography, CircularProgress} from '@material-ui/core'
import StudentContentBarChart from "./StudentContentBarChart";
import {ReportsContext} from "../../context/ReportsContext";
import {isNullOrUndefined} from "../../helpers/object_helper";
import {useTheme} from "@material-ui/styles";

export default function StudentStandardsOverview(props) {
    const { student, section, tabIndex, loading, standardReport = {}, observedStandards = {} } = props

    const { state } = useContext(ReportsContext)
    const theme = useTheme()

    let courseId = section.courses[tabIndex]?.id
    let series, labels, data

    const noMarkScore = (topicId) => {
        const course_mark = standardReport.course_marks && standardReport.course_marks.find(course_detail => course_detail.id === topicId)
        return course_mark && course_mark.marks.every( mark => !(mark.id in observedStandards) ) ? null : 0
    }

    if (state && state.topic_averages && state.topic_averages[section.id] && state.topic_averages[section.id][student.id]) {
        data = state.topic_averages[section.id][student.id].find(course => course.id === courseId)
        if (data) {
            series = [{ name: "Topic total", data: data.course_marks.map ( content => content.mark || noMarkScore(content.id) ) } ]
            labels = data.course_marks.map ( content => content.name )
        }
    }

    if (loading || isNullOrUndefined(data)) {
        return (
            <div style={{padding: theme.spacing(5,0,2,0)}}>
                <Typography variant={'h5'}>Course Topics Overview</Typography>
                <CircularProgress color={'primary'} />
            </div>
        )
    } else {
        return (
            <div style={{padding: theme.spacing(5,0,8,0)}}>
                <Typography variant={'h5'}>Course Topics Overview</Typography>
                <StudentContentBarChart series={series} categories={labels}/>
            </div>
        )
    }
}