import React from 'react'
import {Fade} from "@material-ui/core/index";
import { Grid, Tooltip, Typography } from '@material-ui/core'
import StandardCheckbox from './StandardCheckbox'


export default function ContentStandardObservation (props) {
    const { id,  task, studentId, classes, description, isMet, dispatchFormUpdate } = props

    return (
        <React.Fragment key={id}>
            <Grid item key={id} xs={1} xl={1}>
                <StandardCheckbox
                    id={id}
                    taskId={task.id}
                    studentId={studentId}
                    isChecked={isMet}
                    dispatchFormUpdate={dispatchFormUpdate}
                    classes={classes} />
            </Grid>
            <Grid item key={`id-${id}`} xs={11} xl={11}>
                <Tooltip  TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title={description}>
                    <Typography
                        noWrap={true}
                        paragraph
                        align={'left'}
                        style={{paddingLeft: '10px', marginBottom: 0}}>
                        {description}
                    </Typography>
                </Tooltip>
            </Grid>
        </React.Fragment>
    )
}

