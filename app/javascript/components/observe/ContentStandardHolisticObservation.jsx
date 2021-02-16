import React, {useState} from 'react'
import { Grid, Tooltip, Typography, Fade, Paper } from '@material-ui/core'
import ScoreSlider from "./ScoreSlider";
import {makeStyles} from "@material-ui/core/styles";

const MAX_STANDARD_SCORE = 6;

const tooltipStyles = makeStyles(() => ({
    tooltip: {
        fontSize: "1em"
    }
}))

export default function ContentStandardHolisticObservation (props) {
    const { id,  task, studentId, description, score, dispatchFormUpdate, classes } = props
    const tooltipClass = tooltipStyles()

    const [currentScore, setCurrentScore] = useState(score)

    const handleScoreChange = (event, id, value) => {
        setCurrentScore(value)
    }

    const handleBlurSlider = () => {
        let mark = { studentId: studentId, taskId: task.id, standardId: Number(id), met: currentScore >= 0, score: currentScore }
        dispatchFormUpdate({type: 'TOGGLE_STANDARD_OBSERVATION', mark: mark})
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper className={classes.paper} elevation={12}>
                <div style={{paddingTop: '8px', paddingBottom: '8px', paddingLeft: '3px', paddingRight: '3px'}}>
                    <Tooltip classes={tooltipClass} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={description}>
                        <Typography noWrap={true} align={'left'}>{description}</Typography>
                    </Tooltip>
                </div>
                <div style={{paddingTop: '16px', paddingBottom: '8px', paddingLeft: '3px', paddingRight: '3px'}}>
                    <ScoreSlider
                        id={id}
                        type={'standard'}
                        initialValue={score}
                        handleScoreChange={handleScoreChange}
                        handleBlur={handleBlurSlider}
                        maxTick={MAX_STANDARD_SCORE}
                    />
                </div>
            </Paper>
        </Grid>
    )
}

