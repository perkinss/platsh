import React, { useEffect, useState } from 'react'
import { Typography, Grid } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

export default function StudentGradeOverview(props) {
    const { competencyTotal, contentTotal, competenciesLoading, contentLoading, courseContentWeighting } = props
    const theme = useTheme()

    const competencyLabel = competencyTotal ? competencyTotal.toFixed(0) +  ' %' : 'N/A'
    const contentLabel = contentTotal ? contentTotal.toFixed(0) +  ' %' : 'N/A'
    const [courseTotalLabel, setCourseTotalLabel] = useState('')

    const calcCourseTotal = (contentTotal, competencyTotal, topicsWeighting) => {
        if (!topicsWeighting) {
            return ((contentTotal + competencyTotal) / 2)
        } else {
            const competencyWeighting = 100 - topicsWeighting
            return ((contentTotal * topicsWeighting) + (competencyTotal * competencyWeighting)) / (competencyWeighting + topicsWeighting)
        }
    }

    useEffect(() => {
        if (courseContentWeighting && !contentLoading && !competenciesLoading) {
            let total = calcCourseTotal( contentTotal, competencyTotal, courseContentWeighting)
            setCourseTotalLabel(total ? total.toFixed(0) + ' %' : 'N/A')
        }
    },[courseContentWeighting, contentTotal, competencyTotal, contentLoading, competenciesLoading])

    return (
        <Paper style={{padding: theme.spacing(2), margin: theme.spacing(1,0,1,0)}} elevation={10}>
            <Grid container >
                <Grid item xs={12} xl={12}>
                    <Typography variant={'h4'}>Overall Score: *</Typography>
                    { (competenciesLoading || contentLoading )
                        ? <CircularProgress color={'primary'} />
                        : <Typography color='secondary' variant={'h1'}>{courseTotalLabel}</Typography>}
                    <Typography color='secondary' variant={"subtitle1"}>* Based on tasks assessed so far</Typography>
                </Grid>
                <Grid item xs={6} xl={6}>
                    <Typography variant={'h5'}>Competency Total:</Typography>
                    { competenciesLoading
                        ? <CircularProgress color={'primary'} />
                        : <Typography color='textPrimary' variant={'h3'}>{competencyLabel}</Typography>
                    }
                </Grid>
                <Grid item xs={6} xl={6} >
                    <Typography variant={'h5'}>Content Total:</Typography>
                    { contentLoading
                        ? <CircularProgress color={'primary'} />
                        : <Typography color={'textPrimary'} variant={'h3'}>{contentLabel}</Typography>
                    }
                </Grid>

            </Grid>
        </Paper>
    )
}