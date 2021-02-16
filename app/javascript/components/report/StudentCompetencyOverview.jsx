import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import RadialChart from "./RadialChart";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function StudentCompetencyOverview(props) {
    const {student, course, classes, competencyData, competencyLabels, loading, graphLabels } = props
    const theme = useTheme()

    let barSize, chartHeight, nameLabelOffset,labelFontSize, radialBarOffset,valueFontSize
    if (window.innerWidth < 700) {
        barSize = 150
        chartHeight = 280
        labelFontSize = '20px'
        nameLabelOffset = 120
        radialBarOffset = 0
        valueFontSize = '20px'
    } else {
        barSize = 200
        chartHeight = 400
        labelFontSize = '25px'
        nameLabelOffset = 185
        radialBarOffset = 0
        valueFontSize = '30px'
    }

    return (
        <div style={{paddingTop: theme.spacing(5)}}>
            <Typography variant={'h5'}>Competency Overview</Typography>
            {loading && <CircularProgress color={'primary'} />}
            {!loading && competencyData &&
            <RadialChart
                classes={classes}
                key={`chart-competency-overview-${student.name}`}
                labels={competencyLabels}
                series={competencyData}
                height={chartHeight}
                radialBarSize={barSize}
                radialBarOffset={-10}
                nameLabelOffset={nameLabelOffset}
                hollowSize={'22%'}
                valueFontSize={valueFontSize}
                labelFontSize={labelFontSize}
                showToolbar={true}
            />}
        </div>

    )

}