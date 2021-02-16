import React from 'react'
import ReactApexChart from 'react-apexcharts'
import {useTheme} from "@material-ui/styles/index";

export default function RadialChart(props) {
    const {labels, series, height, radialBarSize, radialBarOffset,
        nameLabelOffset, hollowSize, valueFontSize, labelFontSize, showToolbar, labelFormatter} = props
    const theme = useTheme()

    const options = {

        plotOptions: {
            radialBar: {
                size: radialBarSize || 60,
                offsetY: radialBarOffset || -18,
                hollow: {
                    margin: 0,
                    size: hollowSize || '38%',
                    background: 'transparent',
                },
                dataLabels: {
                    showOn: 'always',
                    name: {
                        show: true,
                        fontSize: labelFontSize || '18px',
                        offsetY: nameLabelOffset || '50'
                    },
                    value: {
                        show: true,
                        color: theme.palette.text.primary,
                        offsetY: '-10',
                        fontSize:  valueFontSize || '18px',
                    }
                },
                track: {
                    background: theme.palette.grey['600'],
                    dropShadow: {
                        enabled: true,
                        top: 0,
                        left: 0,
                        blur: 3,
                        opacity: 0.5
                    }
                }
            },
        },
        title: {
            text: " "
        },
        chart: {
            foreColor: 'lightgrey',
            toolbar: {
                show: showToolbar ? showToolbar : false
            },
            background: theme.palette.grey['800']
        },
        theme: {
            mode: 'dark',
            palette: 'palette1',
        },
        labels: labels,

    }

    return (
            <ReactApexChart options={options} series={series} type="radialBar" height={height || 150}  />

    );
}