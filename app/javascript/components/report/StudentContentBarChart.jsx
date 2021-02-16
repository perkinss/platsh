import React from 'react'
import ReactApexChart from 'react-apexcharts'
import {useTheme} from "@material-ui/styles/index";

export default function StudentContentBarChart(props) {
    const theme = useTheme()

    const {classes, series, categories } = props

    const formatter = (val) => {
        if (val === null) {
            return "Not assessed"
        }
        return val ? val.toFixed(1) + "%" : ''
    }

    const options = {
        chart: {
            foreColor: 'lightgrey',
            background: theme.palette.grey['800'],
            events: {
                dataPointSelection: function(event, chartContext, config) {
                    let detailPanel = document.getElementById(`topic-${config.dataPointIndex}`)
                    if (detailPanel.getAttribute('name') === 'collapsed') {
                        detailPanel.click()
                    }
                    detailPanel.scrollIntoView(true)
                }
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'center',
                    maxItems: 100,
                    hideOverflowingLabels: true,
                }
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: categories,
            labels: {
                formatter: function (val) {
                    return val + "%"
                }
            },
            decimalsInFloat: 1
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                    return val.toFixed(1) + "%"
                }
            }
        },
        fill: {
            opacity: 1
        },
       theme: {
            mode: 'dark',
            palette: 'palette1',
       },
       dataLabels: {
            enabledOnSeries: true,
            textAnchor: 'start',
            offsetX: 5,
            formatter: formatter
       }
    }

    return (
        <div id="student-content-chart">
            {series && <ReactApexChart options={options} series={series} type="bar" height="400" width={"100%"}/>}
        </div>
    );
}