import React, { useState, useEffect } from 'react'
import {Paper, Fab, Grid, Checkbox, Typography, FormControlLabel, makeStyles, Fade, Tooltip} from '@material-ui/core'

import DoneIcon from '@material-ui/icons/DoneOutlineRounded'
import { isEquivalent } from "../../helpers/object_helper"
import CompetencyObservation from "./CompetencyObservation";
import {extractFirstName} from "../../helpers/name_helper";

const useStyles = makeStyles(() => ({
    paper: {
        padding: "1em"
    },
    scoreslider: {
        marginLeft: '50px'
    }
}))

const tooltipStyles = makeStyles(() => ({
    tooltip: {
        fontSize: "1em"
    }
}))

export default function StudentHeader(props) {

    let { assessmentId, assessmentCompetency, student, tasks, classes, dispatchFormUpdate, assessmentDate,
        storedStudentObservations, inProgressStudentObservations, isHolistic } = props

    let headerStyles = useStyles()
    let toolTipClass = tooltipStyles()

    const currentMarks = { ...inProgressStudentObservations.marks }
    const currentCompetencies = { ...inProgressStudentObservations.competencies }
    const currentComments = [...inProgressStudentObservations.comments]
    const [currentScore, setCurrentScore] = useState(inProgressStudentObservations.score)

    const [initialScore, setInitialScore] = useState(currentScore)
    const [selectedAll, setSelectedAll] = useState(false)
    const [initialMarks, setInitialMarks] = useState(storedStudentObservations.marks)
    const [initialCompetencies, setInitialCompetencies] = useState(storedStudentObservations.competencies)
    const [initialComments, setInitialComments] = useState(storedStudentObservations.comments)

    const handleChangeCompetencyScore = (event, id, value, index) => {
        setCurrentScore(value)
    }

    const handleBlur = (event, value) => {
        setCurrentScore(value)
    }

    const allStandards = () => {
        let result = {}
        tasks.forEach((task) => {
            result[task.id] = Object.keys(task.standards).reduce((marks, standardId) => {
                marks[standardId] = 1
                return marks
            }, {})
        })
        return result
    }

    const getMark = () => {
        const totalMarks = tasks.reduce((count, task) => {
            return count + Object.keys(task.standards).length

        },0)
        let marked = 0
        if (currentMarks && Object.values(currentMarks).length > 0) {
            marked = Object.values(currentMarks).reduce((count, task) => {
                return count + Object.keys(task).length
            },0)
        }
        return `Total: ${marked} / ${totalMarks} standards in ${tasks.length} tasks`
    }

    const isStudentFormDirty = () => {
        return !(isEquivalent(initialMarks, currentMarks) &&
            isEquivalent(initialCompetencies, currentCompetencies) &&
            isEquivalent(currentComments, initialComments) &&
            initialScore === currentScore
        )
    }

    const handleSaveObservations = () => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content
        let body = JSON.stringify(
            {
                assessed_at: assessmentDate,
                assessment: assessmentId,
                student: student.id,
                assessment_score: currentScore,
                marks: {
                    student_competencies: currentCompetencies,
                    standard_marks: currentMarks,
                }
            })

        fetch('/api/observations/save',
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
                setInitialCompetencies(currentCompetencies)
                setInitialMarks(currentMarks)
                setInitialScore(currentScore)
            })
            .catch(error => {
                console.log("ERROR: ", error)
            })
        body = JSON.stringify({student_id: student.id, comments: currentComments})
        fetch(`/api/comments/${assessmentId}`,
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
                setInitialComments(currentComments)
            })
            .catch(error => {
                console.log("ERROR: ", error)
            })
    }

    /**
     * Set the select all checkbox to selected if all the loaded marks are in the student marks from the back end
     */
    useEffect(() => {
        if (currentMarks) {
            let marked_tasks = Object.keys(currentMarks)
            let standards = allStandards()
            let missing_mark = marked_tasks.find((t) => {
                let b = currentMarks[t]
                return standards[t] && Object.keys(standards[t]).find((s) => !b[s])
            })
            if (!missing_mark) {
                setSelectedAll(true)
            }
        }
    },[])

    const handleSelectAllOrClear = (event, value ) => {
        setSelectedAll(!selectedAll)
        let marks = {}

        if (value) {
            marks = allStandards()
        } else {
            tasks.forEach((task) => {
                marks[task.id] = {}
            })
        }

        dispatchFormUpdate({ type: 'TOGGLE_ALL_STUDENT_STANDARDS', marks: marks })
    }

    let name = student.preferred_name || extractFirstName(student.name)
    return (
        <Paper className={classes.paper} elevation={11}>
            <Tooltip classes={toolTipClass} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={student.name}>
                <Typography variant={'h6'}>{name}</Typography>
            </Tooltip>
            <Typography variant={"subtitle2"}>{getMark()}</Typography>
                <Grid container spacing={1} alignItems={'flex-start'}>
                    <Grid item xs={4} zeroMinWidth>
                        { assessmentCompetency &&
                        <div className={headerStyles.scoreslider}>
                            <CompetencyObservation
                                styles={classes}
                                initialValue={initialScore}
                                description={assessmentCompetency.description}
                                handleScoreChange={handleChangeCompetencyScore}
                                handleBlur={handleBlur}
                                id={assessmentCompetency.id}
                            />
                        </div>}
                    </Grid>
                    <Grid item xs={4} >
                        { !isHolistic &&
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedAll}
                                        value={student.id}
                                        onChange={handleSelectAllOrClear}
                                    />}
                                label={"Select all / Clear"}
                            />
                        }
                    </Grid>
                    <Grid item xs={4} >
                        <Fab
                            variant="extended"
                            color="primary"
                            onClick={handleSaveObservations}
                            disabled={!isStudentFormDirty()}
                        >
                            <DoneIcon  />
                            Save
                        </Fab>
                    </Grid>
                </Grid>
        </Paper>
    )
}