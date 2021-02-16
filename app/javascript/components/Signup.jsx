import React, {useContext, useState}from 'react';
import { Redirect } from 'react-router-dom'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Header from './Header'
import { withStyles , useTheme} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Container, Typography, Snackbar, SnackbarContent, IconButton } from  '@material-ui/core';
import { RootAuthContext } from "../context/AuthenticationWrapper"
import classNames from 'classnames';

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

function Signup(props) {
  const { classes } = props
  const theme = useTheme();
  const {authenticated, setAuthenticated, authData, setAuthData} = useContext(RootAuthContext);
  if (authenticated) {
      return <Redirect to='/account' />
  }
  const [errorArray, setErrorArray] = useState([false,""]);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  if (signupSuccess) {
    return <Redirect push to={{
            pathname: '/login',
            search: "?needConfirm"
        }} />
  }
  const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorArray([false,""]);
  }

const handleSignUp = (e) => {
  e.preventDefault();
  setLoading(true);
  var csrfVal = document.querySelector('head>meta[name="csrf-token"]').content;
  var email = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();
  var password_confirmation = document.getElementById('password_confirmation').value.trim();
  var JSONData = {user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation
        },
          authenticity_token: csrfVal
      }
  fetch('/users', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(JSONData), // body data type must match "Content-Type" header
    })
    .then(response => {
      setLoading(false);
      return response.json()
    })
    .catch(error => {console.error('Error:', error);
      setErrorArray([true,'There was an error registering']);
    })
    .then(jsonResp => {
      if(jsonResp.errors) {
            var errCount = 0,msg='',errMsg;
            if(jsonResp.errors.email) {
              errCount++;
              msg += 'The given email address ' + jsonResp.errors.email[0] +'\n';
            }
            if(jsonResp.errors.password) {
              errCount++;
              msg += 'Password ' + jsonResp.errors.password[0] +'\n';
            }
            if(jsonResp.errors.password_confirmation) {
              errCount++;
              msg += 'Password confirmation ' + jsonResp.errors.password_confirmation[0] +'\n';
            }
            if(errCount > 1) {
              errMsg = 'There were errors registering:\n' + msg;
            }
            else  {
              errMsg = 'There was an error registering:\n' + msg;
            }

            setErrorArray([true,errMsg]);
        }
        else {
            //Successful account creation
            setSignupSuccess(true);

           //window.location.href='/login';
          //alert(JSON.stringify(jsonResp));
        }
    });
  }

  return (
    <React.Fragment >
      <Header currentPage={"Register"}/>
        <Container maxWidth = { 'xs' } >
          <div className={classes.content}>
            <div className={classes.toolbar}/>
            <CssBaseline/>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
              </Avatar>
              <Typography component="h1" variant="h5">
                Register for Markury
              </Typography>
              <form onSubmit={handleSignUp} className={classes.form} noValidate="noValidate" >
                <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus/>
                <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" />
                <TextField variant="outlined" margin="normal" required fullWidth name="password_confirmation" label="Confirm Password" type="password" id="password_confirmation" />
                {loading ? (<div className={classes.centerspinner}>
                <CircularProgress className={classes.progress} />
              </div>) : (<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign Up
            </Button>)}
              </form>
            </div>
          </div>
          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={errorArray[0]}
          autoHideDuration={6000}
          variant={"error"}
          >
            <SnackbarContent
              className={classNames(classes.snackbar, classes.error)}
              message={<span id="error-snackbar" className={classes.message}>
                <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} /> {errorArray[1]}
              </span>}
              action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={handleCloseSnackbar}>
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]}
            />
          </Snackbar>
    </Container>
  </React.Fragment >
  );
}

export default withStyles(styles)(Signup);
