import React, {useState} from 'react'
import ReactApexChart from 'react-apexcharts'
import {useTheme} from "@material-ui/styles/index";
import {CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

export default function StackedTopicBarChart(props) {
    const theme = useTheme()

    const { series, categories, calcStudentGrade, barHeight, loading } = props

    if (loading){
        return (
            <>
                <CircularProgress className={theme.progress} color={'secondary'} />
                <Typography variant={"body2"}>Topics Data Loading...</Typography>
            </>
        )
    }
    let chartHeight = barHeight
    if (categories && categories.length > 0) {
        chartHeight = categories.length * barHeight
    }
    const hide = window.innerWidth < 600
    const options = {
        chart: {
            stacked: true,
            foreColor: 'lightgrey',
            background: theme.palette.grey[800],
        },
        grid: {
          show: true,
          borderColor: theme.palette.grey[700]
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '90%',
                dataLabels: {
                    position: 'center',
                    enabledOnSeries: true,
                    maxItems: 100,
                    hideOverflowingLabels: false,
                }
            },
        },
        xaxis: {
            show: false,
            categories: categories,
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
          labels: {
              formatter: (val) => {
                 if (typeof val === 'number') {
                     return val
                 }
                 return val.length < 27 ? val : val.substring(0,26) + '...'
              }
          }
        },
        dataLabels: {
            formatter: function (val, opts) {
                return val.toFixed(0) + "%"
            },
            textAnchor: 'middle',
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                    return val.toFixed(1) + " %"
                }
            },
            x: {
                show: true,
                formatter: (val, {series, seriesIndex, dataPointIndex, w}) => {
                    let grade = calcStudentGrade(val,dataPointIndex)
                    let msg = grade ? `${val}: Content grade: ${grade} %` : val
                    return msg
                }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            showForSingleSeries: true,
            position: 'bottom',
            horizontalAlign: 'left',
            offsetX: 60, height: 100
        },
        theme: {
            mode: 'dark',
            palette: 'palette1',
        },
        responsive: [{
            breakpoint: 600,
            options: {
                chart: {
                    width: 350,
                    height:  chartHeight + 600
                },
                legend: {
                    show: false
                }
            }
        }]
    }

    return (
        <div id="stacked-topic-chart">
            <Typography variant={'h5'}>Content</Typography>
            { (series && series.length > 0) ?
                <ReactApexChart options={options} series={series} type="bar" height={`${chartHeight}`} />
                :
                <Typography variant={"caption"}>No data available</Typography>
            }
        </div>
    );
}