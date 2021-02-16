import React from 'react'
import {useTheme} from "@material-ui/styles/index";
import { Paper } from '@material-ui/core'
import ReactApexChart from 'react-apexcharts'

export default function HeatMap(props) {
    const {classes, series, categories, title} = props

    const theme = useTheme()

    const heatOptions = {
        dataLabels: {
            enabled: true
        },
        title: {
            text: title,
            style: {
                fontSize:  '16px',
                color:  'white',
                fontStyle: 'bold'
            },
        },
        tooltip: classes.tooltip,
        xaxis: {
            categories: categories,

            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },

        },
        yaxis: {
            show: true

        },
        chart: {
            foreColor: 'lightgrey',
            toolbar: {
                show: true,
            },
            background: theme.palette.grey['800']
        },
        theme: {
            mode: 'dark',
            palette: 'palette1',
        },
        plotOptions: {
            heatmap: {
                distributed: true,
                radius: 0,
                colorScale: {
                    ranges: [

                        {
                            from: 100,
                            to: 100,
                            name: 'complete',
                            color: '#00f2ff'
                        },
                        {
                            from: 35,
                            to: 75,
                            name: 'medium',
                            color: '#ffbb01'
                        },
                        {
                            from:-0,
                            to: 34,
                            name: 'low',
                            color: '#ff031d',

                        },
                        {
                            from: 76,
                            to: 99,
                            name: 'high',
                            color: '#00ff00',
                        },
                    ],
                }
            }

        }
    }

    series[0].data[3].y = null

    return (
            <ReactApexChart options={heatOptions} series={series} type="heatmap" height="350" />
    );

}