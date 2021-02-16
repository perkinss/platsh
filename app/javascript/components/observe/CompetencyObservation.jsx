import React from 'react'
import { Typography, Grid, Paper, Tooltip, Fade } from '@material-ui/core'
import ScoreSlider from './ScoreSlider';
import { makeStyles } from '@material-ui/core/styles'

const tooltipStyles = makeStyles(() => ({
    tooltip: {
        fontSize: "1em"
    }
}))

export default function CompetencyObservation (props) {
    let {id, description, handleScoreChange, initialValue, handleBlur, isHolistic, classes } = props
    const tooltipClass = tooltipStyles()
    const gridSize = isHolistic ? {xs: 12, sm:6, md: 4, lg: 3} : {xs: 12}

    return (
        <Grid item key={id} {...gridSize}>
            <GeneralCompetencyObservation holistic={isHolistic} classes={classes}>
                <div style={{paddingBottom: '8px', paddingLeft: '6px', paddingRight: '6px'}}>
                    <Tooltip classes={tooltipClass} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={description}>
                        <Typography
                            noWrap={true}
                            align={'left'}
                        >{description}
                        </Typography>
                    </Tooltip>
                </div>

                <div style={{paddingTop: '16px', paddingLeft: '3px', paddingRight: '3px'}}>
                    <ScoreSlider
                        id={id}
                        initialValue={initialValue}
                        handleScoreChange={handleScoreChange}
                        handleBlur={handleBlur}
                        maxTick={4}
                    />
                </div>
            </GeneralCompetencyObservation>
        </Grid>
    );
}

const GeneralCompetencyObservation = (props) => {
    return (
        props.holistic
            ?
        <Paper className={props.classes.paper} elevation={12}>
            {props.children}
        </Paper>
            :
        props.children
    )
}