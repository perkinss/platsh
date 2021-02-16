import React, {useContext, useEffect, useState} from 'react'
import {Typography, Tabs, Tab, Grid, CircularProgress} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views';
import StackedTopicBarChart from "./StackedTopicBarChart";
import { useTheme } from "@material-ui/core/styles/index";
import StackedCompetencyBarChart from "./StackedCompetencyBarChart";
import {isNullOrUndefined} from "../../helpers/object_helper";
import {ReportsContext} from "../../context/ReportsContext";
import Slide from "@material-ui/core/Slide";
import Collapse from "@material-ui/core/Collapse";
import {getDateParams} from "../../helpers/date_helper";
import {fetchSectionCompetencyScores, fetchSectionTopicMarks} from "../../api/reportApi";

export default function SectionReportOverview (props) {
    const { classes, section, barHeight, hide, fromDate, toDate } = props
    const theme = useTheme();

    if (hide) {
        return ""
    }
    const { state, dispatch } = useContext(ReportsContext)

    const [tabIndex, setTabIndex] = useState(0);
    const [contentLabels, setContentLabels] = useState([])
    const [competencyLabels, setCompetencyLabels] = useState([])
    const [contentMarks, setContentMarks] = useState([])
    const [averages, setAverages] = useState([])
    const [competencyMarks, setCompetencyMarks] = useState([])
    const [competencyAverages, setCompetencyAverages] = useState([])

    const loadTopicsData = () => {
        let courseId = section.courses[tabIndex].id
        let course_data = state.section_overview_marks[section.id].section_content_overview.find( course => course.id === courseId )
        let marks = course_data.course_marks.filter(content => content.content_marks.length > 0)
        let contentSeries = marks.map ( content => {
            let data = content.content_marks.map( mark => mark.mark === null ? 0 : mark.mark.toFixed(2))
            let labels = content.content_marks.map( mark => mark.name)
            setContentLabels(labels)
            return { name: content.name, data: data }
        })
        setContentMarks(contentSeries)
        setAverages(course_data.averages)
    }

    const loadCompetencyData = () => {
        let courseId = section.courses[tabIndex].id
        let course_data = state.section_competency_scores[section.id].section_competency_overview.find( course => course.id === courseId )
        let marks = course_data.course_competencies.filter(group => group.competency_mark.length > 0)
        let compSeries = marks.map ( group => {
            let data = group.competency_mark.map( mark => mark.mark === null ? 0 : mark.mark.toFixed(1))
            let labels = group.competency_mark.map( mark => mark.name)
            setCompetencyLabels(labels)
            return { name: group.title, data: data }
        })
        setCompetencyMarks(compSeries)
        setCompetencyAverages(course_data.averages)
    }

    const shouldFetch = (slice) => {
        return section && !slice || !slice[section.id]
    }

    useEffect(()=> {
        if (!isNullOrUndefined(tabIndex)) {
            if (!shouldFetch(state.section_overview_marks)) {
                loadTopicsData()
            }
        }
    }, [tabIndex, state.section_overview_marks])

    useEffect(() => {
        if (!isNullOrUndefined(tabIndex)) {
            if (!shouldFetch(state.section_competency_scores)) {
                loadCompetencyData()
            }
        }
    }, [tabIndex, state.section_competency_scores])

    useEffect(() => {
        if (section) {
            if (shouldFetch(state.section_overview_marks)) {
                fetchSectionTopicMarks(dispatch, state, fromDate, toDate)
            } else {
                loadTopicsData()
            }
            if (shouldFetch(state.section_competency_scores)) {
                fetchSectionCompetencyScores(dispatch, state, fromDate, toDate)
            } else {
                loadCompetencyData()
            }
        }
    }, [section])

    const handleChangeIndex = (index) => {
        setTabIndex(index)
    }

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
    }

    const calcContentGrade = (val, dataPointIndex) => {
        if ( averages[dataPointIndex]) {
            return averages[dataPointIndex].toFixed(1)
        }
    }

    const calcCompetencyGrade = (val, dataPointIndex) => {
        if (competencyAverages[dataPointIndex]) {
            return competencyAverages[dataPointIndex].toFixed(0)
        }
    }

    return (
        <>
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="fullWidth"
            >
                {section.courses.map(course => {
                    return <Tab label={course.title} key={`tab-${course.title}`}/>
                })}
            </Tabs>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={tabIndex}
                onChangeIndex={handleChangeIndex}
                style={{ overflow: 'hidden', padding: 20 }}
            >
                {section.courses.map(course => {
                    return <TabContainer dir={theme.direction} key={`view-${course.title}`} className={classes.content}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={8} style={{padding: '5px 10px'}}>
                                <StackedTopicBarChart
                                    series={contentMarks}
                                    categories={contentLabels}
                                    calcStudentGrade={calcContentGrade}
                                    barHeight={barHeight}
                                    loading={state.section_loading.topics}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} style={{padding: '5px 10px' }}>
                                <StackedCompetencyBarChart
                                    series={competencyMarks}
                                    categories={competencyLabels}
                                    calcStudentGrade={calcCompetencyGrade}
                                    barHeight={barHeight}
                                    loading={state.section_loading.competency}
                                />
                            </Grid>
                        </Grid>
                    </TabContainer>
                })}
            </SwipeableViews>
        </>
    )
}

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} >
            {children}
        </Typography>
    );
}