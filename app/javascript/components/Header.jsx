import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { CssBaseline, Typography, List, Toolbar, AppBar, Drawer, Divider, IconButton,
    ListItem, ListItemIcon, ListItemText, Icon } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/BuildRounded'
import HomeIcon from '@material-ui/icons/HomeRounded'
import DashboardIcon from '@material-ui/icons/DashboardRounded'
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AssessmentIcon from '@material-ui/icons/AssessmentRounded'
import VisibilityIcon from '@material-ui/icons/VisibilityRounded'
import FaceIcon from '@material-ui/icons/FaceRounded'
import {makeStyles} from "@material-ui/core/styles/index";
import Account from "./account/Account"
import LoginButton from "./LoginButton"
import { RootAuthContext } from "../context/AuthenticationWrapper"
import HeaderImage from 'images/logo-header.png'
import {ROLES} from "../model/user";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12
    },
    hide: {
        display: 'none',
    },
    drawer: {
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0,1),
        ...theme.mixins.toolbar,
    },
    title: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width: '100%'
    }
}));

export default function Header(props) {

    const classes = useStyles();
    // move this to shared context
    const [open, setOpen] = useState(false);
    const { currentPage, headerTitle } = props
    const authContext = useContext(RootAuthContext);
    function handleDrawerToggle(e) {
        setOpen(!open)
    };

    useEffect(() => {
        document.title = "Markury " + (currentPage ? "| " + currentPage : "")
    });
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('/authcheck/is_signed_in', {
            method: 'GET',
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        });
        const result = await response.json();
        //always take the data from the authcheck
        if (authContext.authenticated !== result.signed_in) {
          authContext.setAuthenticated(result.signed_in);
          authContext.setAuthData(result.user ? result.user : null);
          if (!result.signed_in) {
            // need a new csrf token so we need to hit the server
            window.location.href='/';
          }
        }
      };
      fetchData();
    }, [currentPage]);

    return (
        <div className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar  disableGutters={!open}>
                    <IconButton edge="start" className={classNames(classes.menuButton, {
                        [classes.hide]: open,
                    })} color="inherit" onClick={handleDrawerToggle} aria-label="Open drawer">
                        <MenuIcon />
                    </IconButton>
                    <IconButton onClick={() => {setPage("Account")}}>
                        <img src={HeaderImage}/>
                        <Typography variant="h4" className={classes.title} >
                            Markury
                        </Typography>
                    </IconButton>
                    <Typography variant="h6" className={classes.title} noWrap={true}>
                        {headerTitle || currentPage}
                    </Typography>
                    <LoginButton currentPage={currentPage} />
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerToggle}>
                        {classes.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <MenuItem name="Home" to={'/'}>
                        <HomeIcon/>
                    </MenuItem>
                    <RestrictedMenuItem name="Dashboard" to={'/dashboard'} roles={[ROLES.TEACHER]}>
                        <DashboardIcon/>
                    </RestrictedMenuItem>
                    <RestrictedMenuItem name="Configure" to={'/configure'} roles={[ROLES.TEACHER]}>
                        <BuildIcon/>
                    </RestrictedMenuItem>
                    <RestrictedMenuItem name="Observe" to={'/observe'} roles={[ROLES.TEACHER]}>
                        <VisibilityIcon/>
                    </RestrictedMenuItem>
                    <RestrictedMenuItem name="Report" to={'/report'} roles={[ROLES.TEACHER, ROLES.STUDENT]}>
                        <AssessmentIcon/>
                    </RestrictedMenuItem>
                </List>
                <Divider />
                <List>
                    <RestrictedMenuItem name="Account" to={'/account'} roles={[ROLES.TEACHER]}>
                        <FaceIcon/>
                    </RestrictedMenuItem>
                </List>
            </Drawer>
            {props.children}
        </div>
    );
}

function RestrictedMenuItem(props) {
    const { roles, name, to, children } = props
    const { currentUser } = useContext(RootAuthContext);
    if (!currentUser.hasAnyRole(roles)) {
        return null
    }

    return (
        <MenuItem name={name} to={to}>
            {children}
        </MenuItem>
    )
}

function MenuItem(props) {
    const { name, to, children } = props

    return (
        <ListItem button key={name} component={Link} to={to}>
            <ListItemIcon>
                {children}
            </ListItemIcon>
            <ListItemText primary={name}/>
        </ListItem>
    )
}
