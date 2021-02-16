import React, { useContext } from 'react'
import { Grid } from '@material-ui/core'
import ContentStandardObservation from './ContentStandardObservation'
import {ConfigurationContext} from "../../context/ConfigurationContext";
import ContentStandardHolisticObservation from "./ContentStandardHolisticObservation";
import {useTheme} from "@material-ui/styles";

export default function ContentStandardObservationList (props) {
    const {task, classes, studentId, standardObservations, dispatchFormUpdate, isHolistic } = props
    const { state } = useContext(ConfigurationContext)
    const theme = useTheme()

    const getStandard = (standardId) => state.available_standards.find(standard => `${standard.id}` === `${standardId}` )

    const isMet = (standardId) => {
        if (!standardObservations) {
            return false
        }
        return Number(standardId) in standardObservations
    }

    const getScore = (standardId) => {
        const standardIdNum = Number(standardId);
        if (!standardObservations || !standardIdNum in standardObservations) {
            return null
        }
        return standardObservations[standardIdNum]
    }

    return (
    <React.Fragment>
        <Grid container spacing={theme.spacing(isHolistic ? 0.25 : 0)} justify={'flex-start'}  alignContent={'center'} alignItems={'baseline'} >
            {Object.keys(task.standards).map((id) => {
                const currentStandard = getStandard(id)
                return (isHolistic ?
                        <ContentStandardHolisticObservation
                            key={id}
                            id={id}
                            description={currentStandard.description}
                            task={task}
                            score={getScore(id)}
                            dispatchFormUpdate={dispatchFormUpdate}
                            classes={classes}
                        /> :
                        <ContentStandardObservation
                            key={id}
                            id={id}
                            description={currentStandard.description}
                            task={task}
                            studentId={studentId}
                            isMet={isMet(id)}
                            dispatchFormUpdate={dispatchFormUpdate}
                            classes={classes}
                        />
                )
            })}

        </Grid>
    </React.Fragment>
    );
}