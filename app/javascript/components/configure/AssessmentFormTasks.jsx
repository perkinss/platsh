import React from 'react'
import {Button, Grid, Typography} from "@material-ui/core";
import EditableTaskForm from "./EditableTaskForm";
import NewTaskForm from "./NewTaskForm";
import {useTheme} from "@material-ui/core/styles";

function AssessmentFormTasks(props) {
    let { classes, selectedCourses, selectedCompetency, isHolistic, currentTasks, showTaskForm, showNewTask, handleDeleteTask, loading } = props
    const theme = useTheme()

    const hasTasks = () => currentTasks && currentTasks.length > 0

    if (isHolistic) {
        return (
            <Grid container alignContent={'stretch'} alignItems={'stretch'} spacing={theme.spacing(.25)}>
                <Grid item xs={12} xl={12}>
                    <Typography variant={'h5'}>Task</Typography><Typography variant={'subtitle2'}>
                    Add standards and at least one competency to a holistic task.</Typography>
                </Grid>
                {hasTasks() && currentTasks.map((task) => {
                    return (
                        <Grid key={`task-${task.id || task.name}`} item  xs={12}>
                            <EditableTaskForm
                                assessmentCompetencyId={selectedCompetency}
                                classes={classes}
                                selectedCourses={selectedCourses}
                                isHolistic={isHolistic}
                                possiblyNewTask={task}
                                handleDeleteTask={handleDeleteTask}
                                loading={loading}
                                editMode={false} />
                        </Grid>
                    )
                })}

                {!hasTasks() &&
                <Grid item xs={12}>
                    <NewTaskForm
                        setShowTaskForm={showNewTask}
                        classes={classes}
                        selectedCourses={selectedCourses}
                        isHolistic={isHolistic}
                        handleDeleteTask={handleDeleteTask}
                        assessmentCompetencyId={selectedCompetency}
                    />
                </Grid>
                }
            </Grid>
        )
    }

    return (
        <Grid container alignContent={'stretch'} alignItems={'stretch'} spacing={theme.spacing(.25)}>
            <Grid item xs={12} xl={12}>
                <Typography variant={'h5'}>Tasks</Typography><Typography variant={'subtitle2'}>
                Add at least one task to an assessment, and at least one competency.</Typography>
            </Grid>
            {currentTasks && currentTasks.map((task) => {
                return (
                    <Grid key={`task-${task.id || task.name}`} item  xs={12} sm={6} md={4} lg={3} xl={2}>
                        <EditableTaskForm
                            assessmentCompetencyId={selectedCompetency}
                            classes={classes}
                            selectedCourses={selectedCourses}
                            possiblyNewTask={task}
                            handleDeleteTask={handleDeleteTask}
                            loading={loading}
                            editMode={false} />
                    </Grid>
                )
            })}

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                {showTaskForm &&
                <NewTaskForm
                    setShowTaskForm={showNewTask}
                    classes={classes}
                    selectedCourses={selectedCourses}
                    handleDeleteTask={handleDeleteTask}
                    assessmentCompetencyId={selectedCompetency}
                />
                }
                <Button
                    id={'add-task-button'}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => showNewTask(true)}
                >
                    Add Tasks
                </Button>
            </Grid>
        </Grid>
    )
}

export default AssessmentFormTasks
