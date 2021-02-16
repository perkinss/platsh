import React, {useContext, useEffect, useState} from 'react'
import { Fab } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles/index"
import { ConfigurationContext } from "../../context/ConfigurationContext"
import AddIcon from "@material-ui/icons/AddRounded"
import ReportingPeriodForm from "./ReportingPeriodForm"
import ReportingPeriodList from "./ReportingPeriodList"

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    content: {
        padding: theme.spacing(1,2),
        align: 'center'
    }
}));

export default function ConfigureReports(props) {
    let { classes, setShowSnackbar } = props;
    const { dispatch, state } = useContext(ConfigurationContext)
    classes = {...classes, ...useStyles()}

    const [showForm, setShowForm] = useState(false)

    const handleClickPlus = () => {
        setShowForm(true)
    }

    // initial fetch of the data for the page:
    useEffect(() => {
        fetch(`/api/reporting_periods`)
            .then(res => res.json())
            .then(
                (result) => {
                    dispatch({ type: 'SET_REPORTING_PERIODS', reporting_periods: result })
                },
                (error) => {
                    //TODO:Error snackbar
                    console.log("Error:", error)
                }
            )
    },[])

    const getFab = () => {
        if(showForm || state.selected_period) {
            return null;
        }
        return (
            <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={handleClickPlus} >
                <AddIcon />
            </Fab>
        )
    }

    const getForm = () => {
        if (showForm || state.selected_period) {
            return  (
                <ReportingPeriodForm
                    classes={classes}
                    setShowForm={setShowForm}
                    setShowSnackbar={setShowSnackbar}
                />
            )
        }
    }

    return (
        <div className={classes.content}>
         <ReportingPeriodList setShowForm={setShowForm} setShowSnackbar={setShowSnackbar} />
            {getForm()}
            {getFab()}
        </div>
    )
}