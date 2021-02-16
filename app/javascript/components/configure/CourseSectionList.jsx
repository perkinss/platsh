import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button } from '@material-ui/core';
import MaterialTable from 'material-table'
import moment from 'moment'
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

function CourseSectionList(props) {
    const { classes } = props;
    const { state, dispatch } = useContext(ConfigurationContext)
    const sections = state.sections

    const formatCourses = (row) => {
         return row.courses.reduce((courses, course) => {
               return courses === '' ? course.title : courses + ", " + course.title
            }, '')
    }

    const formatGrades = (row) => {
        return row.courses.reduce((grades, grade) => {
            return grades === '' ? grade.grade : grades + ", " + grade.grade
        }, '')
    }

    const handleSelectRow = (event, section) => {
        dispatch({type:'SET_SELECTED_SECTION', section: section})
    }

    const handleDeleteRow = (event, section) => {
        let token = document.querySelector('head>meta[name="csrf-token"]').content

        fetch(`api/sections/${section.id}`,
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
                dispatch({type:'REMOVE_SECTION', id: section.id})
            })
            .catch(error => console.log("ERROR: ", error))
    }

    const filterCourseTitles = (term, rowData) => {
        return rowData.courses.find( course => course.title.search(term) >= 0 )
    }

    const filterGrades = (term, rowData) => {
        return rowData.courses.find ( course => course.grade && course.grade.search(term) >=0 )
    }

    const filterEnrollment = (term, rowData) => {
        if (Number(term)) {
            return rowData.students.length === Number(term)
        } else {
            let foundStudents = state.students.filter( student => Object.keys(rowData.students).includes(`${student.id}`))
            return foundStudents.find ( student => student.name.toLowerCase().search(term.toLowerCase()) >=0 )
        }
    }

    return (
        <React.Fragment>
            {sections && sections.length > 0 &&
            <Paper className={classes.root}>
                <MaterialTable
                    options={{filtering: true}}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit Section',
                            onClick: (event, rowData) => {
                                handleSelectRow(event, rowData)
                            }
                        },
                        rowData => ({
                            icon: 'delete',
                            tooltip: rowData.assessments ? rowData.assessments.length > 0 ? '' : 'Delete Section' : '',
                            disabled: rowData.assessments ? rowData.assessments.length > 0 : false,
                            onClick: (event, rowData) => {
                                if (confirm("You sure you want to delete?")) {
                                    handleDeleteRow(event, rowData)
                                }
                            }
                        })
                    ]}
                    className={classes.table}
                    title={"Sections"}
                    data={sections}
                    columns={[
                        {title: 'Name', field: 'name'},
                        {
                            title: 'Courses',
                            field: 'courses',
                            render: rowData => formatCourses(rowData),
                            customFilterAndSearch: filterCourseTitles,
                        },
                        {
                            title: 'Grades',
                            field: 'grades',
                            render: rowData => formatGrades(rowData),
                            customFilterAndSearch: filterGrades,
                        },
                        {
                            title: 'Enrollment',
                            field: 'students',
                            render: rowData => rowData.students ? rowData.students.length : '0',
                            customFilterAndSearch: filterEnrollment,
                        },
                        {
                            title: 'Assessments',
                            field: 'assessments',
                            render: rowData => rowData.assessments ? rowData.assessments.length : '0'
                        },
                        {
                            title: 'Updated',
                            field: 'updated_at',
                            render: rowData => timeSince(new Date(rowData.updated_at)),
                            filtering: false
                        }
                    ]}/>

            </Paper>
            }
        </React.Fragment>
    );
}

CourseSectionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CourseSectionList);