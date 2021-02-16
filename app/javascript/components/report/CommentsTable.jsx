import React, {useContext, useEffect, useState} from 'react';
import { useTheme } from "@material-ui/styles/index";
import MaterialTable from 'material-table'
import { IconButton, Paper, Snackbar, SnackbarContent, Typography, Slide } from "@material-ui/core";
import timeSince from "../../helpers/date_helper";
import FileCopyIcon from "@material-ui/icons/FileCopy"
import classNames from "classnames";
import CloseIcon from '@material-ui/icons/Close';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import {ReportsContext} from "../../context/ReportsContext";

export default function CommentsTable(props) {
    const { classes, student, section } = props;
    const { state, dispatch } = useContext(ReportsContext)
    const [loading, setLoading] = useState([])
    const [showSnackbar, setShowSnackbar] = useState({ open:false, variant:"success", message:"Successfully Saved!" })
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar({ open:false })
    }

    const TransitionDown = (props) => {
        return <Slide {...props} direction="down" />;
    }

    const copyToClipboard = (commentText) => {
        let temp = document.createElement("textarea");
        document.body.appendChild(temp);

        temp.value = commentText;
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        setShowSnackbar({ open: true, message: "Copied to clipboard!" })
    }

    const handleCopyClick = (event, rows) => {
        let commentText = rows.map(datum => datum.comment.trim()).join("  ").trim()
        copyToClipboard(commentText)
    }

    useEffect(()=> {
        setLoading(true)
        fetch(`api/comments/${section.id}/student/${student.id}`)
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({ type: 'SET_COMMENTS_FROM_FETCH', comments: result})
                    setLoading(false)
                },
                (error) => {
                    setLoading(false)
                    console.log("Error:", error)
                }
            )
    },[student])

    return (
        <Paper elevation={9} style={{margin: '30px 10px', padding: '0'}}>
            <MaterialTable
                options={{filtering: true, selection: true}}
                actions={[
                    {
                        icon: () => <FileCopyIcon />,
                        tooltip: 'Copy selected comments to clipboard',
                        onClick: handleCopyClick
                    },
                    ]}
                className={classes.table}
                title={<>
                    <Typography align={"left"}>Comments</Typography>
                    <Typography variant={"caption"}>Note: Comments can only be viewed by you, not by your students.</Typography>
                </>}
                data={state.comments}
                columns={[
                    {
                        title: 'First written',
                        field: 'created_at',
                        render: rowData => timeSince(new Date(rowData.created_at)),
                    },
                    {title: 'Assessment',field: 'assessment'},
                    {title: 'Task', field: 'task'},
                    {title: 'Comment', field: 'comment'}
                ]}/>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                autoHideDuration={1000000000}
                onClose={handleCloseSnackbar}
                open={showSnackbar.open}
                TransitionComponent={TransitionDown}
            >
                <SnackbarContent
                    className={classNames(classes.snackbar, classes[showSnackbar.variant])}
                    message={
                        <span id="configure-snackbar" className={classes.message}>
                          <SuccessIcon color={"primary"} className={classNames(classes.icon, classes.iconVariant)} />
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
        </Paper>
    );
}