import React, {useState, useEffect, useContext} from 'react'
import { TextField, IconButton, Typography, Tooltip, Grid, Divider } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import AddComment from '@material-ui/icons/AddCommentRounded'
import Edit from '@material-ui/icons/Edit'

export default function CommentWidget(props) {
    const { id, comment, handleComment, taskId, studentId, dispatchFormUpdate, classes } = props
    const theme = useTheme()
    const [showField, setShowField] = useState(false)

    const toggleComment = () => {
        setShowField (!showField)
    }

    const handleKeydown = (event) => {
        if (event.which === 13 || event.which === 9 || event.which === 27) {
            setShowField(!showField)
            dispatchFormUpdate({type: 'SET_STUDENT_COMMENT', commentData: {studentId: studentId, taskId: taskId, comment: comment}})
        }
    }

    const handleBlur = (event) => {
        setShowField(!showField)
        dispatchFormUpdate({type: 'SET_STUDENT_COMMENT', commentData: {studentId: studentId, taskId: taskId, comment: comment}})
    }

    const icon = comment ?  <Tooltip title={'Edit comment'}><Edit /></Tooltip> : <Tooltip title={"Add comment"}><AddComment/></Tooltip>

    let displayedContent = null

    if (showField) {
        displayedContent =  <TextField
            id="standard-multiline-flexible"
            label="Comment"
            name={id}
            multiline
            rowsMax="6"
            value={comment}
            onChange={handleComment}
            margin="normal"
            fullWidth={true}
            onKeyDown={handleKeydown}
            autoFocus
            onBlur={handleBlur}
        />
    } else {
        displayedContent =  (
            <React.Fragment>
            {comment && <Tooltip title={comment}><Typography noWrap={true} paragraph onClick={toggleComment}>{comment}</Typography></Tooltip>}
            <IconButton onClick={toggleComment} color={"secondary"} >
                {icon}
            </IconButton>
            </React.Fragment>
        )
    }

    return (

        <Grid container alignItems={'flex-start'} style={{textAlign: 'left'}}>
            <Divider />
            <Grid item xs={12} xl={12}>

            {displayedContent}
            </Grid>
        </Grid>
    )

}