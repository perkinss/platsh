import React from 'react';
import {Button, Container, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
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
}));

function ErrorContent(props) {
    const classes = useStyles()
    return (
        <React.Fragment>
            <Container maxWidth={'lg'}>
                <div className={classes.content}>
                    <div className={classes.toolbar} />
                    <Typography variant={'h5'}>
                        Something went wrong
                    </Typography>
                    <Typography variant={'body1'}>
                        Oops!  We failed to meet the standard!  0/0 on web design.  Please try again and let us know if this problem persists.
                    </Typography>
                    <p>
                        <Button href="/" variant="contained" color="primary">
                            Home
                        </Button>
                    </p>
                </div>
            </Container>
        </React.Fragment>
    )
}

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return (<ErrorContent />)
        }

        return this.props.children
    }
}
