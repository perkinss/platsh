import React, {useState} from 'react'
import {Typography, Container, Paper, Snackbar, SnackbarContent, IconButton} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ErrorIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CloseIcon from '@material-ui/icons/Close';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import Header from '../Header'
import SchoolForm from './SchoolForm'
import classNames from "classnames";
import RoleValidatingWrapper from "../RoleValidatingWrapper";
import {ROLES} from "../../model/user";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        marginLeft: theme.spacing(10)
    },
    paper: {
        padding: theme.spacing(10),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    error: {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.error.contrastText
    },
    success: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.error.contrastText

    },
    button: {
        margin: theme.spacing(2)
    },
}));

export default function Account(props) {
    const classes = useStyles()

    const [showSnackbar, setShowSnackbar] = useState({open:false,variant:"success",message:"Successfully Saved!"})

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar(false)
    }

    return (
        <React.Fragment>
            <Header currentPage={"Account"} />
                <Container maxWidth={'lg'}>
                    <div className={classes.content}>
                        <div className={classes.toolbar} />
                        <RoleValidatingWrapper allowedRoles={[ROLES.TEACHER]}>
                            <Typography variant="h2" >
                                Account
                            </Typography>
                            <Paper className={classes.paper}>
                                <SchoolForm classes={classes} setShowSnackbar={setShowSnackbar} />
                            </Paper>
                        </RoleValidatingWrapper>
                    </div>
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
                </Container>
        </React.Fragment>
    );
}
