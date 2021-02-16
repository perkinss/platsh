import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import MaterialTable, { customFilterAndSearch } from 'material-table'
import timeSince from '../../helpers/date_helper'
import {ConfigurationContext} from "../../context/ConfigurationContext";

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

function AssessmentList(props) {
    const { classes, setShowAssessmentForm, setShowSnackbar } = props;
    const { state, dispatch } = useContext(ConfigurationContext)
    const assessments = state.assessments

    const handleSelectRow = (event, assessment) => {
        dispatch({type:'SET_CURRENT_ASSESSMENT', assessment: assessment})
        setShowAssessmentForm(true)
    }

    const handleDeleteAssessment = (event, assessment) => {
        setShowAssessmentForm(false)
            let token = document.querySelector('head>meta[name="csrf-token"]').content

            fetch(`api/assessments/${assessment.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                })
                .then(res => res.json())
                .then(response => {
                    if (response.deleted) {
                        setShowSnackbar({open:true,variant:"success",message:"Your wish is my command."})
                        dispatch({type: 'REMOVE_ASSESSMENT', id: assessment.id})
                    }
                })
                .catch(error => console.log("ERROR: ", error))
    }

    const getSectionNames = (sections) => {

        return sections.reduce((nameString, section) => {
            return nameString ? nameString + ", " + section.name : section.name
        },'')
    }

    const filterSectionNames = (term, rowData) => {
         return rowData.sections.find( section => section.name.search(term) >= 0 )
    }

    const deletableAssessment = (rowData) => {
        if (rowData.tasks.find(task => !task.deletable)) {
            return false
        } else {
            return true
        }
    }

    return (
        <React.Fragment>
            { assessments && assessments.length > 0 &&
            <Paper className={classes.root}>
                <MaterialTable
                    options={{filtering:true}}
                    className={classes.table}
                    data={assessments}
                    title={"Assessments"}
                    columns={[
                        { title: 'Name', field: 'name' },
                        { title: 'Type', field: 'type.name' },
                        { title: 'Number of Tasks', field: 'tasks.length' },
                        {
                            title: 'Section',
                            field: 'sections',
                            render: rowData => getSectionNames(rowData.sections),
                            customFilterAndSearch: filterSectionNames,
                        },
                        {
                            title: 'Updated',
                            field: 'updated_at',
                            render: rowData => timeSince(new Date (rowData.updated_at)),
                            filtering: false
                        }
                    ]}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit Assessment',
                            onClick: (event, rowData) => {
                                handleSelectRow(event, rowData)
                            }
                        },
                        rowData => ({
                            icon: 'delete',
                            tooltip: deletableAssessment(rowData) ? 'Delete Assessment' : '',
                            disabled: !deletableAssessment(rowData),
                            onClick: (event, rowData) => {
                                if (confirm("You sure you want to delete?")) {
                                    handleDeleteAssessment(event, rowData)
                                }
                            }
                        })
                    ]}
                >
                </MaterialTable>
            </Paper>}
        </React.Fragment>
        );
}



AssessmentList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssessmentList);