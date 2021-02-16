import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Button, Paper, makeStyles} from '@material-ui/core';
import MaterialTable from 'material-table'
import timeSince from '../../helpers/date_helper'
import {ConfigurationContext} from "../../context/ConfigurationContext";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    button: {
        margin: theme.spacing(2)
    }
}));

function SharedAssessmentList(props) {
    const classes = useStyles()
    const { setShowSharedAssessmentList, handleCopyAssessment } = props;
    const { state, dispatch } = useContext(ConfigurationContext)
    const assessments = state.shared_assessments

    const handleSelectRow = (event, assessment) => {
        handleCopyAssessment(assessment)
    }

    const handleClose = (event) => {
        setShowSharedAssessmentList(false)
    }

    const getCourseNames = (courses) => {
        return courses.reduce((nameString, course) => {
            return nameString ? nameString + ", " + course.title : course.title
        },'')
    }

    const filterCourseNames = (term, rowData) => {
         return rowData.courses.find( course => course.title.search(term) >= 0 )
    }

    return (
        <React.Fragment>
            { assessments && assessments.length > 0 &&
            <Paper className={classes.root}>
                <MaterialTable
                    options={{filtering:true}}
                    className={classes.table}
                    data={assessments}
                    title={"Template Assessments"}
                    columns={[
                        {
                            title: 'Courses',
                            field: 'courses',
                            render: rowData => getCourseNames(rowData.courses),
                            customFilterAndSearch: filterCourseNames,
                        },
                        { title: 'Name', field: 'name' },
                        { title: 'Type', field: 'type.name' },
                        { title: 'Scoring Type', field: 'scoring_type.name' },
                        {
                            title: 'Updated',
                            field: 'updated_at',
                            render: rowData => timeSince(new Date (rowData.updated_at)),
                            filtering: false
                        }
                    ]}
                    actions={[
                        {
                            icon: 'content_copy',
                            tooltip: 'Copy Assessment',
                            onClick: (event, rowData) => {
                                handleSelectRow(event, rowData)
                            }
                        }
                    ]}
                >
                </MaterialTable>
                <Button variant="contained" color={"secondary"}  className={classes.button} onClick={handleClose} >
                    Close
                </Button>
            </Paper>}
        </React.Fragment>
    );
}
export default SharedAssessmentList;
