import React, { useContext, useEffect, useState } from 'react'
import {Link as RouterLink} from 'react-router-dom'
import {
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    Fade,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputLabel,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Slide,
    SwipeableDrawer,
    Tooltip,
    Typography,
} from "@material-ui/core";
import BuildIcon from "@material-ui/icons/BuildRounded";
import {ReportsContext} from "../../context/ReportsContext";
import generateTopicText, { generateCompetencyText } from "./CommentGenerator";
import {fetchCompetencyScore, fetchHeatMap, fetchTopicMarks} from "../../api/reportApi";

const drawerWidth = '40%'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    listItem_4: {
        color: 'rgba(8,255,0,0.6)'
    },
    listItem_3: {
        color: 'rgba(255,242,0,0.8)'
    },
    listItem_2: {
        color: 'rgba(255,99,1,0.7)'
    },
    listItem_1: {
        color: 'rgba(255,0,0,0.48)'
    }
}));

const makeHeaderStyles =  makeStyles(theme => ({
    root: {
        background: theme.palette.primary.dark,
        opacity: '.8',
        fontSize: '2em',
        width: '100%'
    },

}))

export default function ReportGenerator (props) {

    const {showGenerator, student, closeGenerator, section, fromDate, toDate, selectedTopics } = props

    if (!showGenerator) {
        return null
    }

    const { state, dispatch } = useContext(ReportsContext);
    const [selectedHighCompetencies, setSelectedHighCompetencies] = useState([])
    const [selectedLowCompetencies, setSelectedLowCompetencies] = useState([])
    const [reportText, setReportText] = useState("")
    const [competencyReport, setCompetencyReport] = useState([])
    const [competencyDrawerOpen, setCompetencyDrawerOpen] = React.useState(false);

    const classes = useStyles()

    const headerClasses = makeHeaderStyles()
    const getMedian = (sortedNumbers) => {
        const middle = Math.floor(sortedNumbers.length / 2)
        const isEven = (sortedNumbers.length & 1) === 0

        return isEven ? ((sortedNumbers[middle] + sortedNumbers[middle + 1]) / 2) : sortedNumbers[middle]
    }

    const shouldFetch = (slice) => {
        return section && student && (!slice || !slice[section.id] || !slice[section.id][student.id])
    }

    /**
     * Returns true if the competency data (scores and heat map) for the selected student has been set in the state.
     */
    const competencyDataIsLoaded = () => {
        return (section && student
            && !shouldFetch(state.competency_averages)
            && !shouldFetch(state.heat_map)
        )
    }

    /**
     * This effect waits for the heat map and competency scores for the currently selected student to finish loading
     * into state, then runs the calculations for the median competency score and otherwise prepares the competency
     * selection drawer for the competency-based comments.
     */
    useEffect(() => {
        if (competencyDataIsLoaded()) {
            let student_competencies = state.heat_map[section.id][student.id]
            let modes = state.competency_averages[section.id][student.id].competency_report
                .filter(course => Object.keys(course.competency_modes).length > 0)
                .reduce((obj, course) =>{
                    return {...obj, [course.id]: course.competency_modes}
                },{})

            let competencyReport = Object.keys(modes).map(courseId => {
                let course = student_competencies.find(c => `${c.id}` === `${courseId}`)
                let course_modes = Object.keys(modes[courseId]).map(competencyId => {
                    let competency = course.data.find(c => `${c.id}` === `${competencyId}`)
                    let count = 0
                    if (competency) {
                        count = competency.data.reduce((total, number) => {
                            return total ? total + number.count : number.count
                        }, 0)
                    }
                    return {id: competencyId, name: competency.name, phrasing: competency.phrasing, score: modes[courseId][competencyId], count: count}
                })
                course_modes.sort((a, b) => {
                    return b.score - a.score || b.count - a.count
                })
                let median = getMedian(course_modes.map(a => a.score))
                let highCompetencies = course_modes.filter(m => m.score >= median)
                let lowCompetencies = course_modes.filter(m => m.score < median)
                return {
                    id: course.id,
                    title: course.title,
                    competencies: course_modes,
                    highCompetencies: highCompetencies,
                    lowCompetencies: lowCompetencies,
                    median: median
                }
            })
            setCompetencyReport(competencyReport)
        }
    }, [competencyDataIsLoaded()])

    /**
     * This effect loads the topic averages and competency-related data after the student has been selected or re-selected:
     */
    useEffect( () => {
        if (student) {
            setReportText('')
            if (shouldFetch(state.topic_averages)) {
                fetchTopicMarks(dispatch, section, student, fromDate, toDate)
            }
            if (shouldFetch(state.competency_averages)) {
                fetchCompetencyScore(dispatch, section, student, fromDate, toDate)
            }
            if (shouldFetch(state.heat_map)) {
                setSelectedHighCompetencies([])
                setSelectedLowCompetencies([])
                fetchHeatMap(dispatch, section, student, fromDate, toDate)
            }
        }
    },[student])

    const handleSelectHighCompetency = (event) => {
        let copy = [...selectedHighCompetencies]

        if (event.target.checked) {
            // add to list
            setSelectedHighCompetencies([...selectedHighCompetencies, event.target.value])
        } else {
            // remove from list
            copy.splice(copy.indexOf(event.target.value), 1)
            setSelectedHighCompetencies(copy)
        }
    }

    const handleSelectLowCompetency = (event) => {
        let copy = [...selectedLowCompetencies]

        if (event.target.checked) {
            // add to list
            setSelectedLowCompetencies([...selectedLowCompetencies, event.target.value])
        } else {
            // remove from list
            copy.splice(copy.indexOf(event.target.value), 1)
            setSelectedLowCompetencies(copy)
        }
    }

    const handleReportChange = (event, id) => {
        setReportText(event.target.value);
    }

    const handleGenerateTopicComments = () => {
        const remarks = generateTopicText(state.topic_averages[section.id][student.id], selectedTopics.map(s => s.id), student)
        setReportText(reportText + " \n" + remarks)
    }

    const handleGenerateCompetencyComments = () => {
        const comments = generateCompetencyText(competencyReport, selectedHighCompetencies, selectedLowCompetencies, student)
        setReportText(reportText + " \n" + comments)
    }

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setCompetencyDrawerOpen(open)
    }

    // Rendering the competency drawer -- get the list of competencyReport:
    function getCompetencyDrawerList(courseCompetencyData, onChangeHandler, selectedOnes) {
        return courseCompetencyData.map((competency, index) => {
            let score = competency.score
            const className = score > 3 ? classes.listItem_4 : score > 2 ? classes.listItem_3 : score > 1 ? classes.listItem_2 : classes.listItem_1

            const label = `${competency.name} ${ '(mode: ' + competency.score + ', based on ' + competency.count + ' observations)'}`
            return (
                <ListItem key={`${competency.id}-${index}`} button onChange={onChangeHandler} >
                    <ListItemIcon>
                        <Tooltip title={label} placement={"bottom-start"}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={competency.id}
                                        checked={selectedOnes.includes(`${competency.id}`) || false}
                                    />}
                                label={label}
                                className={className}
                            />
                        </Tooltip>
                    </ListItemIcon>
                </ListItem>
            )
        });
    }

    // render the competency selection drawer:
    const competencyDrawer = () => {
        if (competencyDrawerOpen && competencyReport) {
            return (
                competencyReport.map( (course, index) => {
                    return (
                        <List
                            key={`competencies-${index}`}
                            component="div"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    inset={true}
                                    classes={headerClasses}
                                    className={headerClasses.root}
                                    styles={{opacity: 1}}
                                    id="nested-list-subheader">
                                    {course.title}
                                </ListSubheader>
                            }
                            className={classes.root}
                        >
                            <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>

                                <Typography color={"secondary"} style={{paddingTop: '10px', paddingLeft: '15px'}}>
                                    High Scores &gt;= median {course.median}
                                </Typography>
                                { getCompetencyDrawerList(course.highCompetencies, handleSelectHighCompetency, selectedHighCompetencies) }
                            </div>
                            <Divider />
                            <div style={{ width: '100%', overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Typography color={"secondary"} style={{paddingTop: '10px', paddingLeft: '15px'}}>
                                    Low Scores &lt; median {course.median}
                                </Typography>
                                { getCompetencyDrawerList(course.lowCompetencies, handleSelectLowCompetency, selectedLowCompetencies) }
                            </div>
                        </List>
                    )
                })
            )
        }

    }

    const getTopicSelectItem = (topic) => {
        const selectItem = <Typography aria-label={'topic name'}>{topic.name}</Typography>
        if (!topic.description) {
            return selectItem
        }
        return (
            <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement={'top'}
                title={topic.description}
            >
                {<Typography aria-label={'topic name'}>{topic.name}</Typography>}
            </Tooltip>
        )
    }

    return (
        <>
            <Slide in={showGenerator} direction={"down"}>
                <div id={'student-report-generator'}>
                    <Grid container spacing={2} alignContent={'flex-end'} justify={'flex-start'}>
                        <Grid item xs={1} xl={1}>
                            <Button onClick={closeGenerator}>
                                <Typography variant={'caption'}>&lt; Back</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={10} xl={10}>
                            {student && <Typography variant={"h4"}>Comments for {student.name}</Typography>}
                            <Typography variant={"h5"}>{section.name}</Typography>
                        </Grid>
                        <Grid item xs={1} xl={1}>
                            <Button onClick={closeGenerator}>
                                <Typography variant={'h6'} onClick={closeGenerator}>x</Typography>
                            </Button>
                        </Grid>
                        {selectedTopics?.length > 0 &&
                        <Grid item sm={12} xl={12}>
                            <Typography align={"left"} variant={"h5"}>
                                Topics for the selected Reporting Period:
                            </Typography>
                            <br/>
                            <Grid
                                container
                                spacing={4}
                                alignContent={'center'}
                                justify={'flex-start'}
                                aria-label={'List of topics for selected reporting configuration'}
                            >
                                {selectedTopics.map((topic) => {
                                    return (
                                        <Grid key={`topic-${topic.id}`} item md={2} xs={12}>
                                            {getTopicSelectItem(topic)}
                                        </Grid>
                                    )
                                })
                                }
                            </Grid>
                            <br/>
                            {!student && <Typography variant={"body1"} align={"left"}>(Select a Student above to continue)</Typography>}
                        </Grid>
                        }
                        {student && competencyDataIsLoaded() &&
                        <>
                            <Grid item xs={6} xl={3}>
                                <div >
                                    <Button
                                        variant={'contained'}
                                        name={'competencyReport'}
                                        onClick={toggleDrawer(true)}
                                    >
                                        Select Competencies
                                    </Button>
                                    <SwipeableDrawer
                                        anchor={'right'}
                                        open={competencyDrawerOpen}
                                        onClose={toggleDrawer(false)}
                                        onOpen={toggleDrawer(true)}
                                        classes={{
                                            paper: classes.drawerPaper
                                        }}
                                        className={classes.drawer}
                                    >
                                        {competencyDrawer()}
                                    </SwipeableDrawer>
                                </div>
                            </Grid>
                            <Grid item xs={12} xl={12}>
                                <Paper className={classes.paper} elevation={10} style={{padding: '10px'}}>
                                    <Grid container spacing={1} alignContent={'flex-end'} justify={'space-between'}>
                                        {!shouldFetch(state.topic_averages) && <Grid item xs={12} xl={12}>
                                            {state.topic_averages[section.id][student.id].map(course => {
                                                let courseTopics = course.course_marks
                                                    .filter(mark => selectedTopics?.includes(`${mark.id}`))
                                                    .map(mark => mark.name)
                                                    .reduce((sentence, mark) => {
                                                        return sentence ? sentence + ", " + mark : mark
                                                    }, "")
                                                if (courseTopics && courseTopics.length > 0) {
                                                    return (
                                                        <Grid container spacing={1} alignContent={'flex-start'} justify={'space-between'}
                                                              key={`c-${course.id}`}>
                                                            <Grid item xs={4} xl={2}>
                                                                <Typography
                                                                    align={"left"}
                                                                    variant={"h6"}>{course.title}:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item item xs={8} xl={10}>
                                                                <Typography align={"left"} variant={'p'}>
                                                                    {courseTopics}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                } else return null;
                                            })}
                                        </Grid>}
                                        <Grid item xs={6} xl={6}>
                                            {selectedTopics && selectedTopics.length > 0 &&
                                            <>
                                                {state.student_loading.topics ? <CircularProgress /> :
                                                    <Button
                                                        variant={'contained'}
                                                        onClick={handleGenerateTopicComments}
                                                        disabled={state.student_loading.topics}
                                                    >Generate Topic Comments</Button>
                                                }
                                            </>
                                            }
                                        </Grid>
                                        <Grid item xs={6} xl={6}>
                                            {selectedHighCompetencies.length > 0 &&
                                            <Button variant={'contained'} onClick={handleGenerateCompetencyComments}>Generate competency
                                                comments</Button>
                                            }
                                        </Grid>
                                        <Grid item xs={12} xl={12}>
                                            <form className={classes.root} noValidate autoComplete="off">
                                        <textarea
                                            style={{minWidth: '90%', margin: '20px 50px 20px 50px'}}
                                            aria-label="minimum height"
                                            rows={20}
                                            onChange={handleReportChange}
                                            value={reportText || ''}/>
                                            </form>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </>
                        }
                    </Grid>
                </div>
            </Slide>
        </>
    )
}

