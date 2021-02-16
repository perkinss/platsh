import React, {useContext, useState} from 'react'
import {Typography, CircularProgress, Paper, Collapse, IconButton} from '@material-ui/core'
import StudentStandardReportBarChart from "./StudentStandardReportBarChart";
import ExpandMore from '@material-ui/icons/ExpandMoreRounded'
import ExpandLess from '@material-ui/icons/ExpandLessRounded'

export default function ContentStandardsProgressReport(props) {
    const { loading, report, observedStandards = {} } = props
    const [expanded, setExpanded] = useState({})

    const handleExpandClick = (index) => {
        if (expanded && expanded[index]) {
            setExpanded({...expanded, [index]: false})
        } else {
            setExpanded({...expanded, [index]: true})
        }
    }

    const noMarkScore = (standardId) => {
        return observedStandards[standardId] ? 0 : null
    }

    return (
            loading || report.length === 0
            ?
                <React.Fragment>
                    <Typography variant={'h5'}>Content Standards Detailed Progress Report{ loading || !report ? '' : ` for ${report.title}`}</Typography>
                    <CircularProgress />
                </React.Fragment>
            :
                <React.Fragment>
                    <Typography variant={'h5'}>Content Standards Detailed Progress Report{ loading || !report ? '' : ` for ${report.title}`}</Typography>
                    {
                        report.course_marks.map((content, index) => {
                        return (
                            <Paper key={content.id} elevation={5} style={{margin: '30px 10px', padding: '20px 0'}}>
                                <Typography
                                    key={content.name}
                                    name={expanded[index] ? 'expanded' : 'collapsed'}
                                    id={`topic-${index}`}
                                    variant={'h6'}
                                    onClick={() => {handleExpandClick(index)}}
                                    onFocus={() => {handleExpandClick(index)}}
                                >{content.name} {expanded[index] ? <ExpandLess /> : <ExpandMore />}</Typography>
                                <Collapse
                                    in={expanded[index]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <StudentStandardReportBarChart
                                        key={content.id}
                                        series={ [{data: content.marks.map( mark => mark.mark || noMarkScore(mark.id) ), name: 'Grade'}]}
                                        categories={content.marks.map( mark=> mark.description)}
                                    />
                                </Collapse>
                            </Paper>
                        )

                    })}
            </React.Fragment>
    )

}