import React from 'react'
import { Card, Divider, Grid, Typography } from "@material-ui/core";
import ContentStandardObservationList from "./ContentStandardObservationList";
import CompetencyObservationList from "./CompetencyObservationList";

export default function StudentTaskObservation(props) {
    const { task, studentId, studentObservations, dispatchFormUpdate, isHolistic, classes } = props

    const gridSize = isHolistic ? { xs: 12 } : { xs: 12, sm:4, md: 3, lg: 2 }
    const shouldDisplay = task.competencies.length > 0
    return (
        <Grid item key={task.name} {...gridSize} >
            <Card className={classes.paper}>
                <Typography variant={'h6'}> {task.name}</Typography>
                <Divider />
                <ContentStandardObservationList
                    task={task}
                    classes={classes}
                    studentId={studentId}
                    standardObservations={studentObservations.marks[task.id] || []}
                    dispatchFormUpdate={dispatchFormUpdate}
                    isHolistic={isHolistic}
                />
                <div style={shouldDisplay ? {display: 'block'} : {display: 'none'} }> <br/><Divider/><br/></div>
                <CompetencyObservationList
                    studentId={studentId}
                    task={task}
                    dispatchFormUpdate={dispatchFormUpdate}
                    scores={studentObservations.competencies[task.id] || {}}
                    comment={studentObservations.comments.find((comment) => comment.task_id == task.id) || {}}
                    classes={classes}
                    isHolistic={isHolistic}
                />
            </Card>
        </Grid>
    )
}