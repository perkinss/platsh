import React, { useState, useContext } from 'react'
import { Typography, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddRounded'
import CourseSectionList  from './CourseSectionList'
import CourseSectionForm from './CourseSectionForm'
import {ConfigurationContext} from "../../context/ConfigurationContext";

export default function ConfigureSections(props) {
    const { setShowSnackbar, setShowForm, showForm, classes } = props;
    const { state } = useContext(ConfigurationContext)
    const selectedSection = state.selected_section

    const handleClickPlus = (event) => {
        setShowForm(!showForm)
    }

    const getFab = () => {
        if(showForm || selectedSection) {
            return null;
        }
        return (
            <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={handleClickPlus} >
                <AddIcon />
            </Fab>
        );
    }

    const getForm = () => {
        if (showForm || selectedSection) {
            return  <CourseSectionForm
                setShowForm={setShowForm}
                setShowSnackbar={setShowSnackbar}
            />
        }
    }


    return (
            <div className={classes.content}>
                <CourseSectionList />
                {getForm()}
                {getFab()}
                <br />
                <br />
            </div>
        )

}