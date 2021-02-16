import React from 'react'
import Checkbox from "@material-ui/core/Checkbox";

export default function StandardCheckbox(props) {

    const { id, studentId, taskId, isChecked, dispatchFormUpdate, classes } = props

    const handleChange = (event, value) => {
        let mark = { studentId: studentId, taskId: taskId, standardId: Number(id), met: value, score: value ? 1 : null }
        dispatchFormUpdate({type: 'TOGGLE_STANDARD_OBSERVATION', mark: mark})
    }

    return <Checkbox
        checked={isChecked}
        tabIndex={-1}
        onChange={handleChange}
        value={id}
        className={classes.checkbox}
    />
}
