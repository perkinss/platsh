import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import AuthenticationWrapper from "./context/AuthenticationWrapper"

import App from './App';


ReactDOM.render(
    (<AuthenticationWrapper>
      <App />
    </AuthenticationWrapper>),
    document.getElementById('root')
)
