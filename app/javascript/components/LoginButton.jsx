import React , { useContext } from 'react';
import {makeStyles} from "@material-ui/core/styles/index";
import classNames from 'classnames';
import { Button,Typography } from '@material-ui/core';
import Login from "./Login"
import { RootAuthContext } from "../context/AuthenticationWrapper"
import { Redirect, Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  loginGroup: {
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        marginRight: theme.spacing(6)
    },
    welcome: {
        marginRight: theme.spacing(5),
        paddingTop: theme.spacing(1),
    }
}));
export default function LoginButton(props) {
  const authContext = useContext(RootAuthContext);
  const classes = useStyles();
  const { currentPage } = props;
  if(currentPage === 'Login') {
            return null;
  }
  function handleLogout(e) {
    e.preventDefault();
    const csrfVal = document.querySelector('head>meta[name="csrf-token"]').content;
    fetch('users/sign_out', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfVal
      }
    }).then(resp => {
      authContext.setAuthenticated(false);
      authContext.setAuthData(null);
      // need a new csrf token so we need to hit the server
      window.location.href='/';
    });
  }
  return (
    <div className={classes.loginGroup}>
        {(authContext.authenticated && authContext.currentUser) ? (<><Typography variant="button" className={classes.welcome}>{authContext.currentUser.email}</Typography> <Button className={classes.login} color="inherit" key={"Logout"} onClick={handleLogout} >Logout</Button></>
    ) : (
          <Button className={classes.login} color="inherit" key={"Login"} component={Link} to={'/login'}>Login</Button>
    )}
    </div>
  );
}
