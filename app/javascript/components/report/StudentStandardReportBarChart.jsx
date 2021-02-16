import React from 'react'
import ReactApexChart from 'react-apexcharts'
import {useTheme} from "@material-ui/styles/index";
import splitSentences from "../../helpers/string_helper";

export default function StudentStandardReportBarChart(props) {
    const theme = useTheme()

    const {classes, title, series, categories, height } = props
    const formatter = (val, { seriesIndex, dataPointIndex, w}) => {
        if (val === null) {
            return "Not assessed"
        }
        return val ? val.toFixed(1) + "%" : ''
    }

    let chartHeight = height || categories.length * 80 + 50

    // adjust the y axis labels depending on the responsiveness
    let wide_yaxis_labels = splitSentences(categories, 45)
    let yaxis_labels = splitSentences(categories, 30)

    const options = {
        colors: [theme.palette.primary.main],
        chart: {
            foreColor: 'lightgrey',
            background: theme.palette.grey['800'],
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'center',
                    maxItems: 100,
                    hideOverflowingLabels: false,
                }
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        title: {
            text: title
        },
        xaxis: {
            categories: wide_yaxis_labels,
            tickAmount: 10,
            labels: {
                formatter: function (val) {
                    return val + "%"
                }
            },
            decimalsInFloat: 1,
            max: 100
        },
        yaxis: {
            labels: {
                minWidth: 150,
                maxWidth: 400,
                show: true,
                align: 'left',
                style: {
                    fontSize: '13px',
                    fontFamily: 'sans-serif bold'
                }
            }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function (val) {
                   return val + ' %'
                }
            },
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 60
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
       },
        responsive: [{
                breakpoint: 1080,
                options: {
                    legend: {
                        show: false
                    },
                    yaxis: {
                        labels: {
                            minWidth: 150,
                            maxWidth: 300,
                            show: true,
                        }
                    },
                    xaxis: {
                        categories: yaxis_labels,
                        tickAmount: 2,
                        labels: {
                            show: true,
                        }
                    }
                }
            }, {
                breakpoint: 480,
                options: {
                    legend: {
                        show: false
                    },
                    yaxis: {
                        labels: {
                            show: false,
                        }
                    },
                    xaxis: {
                        labels: {
                            show: false,
                        }
                    }
                }
            },
        ]
    }

    return (
        <div id="chart" style={{margin: '35px auto', padding: '0 10px'}}>
            {series && <ReactApexChart options={options} series={series} type="bar" height={chartHeight} />}
        </div>
    );
}