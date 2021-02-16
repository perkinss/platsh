import React from 'react'
import {useTheme} from "@material-ui/styles/index";
import { Typography } from '@material-ui/core'
import CompetencyHeatMap from './CompetencyHeatMap'
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CompetencyObservationTimeSeries(props) {
    const {heatMapLoading, heatMapData, competencyModes, classes} = props

    return (
        <React.Fragment>
            <Typography variant={'h5'}>Competency Progress Heatmap and Most Recent Mode (MRM)</Typography>
            { heatMapLoading || !heatMapData.data || !competencyModes ?
                <CircularProgress color={"primary"}/>
                :
                <React.Fragment>
                    {(!heatMapLoading && heatMapData && heatMapData.data && heatMapData.data.length === 0) ?
                        <Typography variant={"caption"}>Data not available</Typography>
                        :
                        <CompetencyHeatMap data={heatMapData.data} categories={heatMapData.dates} modes={competencyModes}/>
                    }
                </React.Fragment>
            }
        </React.Fragment>

    )

}