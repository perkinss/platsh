import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {useTheme, withStyles} from '@material-ui/core/styles';
import { Paper, Grid} from '@material-ui/core';
import MaterialTable from 'material-table'
import { ConfigurationContext } from "../../context/ConfigurationContext";
import timeSince from "../../helpers/date_helper";

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

function ReportingPeriodList(props) {
    const { classes, setShowForm, setShowSnackbar } = props
    const { dispatch, state } = useContext(ConfigurationContext)
    const theme = useTheme()

    const formatTopics = (row) => {
        return row.contents.reduce((topics, topic) => {
            return topics === '' ? topic.name : topics + ", " + topic.name
        }, '')
    }

    const filterTopics = (term, rowData) => {
        return rowData.contents.find( topic => topic.name.search(term) >= 0 )
    }

    const filterSections = (term, rowData) => {
        return rowData.section.name.includes(term)
    }

    const removePeriodFromTable = (period) => {
        dispatch({ type: 'REMOVE_REPORTING_PERIOD', reporting_period_id: period.id })
    }

    const handleSelectRow = (event, period) => {
        dispatch({ type: 'SET_SELECTED_PERIOD', period: period})
    }

    const formatDate = (dateString) => {
        if (dateString && 'string' === typeof dateString ) {
           return new Date(Date.parse(dateString)).toDateString()
        } else {
           return ''
        }
    }

    const handleDeletePeriod = (event, period) => {
        setShowForm(false)
        let token = document.querySelector('head>meta[name="csrf-token"]').content

        fetch(`api/reporting_periods/${period.id}`,
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
                    removePeriodFromTable(response.deleted)
                }
            })
            .catch(error => console.log("ERROR: ", error))
    }

    return (
        <Paper className={classes.root}>
            <Grid container spacing={0} alignContent={'space-between'} alignItems={'flex-start'}>
                <Grid item xs={12} xl={12}>
                    <MaterialTable
                        options={{filtering: true}}
                        className={classes.table}
                        title={"Reporting Periods"}
                        data={state.reporting_periods}
                        columns={[
                            {title: 'Name', field: 'name'},
                            {
                                title: 'Topics',
                                field: 'contents',
                                render: rowData => formatTopics(rowData),
                                customFilterAndSearch: filterTopics,
                            },
                            {
                                title: 'Section',
                                field: 'section',
                                render: rowData => rowData.section.name,
                                customFilterAndSearch: filterSections,
                            },
                            {
                                title: 'Start Date',
                                field: 'period_start',
                                render: rowData => formatDate(rowData.period_start)
                            },
                            {
                                title: 'End Date',
                                field: 'period_end',
                                render: rowData => formatDate(rowData.period_end)
                            },
                            {
                                title: 'Last Updated',
                                field: 'updated_at',
                                render: rowData => timeSince(new Date(rowData.updated_at)),
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
                            {
                                icon: 'delete',
                                tooltip: 'Delete Reporting Period',
                                onClick: (event, rowData) => {
                                    if (confirm("You sure you want to delete?")) {
                                        handleDeletePeriod(event, rowData)
                                    }
                                }
                            }
                        ]}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

ReportingPeriodList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReportingPeriodList);