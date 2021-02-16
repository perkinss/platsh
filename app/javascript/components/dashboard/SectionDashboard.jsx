import React, {useState, useRef, useCallback, useEffect, useContext} from 'react'
import clsx from 'clsx';
import RadialChart from '../report/RadialChart'
import {Grid, Typography, Paper, IconButton, Collapse, Button, Tooltip, CircularProgress} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded'
import { makeStyles } from '@material-ui/styles'
import {Fade} from "@material-ui/core/index";
import StandardsDashboard from "./StandardsDashboard";
import CompetenciesDashboard from "./CompetenciesDashboard";
import {ConfigurationContext} from "../../context/ConfigurationContext";

const useStyles = makeStyles(theme => ({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    item: {
        padding: theme.spacing(0),
        margin: theme.spacing(0)
    }
}))

const CONTENT_TITLE = "Content Standards"
const CONTENT_STATS = "content_stats"
const COMPETENCY_TITLE = "Competencies"
const COMPETENCY_STATS = "competency_stats"

export default function SectionDashboard(props) {
    //testData and loading props are only used to run tests wherein the useEffect hook doesn't run
    const { section, courseId, classes, testData } = props
    const { state } = useContext(ConfigurationContext)

    const expandClasses = useStyles();
    const [expanded, setExpanded] = useState(true)
    const [currentStats, setCurrentStats] = useState(CONTENT_STATS)
    const [sectionStats, setSectionStats] = useState(testData || {})
    const [grid, setGrid] = useState({xs: 6, sm:4, md:3, lg:1})
    const [title, setTitle] = useState(CONTENT_TITLE)
    const [otherTitle, setOtherTitle] = useState(COMPETENCY_TITLE)
    const [showDetails, setShowDetails] = useState(false)
    const [details, setDetails] = useState({})
    const [loading, setLoading] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    useEffect(() => {
        if (currentStats) {

        }
    }, [currentStats])

    useEffect(() => {
        if (state.dashboard[courseId] && state.dashboard[courseId][section.id]) {
            setSectionStats(state.dashboard[courseId][section.id])
            setCurrentStats(CONTENT_STATS)
        }
    },[(state.dashboard[courseId] ? state.dashboard[courseId][section.id] : '')])

    const toggleStats = () => {
        if (currentStats === CONTENT_STATS) {
            setCurrentStats(COMPETENCY_STATS)
            setTitle(COMPETENCY_TITLE)
            setOtherTitle(CONTENT_TITLE)
            setGrid({xs: 6, md: 3})
            setShowDetails(false)
        } else {
            setCurrentStats(CONTENT_STATS)
            setTitle(CONTENT_TITLE)
            setOtherTitle(COMPETENCY_TITLE)
            setGrid({xs: 6, sm:4, md:3, lg:1})
            setShowDetails(false)
        }
    }

    const toggleDetails = (id, newDetails ) => {

        if (!showDetails) {
            setShowDetails(true)
            setDetails(newDetails)
        } else if (id === details.id) {
            setShowDetails(false)
        } else {
            setDetails(newDetails)
        }

    }

    const scrolledRef = useCallback(node => {
        if (node !== null ) {
            if (window.innerWidth < 900) {
                window.scrollTo(150, node.offsetTop)
            } else {
                window.scrollTo(0, node.offsetTop - 400)
            }
        }
    }, []);

    return (
        <Paper elevation={8} className={classes.section} >
            <Typography variant={'h4'}>{section.name} {title}
            <IconButton
                className={clsx(classes.expand, {
                    [expandClasses.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
            >
                <ExpandMoreIcon />
            </IconButton>
            </Typography>
           <Button id={'toggle'} color={'secondary'} label={"Show Competencies"} onClick={toggleStats}>View {otherTitle}</Button>

            <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                { !sectionStats || Object.keys(sectionStats).length === 0 || loading
                    ? <CircularProgress />
                    :
                    <Grid container spacing={0} justify={'space-evenly'} >

                        {Object.values(sectionStats[currentStats]).map(stats => {
                        const name = stats.name ? stats.name : stats.title
                        return (
                            <Grid item {...grid} key={`chart-${name}`} className={classes.item}>
                                <Tooltip  TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} placement={'top'} title={name}>
                                    <Typography variant={'h6'} noWrap={true}>{name}</Typography>
                                </Tooltip>
                                <div onClick={() => { toggleDetails(stats.id, stats)}} style={{zIndex: '1', paddingBottom: '20px', cursor: 'pointer'}}>
                                <RadialChart
                                    classes={classes}
                                    key={`chart-section-topic-${section.name}-${name}`}
                                    labels={[
                                        'Created',
                                        'Assessed'
                                    ]}
                                    radialBarOffset={currentStats === CONTENT_STATS ? -15 : -25}
                                    nameLabelOffset={currentStats === CONTENT_STATS ? '60' : '70'}
                                    series={[stats.percent_included, stats.percent_observed]}
                                    title={name}
                                    showToolbar={false}
                                />
                                </div>
                            </Grid>
                            )
                    })}
                    <Grid item xs={12} xl={12}>

                        { currentStats === CONTENT_STATS &&
                        <StandardsDashboard show={showDetails} details={details} classes={classes} theRef={scrolledRef} /> }
                        { currentStats === COMPETENCY_STATS &&
                        <CompetenciesDashboard show={showDetails} details={details} classes={classes} theRef={scrolledRef} />
                        }

                    </Grid>
                </Grid>
                    }
            </Collapse>
        </Paper>
    )
}