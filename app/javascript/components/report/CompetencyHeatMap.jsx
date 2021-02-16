import React, { useContext } from 'react'
import { useTheme } from "@material-ui/styles/index"
import ReactApexChart from 'react-apexcharts'
import {ReportsContext} from '../../context/ReportsContext'
import {isNullOrUndefined} from "../../helpers/object_helper"

export default function CompetencyHeatMap(props) {
    const {classes, categories, data, modes } = props

    const theme = useTheme()

    const { state } = useContext(ReportsContext)

    // Here we have to get only the colors that are present in the competency overview radial graph,
    // and make sure each competency's color is that of its group represented in the overview
    // The state heatmap colors are set by the StudentSectionReport when it fetches the competencies
    let colors = [...state.heat_map_colors]
    let groups = [...(new Set( data.map( competency => competency.group)))]
    let grouped_colors = data.map( competency => {
        let index = groups.indexOf(competency.group)
        return colors[index]
    })
    var options = {
        fill: {
            colors: grouped_colors
        },
        chart: {
            height: 150,
            type: 'heatmap',
            background: theme.palette.grey[800],
            width: 300
        },
        dataLabels: {
            enabled: true,
            hideOverflowingLabels: true,
            formatter: (value, { seriesIndex, dataPointIndex, w}) => {
                return !isNullOrUndefined(value) ? value.toFixed(1) : ''
            },
            style: {
                colors: [theme.palette.grey[200]]
            }
        },
        colors: grouped_colors,
        series: data,
        xaxis: {
            type: 'category',
            categories: categories,
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            show: true,
            opposite: true,
            labels: {
                show:  true,
                formatter: (value, index)=> {
                    if (data[index] && !isNullOrUndefined(modes[data[index].id])) {
                        return modes[data[index].id].toFixed(1)
                    }
                    return 'MRM'
                },
                style: {
                    fontSize: '18px',
                    fontFamily: 'sans-serif bold'
                }
            },
        },
        title: {
            text: 'Hover or touch to see the competency description'
        },
        theme: {
            mode: 'dark',
            palette: 'palette1',
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            x: {
                show: true,
                formatter: (value, {series, seriesIndex, dataPointIndex, w}) => {
                    let phrase = ''
                    let count = w ? w.config.series[seriesIndex].data[dataPointIndex].count : null
                    if (!isNullOrUndefined(count)) {
                        let plural = count > 1 ? 's' : ''
                        phrase = ` -- ${count} observation${plural}`
                    }
                    return `${value} ${phrase}`
                }
            },
            y: {
                formatter: (value) => {
                    if (!isNullOrUndefined(value)) return (value).toFixed(1)
                    else return 'not marked'
                }
            }
        },
        grid: {
            show: true,
            borderColor: theme.palette.grey[800]
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: [theme.palette.grey[800]],
            width: 2,
            dashArray: 0,
        },
    }

    return (
        <div id="competency-heatmap-chart">
            <ReactApexChart options={options} series={data} type="heatmap" height="650" />
        </div>
    );
}