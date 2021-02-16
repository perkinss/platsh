import React, { useState , useEffect, useContext } from 'react'
import { Typography, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddRounded'
import AssessmentForm from "./AssessmentForm"
import AssessmentList from "./AssessmentList"
import SharedAssessmentList from "./SharedAssessmentList";

export default function ConfigureAssessments(props) {
    const { setShowSnackbar, classes } = props;

    const [showAssessmentForm, setShowAssessmentForm] = useState(false)
    const [showSharedAssessmentList, setShowSharedAssessmentList] = useState(false)
    const [coursesLoading, setCoursesLoading] = useState(false)
    const [courseList, setCourseList] = React.useState([])
    const [templateAssessment, setTemplateAssessment] = useState(null)

    const showAssessmentAndClearTemplate = (showForm) => {
        setTemplateAssessment(null)
        setShowAssessmentForm(showForm)
    }

    const handleClickPlus = (event) => {
        showAssessmentAndClearTemplate(true)
    }

    const handleCopyAssessment = (assessment) => {
        setTemplateAssessment(assessment)
        setShowAssessmentForm(true)
    }

    const handleClickFromTemplate = (event) => {
        setShowSharedAssessmentList(true)
    }

    /**
     * an effect to fetch all the courses during page load
     */
    useEffect(() => {
        setCoursesLoading(true)
        fetch('/api/courses')
            .then(res => res.json())
            .then(
                (result) => {
                    setCourseList(result)
                    setCoursesLoading(false)
                },
                (error) => {
                    console.log("Error:", error)
                    setCoursesLoading(false)
                }
            )
    },[]);


    return <div className={classes.content}>
        <AssessmentList
            setShowAssessmentForm={showAssessmentAndClearTemplate}
            showAssessmentForm={showAssessmentForm}
            setShowSnackbar={setShowSnackbar}
        />
        {showSharedAssessmentList ?
            <SharedAssessmentList
                setShowSharedAssessmentList={setShowSharedAssessmentList}
                handleCopyAssessment={handleCopyAssessment}
            /> : ''
        }
        {showAssessmentForm ?
            <AssessmentForm
                classes={classes}
                setShowAssessmentForm={showAssessmentAndClearTemplate}
                showAssessmentForm={showAssessmentForm}
                setShowSnackbar={setShowSnackbar}
                coursesLoading={coursesLoading}
                courseList={courseList}
                templateAssessment={templateAssessment}
            /> : ''
        }
        { !(showAssessmentForm || showSharedAssessmentList) ?
            <>
                <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={handleClickPlus}>
                    <AddIcon/>
                </Fab>
                <Fab color="secondary" variant="extended" aria-label="Add from template" onClick={handleClickFromTemplate}>
                    Create From Template
                </Fab>
            </> : ''
        }

        <br />
        <br />
    </div>
}