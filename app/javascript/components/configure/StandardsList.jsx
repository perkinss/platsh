import React, { useContext } from 'react'
import {ConfigurationContext} from "../../context/ConfigurationContext";
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded'

const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

export default function StandardsList(props) {
    const {state} = useContext(ConfigurationContext)
    const {classes} = props
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (!state.selected_section || !state.available_content_standards) {
        return null
    }

    let panels = Array.from(state.available_content_standards).map((course) => {
        return (
            <React.Fragment key={`${course.id}`}>
            <Typography variant={'h6'}>{course.title}</Typography>
                {course.contents.map((content, index) => {
                    return (
                        <ExpansionPanel TransitionProps={{ unmountOnExit: true }}
                            key={`content-${index}`}
                            expanded={expanded === `panel-${content.id}`}
                            onChange={handleChange(`panel-${content.id}`)}
                        >
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-${index}-content`}
                                id={`panel-${index}`}
                            >
                                <Typography className={classes.heading}>{content.name}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <ul style={{flexBasis: '100%'}}>
                                    {content.standards.map((standard) => {
                                        return (
                                            <li key={`standard-${standard.id}`} style={{flexBasis: '100%'}}>
                                                {standard.description}
                                            </li>
                                        )
                                    } )}
                                </ul>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })}
            </React.Fragment>
        )
    })

    return (
        <React.Fragment>
            <Typography variant={'h5'}>Section topics and standards by course:</Typography>
                {panels}
        </React.Fragment>
    )

}