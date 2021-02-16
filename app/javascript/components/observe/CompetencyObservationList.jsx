import React, { useState, useContext, useEffect } from 'react'
import { Grid, Divider } from '@material-ui/core'
import CompetencyObservation from './CompetencyObservation';
import { useTheme, makeStyles } from '@material-ui/core/styles'
import CommentWidget from './CommentWidget'
import {ConfigurationContext} from "../../context/ConfigurationContext";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

export default function CompetencyObservationList (props) {
    let {task, studentId, scores, comment, dispatchFormUpdate, isHolistic, classes} = props
    classes = {...classes, ...useStyles()}
    const theme = useTheme()

    const { state } = useContext(ConfigurationContext)

    const [currentScores, setCurrentScores] = useState(scores)
    const [currentComment, setCurrentComment] = useState(comment.comment || '')

    const [labelScores, setLabelScores] = useState({})

    const handleScoreChange = (event, id, value) => {
        if (value === -1) {
            // the unmarked case:
            delete currentScores[id]
            setLabelScores({...labelScores, [id]: '' })
        } else if (value === -0) {
            setCurrentScores({...currentScores, [id]: 0})
            setLabelScores({...labelScores, [id]:'0'})
        } else {
            setCurrentScores({...currentScores, [id]: value})
            setLabelScores({...labelScores, [id]: value.toString()})
        }
    }

    const handleBlurSlider = () => {
        dispatchFormUpdate({type: 'TOGGLE_COMPETENCY_OBSERVATION', mark: { studentId: studentId, taskId: task.id, scores: currentScores } })
    }

    const handleComment = (event) => {
        setCurrentComment(event.target.value)
    }

    return (
        <React.Fragment>
            <Grid container spacing={theme.spacing(.25)} className={classes.root} alignItems={'flex-start'}>
                <Divider />
                {task.competencies.map((id, index) => {
                    const current_competency = state.available_competencies.find(competency => `${competency.id}` === `${id}` )
                    return (
                           <CompetencyObservation
                               key={index}
                               id={id}
                               description={current_competency.description}
                               handleScoreChange={handleScoreChange}
                               labelScores={labelScores}
                               handleBlur={handleBlurSlider}
                               initialValue={scores[id]}
                               isHolistic={isHolistic}
                               classes={classes}
                           />
                    )
                })}

                <Grid item xs={12}  >
                    <Divider />
                    <br/>
                <CommentWidget
                    id={`${task.id}`}
                    classes={classes}
                    comment={currentComment}
                    handleComment={handleComment}
                    studentId={studentId}
                    taskId={task.id}
                    dispatchFormUpdate={dispatchFormUpdate}
                />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}