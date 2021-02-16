import React, {useContext, useReducer} from 'react'
import { Grid, Card, ListItem, ListSubheader } from '@material-ui/core'
import { useTheme } from "@material-ui/core/styles";
import StudentHeader from './StudentHeader'
import { makeStyles } from '@material-ui/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { studentAssessmentReducer } from '../../reducers/studentAssementReducer'
import {ConfigurationContext} from "../../context/ConfigurationContext";
import StudentTaskObservation from "./StudentTaskObservation"

const HOLISTIC_SCORING_TYPE = 'Holistic'

const useStyles = makeStyles(theme => ({
    sticky: {
        top: theme.spacing(16),
    },
}));

export default function StudentAssessment(props) {
    const theme = useTheme()
    const { student, selectedAssessment, studentObservations, assessmentDate, classes, loading } = props

    const stickyClass = useStyles()

    const [inProgressStudentObservations, dispatchFormUpdate] = useReducer(studentAssessmentReducer, studentObservations, (initialValue) => ({...initialValue}))

    const { state } = useContext(ConfigurationContext)
    if (loading || state.available_competencies.length === 0 || state.available_standards.length === 0) {
        return loadingSkeleton(theme, classes)
    }

    const assessmentCompetency =  selectedAssessment.competency ? state.available_competencies.find(competency => competency.id === selectedAssessment.competency) : null
    const isHolistic = selectedAssessment.scoring_type && selectedAssessment.scoring_type.name === HOLISTIC_SCORING_TYPE

    return (
        <div>
            <ListSubheader className={stickyClass.sticky} style={{zIndex: 20}}>
                <StudentHeader
                    assessmentCompetency={assessmentCompetency}
                    standard={null}
                    classes={classes}
                    student={student}
                    tasks={selectedAssessment.tasks}
                    assessmentId={selectedAssessment.id}
                    storedStudentObservations={studentObservations}
                    inProgressStudentObservations={inProgressStudentObservations}
                    dispatchFormUpdate={dispatchFormUpdate}
                    assessmentDate={assessmentDate}
                    isHolistic={isHolistic}
                />
            </ListSubheader>
                {selectedAssessment &&
                    <ListItem>
                <Grid container spacing={theme.spacing(.5)} alignContent={'center'}>
                    {selectedAssessment.tasks.map((task) => {
                        return (
                            <StudentTaskObservation
                                key={`task-${task.id}`}
                                task={task}
                                studentId={student.id}
                                studentObservations={inProgressStudentObservations}
                                dispatchFormUpdate={dispatchFormUpdate}
                                classes={classes}
                                isHolistic={isHolistic}
                            />
                        )
                    })}
                </Grid></ListItem>
                }
        </div>
    )
}

function loadingSkeleton(theme, classes) {
    return (
        <div>
                <ListSubheader>
                    <Card >
                        <Skeleton variant="rect" width={'900%'} height={150} />
                    </Card>
                </ListSubheader>

                <ListItem>
                    <Grid container spacing={theme.spacing(.5)} alignContent={'center'}>
                        <React.Fragment>
                            <Grid item xs={12} sm={4} md={3} lg={2}>
                                <Card>
                                    <Skeleton variant="rect" width={'100%'} height={300} />
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} lg={2}>
                                <Card>
                                    <Skeleton variant="rect" width={'100%'} height={300} />
                                </Card>
                            </Grid >
                            <Grid item xs={12} sm={4} md={3} lg={2}>
                                <Card>
                                    <Skeleton variant="rect" width={'100%'} height={300} />
                                </Card>
                            </Grid>
                        </React.Fragment>
                    </Grid>
                </ListItem>
        </div>
    )
}
