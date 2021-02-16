import React, {useContext, useEffect, useState} from 'react'
import {Grid, Tab, Tabs, Typography} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, useTheme} from "@material-ui/core/styles/index";
import StudentGradeOverview from './StudentGradeOverview'
import StudentCompetencyOverview from './StudentCompetencyOverview'
import StudentStandardsOverview from './StudentStandardsOverview'
import CompetencyObservationTimeSeries from "./CompetencyObservationTimeSeries";
import {isNullOrUndefined} from "../../helpers/object_helper";
import ContentStandardsProgressReport from "./ContentStandardsProgressReport";
import CommentsTable from "./CommentsTable";
import {ReportsContext} from "../../context/ReportsContext";
import {
    fetchCompetencyScore,
    fetchHeatMap,
    fetchObservedAssessments,
    fetchStandardMarks,
    fetchTopicMarks
} from "../../api/reportApi";

const closeButtonStyles = makeStyles(theme => ({
    root: {
        cursor: 'pointer',
    },
}));

export default function StudentSectionReport (props) {
    const { classes, section, student, clearStudent, teacher, fromDate, toDate } = props
    const closeButtonClasses = closeButtonStyles()
    const theme = useTheme();
    const { state, dispatch } = useContext(ReportsContext)

    const [tabIndex, setTabIndex] = React.useState(0);
    const [competencyTotal, setCompetencyTotal] = useState('')
    const [competencyData, setCompetencyData] = useState([])
    const [competencyLabels, setCompetencyLabels] = useState([])
    const [competencyModes, setCompetencyModes] = useState({})
    const [graphLabels, setGraphLabels] = useState([])
    const [contentTotal, setContentTotal] = useState('')
    const [heatMapData, setHeatMapData] = useState([])
    const [standardReport, setStandardReport] =  useState({course_marks: []})
    const [observedStandards, setObservedStandards] =  useState({});
    const [courseContentWeighting, setCourseContentWeighting] = useState(50)

    const handleChangeIndex = (index) => {
        setTabIndex(index)
    }

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
    }

    const sortCompetenciesById = (competencies) => {
        competencies.sort((a, b) => {
            if (a.id === b.id) {
                return 0;
            } else if (a.id < b.id) {
                return -1;
            } else {
                return 1;
            }
        });
        return competencies;
    }

    const loadCompetencyData = () => {
        let courseId = section.courses[tabIndex].id
        let data = state.competency_averages[section.id][student.id].competency_report.find(course => course.id === courseId)
        let competencies = sortCompetenciesById(data.course_competencies)

        setCompetencyTotal(data.course_average || 0)
        setCompetencyLabels(competencies.map ( group => group.title ))
        const percentages = competencies.map ( group => group.percentage )
        setCompetencyData(percentages)
        setCompetencyModes(data.competency_modes)
        setGraphLabels(competencies.map (group => group.competency_mark))
        dispatch({type: 'SET_HEAT_MAP_COLORS', competencies: competencies})
    }

    const loadContentData = () => {
        let courseId = section.courses[tabIndex].id
        let data = state.topic_averages[section.id][student.id].find(course => course.id === courseId)
        if (data) {
            setContentTotal(data.average || 0)
            const series = [{ name: "Topic total", data: data.course_marks.map ( content => content.mark ) } ]
            setCourseContentWeighting(data.course_contents_weight)
        }
    }

    const loadObservationData = () => {
        let data = state.heat_map[section.id][student.id].find(course => course.id === section.courses[tabIndex].id )
        setHeatMapData(data)
    }

    const loadStandardReport = () => {
        let courseId = section.courses[tabIndex].id
        let data = state.standard_marks[section.id][student.id].find(course => course.id === courseId )
        setStandardReport(data)
    }

    const loadObservedStandards = () => {
        let data = state.observed_assessments[section.id][student.id]
            .flatMap((assessment) => assessment.tasks)
            .flatMap((task) => task.standards)
            .reduce((acc, cur) => {
                acc[cur.id] = true
                return acc
            }, {});
        setObservedStandards(data)
    };

    useEffect(() => {
        if (!isNullOrUndefined(tabIndex)) {
            if (!shouldFetch(state.topic_averages)) {
                loadContentData()
            }
        }
    },[tabIndex, section && state.topic_averages && state.topic_averages[section.id]])

    useEffect(() => {
        if (!isNullOrUndefined(tabIndex)) {
            if (!shouldFetch(state.competency_averages)) {
                loadCompetencyData()
            }
        }
    },[tabIndex, section && state.competency_averages && state.competency_averages[section.id]])

    useEffect(() => {
        if (!isNullOrUndefined(tabIndex)) {
            if (!shouldFetch(state.heat_map)) {
                loadObservationData()
            }
        }
    },[tabIndex, section && state.heat_map && state.heat_map[section.id]])

    useEffect(() => {
        if (!isNullOrUndefined(tabIndex)) {
            if (!shouldFetch(state.standard_marks)) {
                loadStandardReport()
            }
        }
    },[tabIndex, section && state.standard_marks && state.standard_marks[section.id]])

    useEffect(() => {
        if (!shouldFetch(state.observed_assessments)) {
            loadObservedStandards()
        }
    },[tabIndex, section && state.observed_assessments && state.observed_assessments[section.id]]);

    useEffect(() => {
        setTabIndex(0)
    },[section])

    /**
     * Determines whether a slice of state is missing and should be fetched
     * @param slice - the slice of state to check
     * @returns {*|boolean}
     */
    const shouldFetch = (slice) => {
        return (section && student && !slice || !slice[section.id] || !slice[section.id][student.id])
    }

    useEffect(()=> {
        if (student && section) {
            if (shouldFetch(state.competency_averages)) {
                setCompetencyData([])
                setCompetencyTotal('')
                setCompetencyLabels([])
                setCompetencyModes({})
                fetchCompetencyScore(dispatch, section, student, fromDate, toDate)
            }
            if ( shouldFetch(state.topic_averages)) {
                setContentTotal('')
                fetchTopicMarks(dispatch, section, student, fromDate, toDate)
            }
            if (shouldFetch(state.heat_map)) {
                fetchHeatMap(dispatch, section, student, fromDate, toDate)
            }
            if (shouldFetch(state.observed_assessments)){
                setTabIndex(0)
                fetchObservedAssessments(dispatch, section, student, fromDate, toDate)
            }
            if (shouldFetch(state.standard_marks)) {
                fetchStandardMarks(dispatch, section, student, fromDate, toDate)
            }
        }
    },[section])

    return (
        <React.Fragment>
            <Grid container spacing={0} alignContent={'flex-end'} justify={'flex-end'}>
                {clearStudent && <Grid item xs={1} xl={1}>
                    <Typography classes={closeButtonClasses} variant={'h6'} onClick={clearStudent}>x</Typography>
                </Grid>}
            </Grid>
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
            >
                {section.courses.map(course => {
                    return (
                        <TabContainer dir={theme.direction} key={`view-${course.title}`} className={classes.content}>
                            <Grid container spacing={0} justify={'space-between'} alignContent={'flex-start'} alignItems={'flex-start'}>
                                <Grid item xs={12} md={6} xl={6} >
                                    <StudentCompetencyOverview
                                        student={student}
                                        course={course}
                                        competencyData={competencyData}
                                        competencyLabels={competencyLabels}
                                        loading={state.student_loading.competency}
                                        graphLabels={graphLabels}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} xl={6}>
                                   <StudentStandardsOverview
                                       student={student}
                                       tabIndex={tabIndex}
                                       section={section}
                                       standardReport={standardReport}
                                       observedStandards={observedStandards}
                                       loading={state.student_loading.topics}
                                   />
                                </Grid>
                                <Grid item xs={12}>
                                    <CompetencyObservationTimeSeries
                                        student={student}
                                        classes={classes}
                                        heatMapLoading={state.student_loading.heat_map}
                                        heatMapData={heatMapData}
                                        competencyModes={competencyModes}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{maxWidth: '98%', marginLeft: '1%'}}>
                                    <StudentGradeOverview
                                        student={student}
                                        competencyTotal={competencyTotal}
                                        contentTotal={contentTotal}
                                        competenciesLoading={state.student_loading.competency}
                                        contentLoading={state.student_loading.topics}
                                        courseContentWeighting={courseContentWeighting}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ContentStandardsProgressReport
                                        classes={classes}
                                        student={student}
                                        report={standardReport}
                                        observedStandards={observedStandards}
                                        loading={state.student_loading.standards || state.student_loading.observed_assessments}
                                    />
                                </Grid>
                                {teacher && <Grid item xs={12}>
                                    <CommentsTable
                                        classes={classes}
                                        student={student}
                                        section={section}
                                        loading={state.student.loading.comments}
                                    />
                                </Grid>}
                            </Grid>
                        </TabContainer>
                    )
                })}
            </SwipeableViews>
        </React.Fragment>
    )
}

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} >
            {children}
        </Typography>
    );
}