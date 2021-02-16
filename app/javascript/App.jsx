import React, { useContext } from 'react';
import { Route } from 'react-router'
import { BrowserRouter as Router, Redirect} from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './styles/theme'
import Home from "./components/Home"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Configure from "./components/configure/Configure"
import Observe from "./components/observe/Observe"
import Report from "./components/report/Report"
import Account from "./components/account/Account"
import Demo from "./components/Demo"
import { RootAuthContext } from "./context/AuthenticationWrapper"
import ErrorBoundary from "./ErrorBoundary";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <Router>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/configure" component={Configure} />
                    <PrivateRoute path="/observe" component={Observe} />
                    <PrivateRoute path="/report" component={Report} />
                    <PrivateRoute path="/demo" component={Demo} />
                    <PrivateRoute path="/account"  component={Account} />
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

function PrivateRoute({ component: Component, ...rest }) {
  const authContext = useContext(RootAuthContext);
  return (
    <Route
      {...rest}
      render={props =>
        authContext.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default App;
