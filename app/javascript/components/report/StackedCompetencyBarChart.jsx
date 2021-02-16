import React from 'react'
import ReactApexChart from 'react-apexcharts'
import {useTheme} from "@material-ui/styles/index";
import {CircularProgress, Typography} from "@material-ui/core";

export default function StackedCompetencyBarChart(props) {
    const theme = useTheme()

    const {title, series, categories, calcStudentGrade, barHeight, loading } = props
    if (loading){
        return (
            <>
                <CircularProgress className={theme.progress} color={'secondary'} />
                <Typography variant={"body2"}>Competency Data Loading...</Typography>
            </>
        )
    }
    let chartHeight = `${barHeight}`
    if (categories && categories.length > 0) {
        chartHeight = categories.length * barHeight
    }
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
                endingShape: 'flat',
                dataLabels: {
                    position: 'center',
                    maxItems: 100,
                    hideOverflowingLabels: window.innerWidth < 800,
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
            show: false
        },
        dataLabels: {
            formatter: function (val, opts) {
                return val.toFixed(1)
            },
            textAnchor: 'middle',
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                    return val.toFixed(1)
                }
            },
            x: {
                show: true,
                formatter: (val, {series, seriesIndex, dataPointIndex, w}) => {
                    let grade = calcStudentGrade(val,dataPointIndex)
                    return `${val}: Competency grade: ${grade}%`
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
            height: 100
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
                    height: chartHeight + 600
                },
                legend: {
                    show: false
                },
                yaxis: {
                    show: true,
                    labels: {
                        show: true
                    }
                }
            }
        },
        ]
    }

    
    return (
        <div id="stacked-competency-chart">
            <Typography variant={'h5'}>Competencies</Typography>
            { (series && series.length > 0) ?
                <ReactApexChart options={options} series={series} type="bar" height={`${chartHeight}`} />
                :
                <Typography variant={"caption"}>No data available</Typography>
            }

        </div>
    );
}