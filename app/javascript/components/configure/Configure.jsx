import React, {useState, useEffect, useReducer, useContext} from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Container, Snackbar, SnackbarContent, IconButton } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';
import ConfigureSections from './ConfigureSections'
import Header from '../Header'

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ConfigureAssessments from "./ConfigureAssessments";
import { ConfigurationContext } from '../../context/ConfigurationContext'
import {configReducer, initialConfigState} from "../../reducers/configurationReducer";
import ConfigureStudents from "./ConfigureStudents";
import ConfigureSchemas from "./ConfigureSchemas"
import classNames from 'classnames';
import {ROLES} from "../../model/user";
import RoleValidatingWrapper from "../RoleValidatingWrapper";
import {RootAuthContext} from "../../context/AuthenticationWrapper";
import ConfigureReports from "./ConfigureReports";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    tabs: {
        padding: theme.spacing(9,2,0,4),
        width: '91%',
        margin: 0
    },
    paper: {
        padding: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 1px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2,0,2,2),
        marginRight: 0,
    },
    title: {
        textAlign: 'center'
    },
    textField: {
        flexBasis: 600,
        width: '70%'
    },
    margin: {
        margin: theme.spacing(1),
    },
    fab: {
        margin: theme.spacing(1)
    },
    error: {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.error.contrastText
    },
    success: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.error.contrastText

    },
    icon: {
        fontSize: 20,
    },
        iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
        message: {
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'pre-wrap',
    },
});

function Configure (props) {
    const { classes } = props;
    const { currentUser } = useContext(RootAuthContext);
    const [state, dispatch] = React.useReducer(configReducer, initialConfigState)
    const theme = useTheme();
    const [showForm, setShowForm] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState({open:false,variant:"success",message:"Successfully Saved!"})
    const [tabIndex, setTabIndex] = React.useState(0);
    const [subtitle, setSubtitle] = useState('Sections')
    const subtitles = ["Sections", "Assessments", "Reporting Periods", "Marking Schemas", "Students"]

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar(false)
    }

    const handleChangeIndex = (index) => {
        setTabIndex(index)
        setSubtitle(subtitles[index])
    }

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
        setSubtitle(subtitles[newValue])
    }

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        fetch('/api/sections')
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({type: 'SET_SECTIONS', sections: result})
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        fetch('/api/assessments')
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({type: 'SET_ASSESSMENTS', assessments: result})
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        fetch('/api/assessments/shared')
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({type: 'SET_SHARED_ASSESSMENTS', assessments: result})
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        fetch('/api/students/list')
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({type: 'SET_STUDENTS', students: result})
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    return (
        <React.Fragment>
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: state}} >
                <Header currentPage={`Configure ${subtitle}`}>
                <Container className={classes.tabs} maxWidth={'xl'}>
                    <RoleValidatingWrapper allowedRoles={[ROLES.TEACHER]}>
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            indicatorColor="secondary"
                            textColor="secondary"
                            variant="fullWidth"
                        >
                            <Tab label="Sections" />
                            <Tab label="Assessments" />
                            <Tab label="Reports" />
                            <Tab label="Schemas" />
                            <Tab label="Students" />

                        </Tabs>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={tabIndex}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabContainer dir={theme.direction}>
                                <ConfigureSections
                                    setShowSnackbar={setShowSnackbar}
                                    setShowForm={setShowForm}
                                    showForm={showForm}
                                    classes={classes}
                                />

                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                <ConfigureAssessments
                                    setShowSnackbar={setShowSnackbar}
                                    setShowForm={setShowForm}
                                    showForm={showForm}
                                    classes={classes}
                                />
                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                <ConfigureReports
                                    classes={classes}
                                    setShowSnackbar={setShowSnackbar}
                                />
                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                <ConfigureSchemas

                                    setShowSnackbar={setShowSnackbar}
                                    setShowForm={setShowForm}
                                    showForm={showForm}
                                    classes={classes}
                                />

                            </TabContainer>
                            <TabContainer dir={theme.direction}>
                                <ConfigureStudents
                                    setShowSnackbar={setShowSnackbar}
                                    classes={classes}
                                />
                            </TabContainer>
                        </SwipeableViews>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            variant={showSnackbar.variant}
                            open={showSnackbar.open}
                        >
                            <SnackbarContent
                                className={classNames(classes.snackbar, classes[showSnackbar.variant])}
                                message={
                                    <span id="configure-snackbar" className={classes.message}>
                                        {(showSnackbar.variant === "error") ? <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                                            : <SuccessIcon className={classNames(classes.icon, classes.iconVariant)} />
                                        }
                                        {showSnackbar.message}
                                    </span>
                                }
                                action={[
                                    <IconButton key="close" aria-label="Close" color="inherit" onClick={handleCloseSnackbar}>
                                        <CloseIcon className={classes.icon} />
                                    </IconButton>,
                                ]}
                            />
                        </Snackbar>
                    </RoleValidatingWrapper>
                </Container>
                </Header>
            </ConfigurationContext.Provider>
        </React.Fragment>
    );

}
export default withStyles(styles)(Configure);


function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} >
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};
