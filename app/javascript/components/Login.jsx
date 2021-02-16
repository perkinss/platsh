import React , {useContext, useState} from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Container, Typography, Snackbar, SnackbarContent, IconButton } from  '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Header from './Header'
import { withStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import { green } from '@material-ui/core/colors';
import { RootAuthContext } from "../context/AuthenticationWrapper"
import { Redirect } from 'react-router-dom'
import classNames from 'classnames';
import User from "../model/user";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  centerspinner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  success: {
    backgroundColor: green[600],
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
  progress: {
    margin: theme.spacing(2),
  },
});


function Login(props) {
  const { classes, location } = props;
  const theme = useTheme();
  const {authenticated, setAuthenticated, authData, setAuthData, currentUser, setCurrentUser} = useContext(RootAuthContext);
  if (authenticated) {
      if (currentUser.isTeacher()) {
          return <Redirect to='/dashboard' />
      }
      if (currentUser.isStudent()) {
          return <Redirect to='/report' />
      }
      return <Redirect to='/dashboard' />
  }
  const [errorArray, setErrorArray] = useState([false,""]);
  const [confirmOpen, setConfirmOpen] = useState(true);
  const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorArray([false,""]);
  }
  const handleCloseConfirmbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setConfirmOpen(false);
  }
  const [loading, setLoading] = useState(false);
  const handleEdvantgeLogin = (e)=> {
	  fetch('/users/auth/edvantage',  {mode: 'no-cors'})
 .catch(() => console.log("Can’t access response. Blocked by browser?"))
  };
 

  function handleLogin(e) {

    e.preventDefault();
    setLoading(true);
    const csrfVal = document.querySelector('head>meta[name="csrf-token"]').content;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const JSONData = {
      user: {
        email: email,
        password: password,
        remember_me: 1
      },
      authenticity_token: csrfVal
    }
    fetch('/users/sign_in', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(JSONData), // body data type must match "Content-Type" header
      }).then(response => {
          setLoading(false);
          return response.json();
        }).catch(error => {
          console.error('Error:', error)
          setErrorArray([true,'There was an error signing in']);
      }).then((jsonResp) => {
        if (Number.isInteger(jsonResp.id)) {
              setCurrentUser(new User(jsonResp))
              setAuthData(jsonResp);
              setAuthenticated(true);
        }
        else {
          if(jsonResp.error) {
              setErrorArray([true,jsonResp.error]);
          }
          else {
              setErrorArray([true,'There was an error signing in']);
          }
        }
      });
  }

  return (
<React.Fragment >
  <Header currentPage={"Login"}/>
    <Container maxWidth = { 'xs' } >
      <div className={classes.content}>
        <div className={classes.toolbar}/>
        <CssBaseline/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon/>
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleLogin} className={classes.form} noValidate="noValidate" >
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus/>
            <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"/>
            {loading ? (<div className={classes.centerspinner}>
                <CircularProgress className={classes.progress} />
              </div>) : (<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>)}
            <Grid container>
              <Grid item xs={12}>
                <Link href="/users/password/new" color={"secondary"} >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link href="/signup" color="secondary">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
		  <br/><br/>
		  <Divider />
		  <br/><br/>
		  <Divider variant={"fullWidth"} color={"secondary"} />
		  <Grid container>
              <Grid item xs={4}><hr/></Grid>
              <Grid item xs={4}><Typography align={"center"}> OR</Typography><br/><br/> </Grid>
              <Grid item xs={4}><hr/></Grid>
              <Grid item xs={12}>
                  <Typography component="h1" variant="h5">
                      <Button
                          fullWidth
                          variant = {"outlined"}
                          onClick={(e) => {
                              e.preventDefault();
                              window.location.href='/users/auth/edvantage';
                          }}
                      >Sign in with Edvantage</Button>
                  </Typography>
              </Grid>
          </Grid>
        </div>
      </div>
      <Snackbar
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
          }}
          open={errorArray[0]}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          variant={"error"}
      >
          <SnackbarContent
              className={classNames(classes.snackbar, classes.error)}
              message={
                  <span id="error-snackbar" className={classes.message}>
                      <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} /> {errorArray[1]}
                  </span>
              }
              action={[
                  <IconButton key="close" aria-label="Close" color="inherit" onClick={handleCloseSnackbar}>
                      <CloseIcon className={classes.icon} />
                  </IconButton>,
              ]}
          />
      </Snackbar>
      {(location.search === "?needConfirm" || location.search === "?hasConfirmed") ? (
          <Snackbar
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
              }}
              open={confirmOpen}
              autoHideDuration={6000}
              onClose={handleCloseConfirmbar}
              variant={"success"}
          >
              <SnackbarContent
                  className={classNames(classes.snackbar, classes.success)}
                  message={
                      <span id="success-snackbar" className={classes.message}>
                          <SuccessIcon className={classNames(classes.icon, classes.iconVariant)} />
                          {(location.search === "?needConfirm") ? "An email has been sent to you.\nOnce you have confirmed it you may login here."
                              : "Thank you for confirming your email address\nPlease sign in to continue"
                          }
                      </span>
                  }
                  action={[
                      <IconButton key="close" aria-label="Close" color="inherit" onClick={handleCloseConfirmbar}>
                          <CloseIcon className={classes.icon} />
                      </IconButton>,
                  ]}
              />
          </Snackbar>)
          : null
      }
    </Container>
  </React.Fragment >
  );
}
export default withStyles(styles)(Login);
