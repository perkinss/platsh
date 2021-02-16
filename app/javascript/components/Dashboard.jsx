import React, { useEffect, useContext }  from 'react';
import { Typography, Container } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Header from './Header'
import CourseDashboardOverview from './dashboard/CourseDashboardOverview'
import {ConfigurationContext} from "../context/ConfigurationContext";
import {configReducer, initialConfigState} from "../reducers/configurationReducer";
import {RootAuthContext} from "../context/AuthenticationWrapper";
import RoleValidatingWrapper from "./RoleValidatingWrapper";
import {ROLES} from "../model/user";


const styles = theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(1,2),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
});

function Dashboard (props) {
    const { currentUser } = useContext(RootAuthContext);
    const [state, dispatch] = React.useReducer(configReducer, initialConfigState)
    const { classes } = props
    classes.tooltip = {
        theme: 'dark'
    }

    useEffect(() => {
        if (!currentUser.isTeacher()) {
            return
        }

        fetch('/api/courses/list')
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({type: 'SET_COURSES', courses: result})
                },
                (error) => {
                    console.log("Error:", error)
                }
            )
    },[]);

    return (
        <React.Fragment>
            <ConfigurationContext.Provider value={{dispatch: dispatch, state: state}} >
                <Header currentPage={"Dashboard"}>
                    <Container maxWidth={'xl'}>
                        <div className={classes.content}>
                            <div className={classes.toolbar} />
                            <RoleValidatingWrapper allowedRoles={[ROLES.TEACHER]}>
                                <Typography variant={'h2'}>
                                    Dashboard
                                </Typography>
                                <CourseDashboardOverview />
                            </RoleValidatingWrapper>
                        </div>
                    </Container>
                </Header>
            </ConfigurationContext.Provider>
        </React.Fragment>
    )

}
export default withStyles(styles)(Dashboard);


