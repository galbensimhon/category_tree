import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MyAppBar} from "./components/MyAppBar";
import {MyHeader} from "./components/MyHeader";
import {MyLoader} from "./components/MyLoader";
import TreeContainer from './components/TreeContainer'
import { BrowserRouter, Route } from "react-router-dom";
import { AnimatedSwitch } from 'react-router-transition';
import MyFooter from "./components/MyFooter";

function App() {
  return (
      <BrowserRouter>
          <CssBaseline />
          <MyAppBar/>
          <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
          >
              <Route path={`${process.env.PUBLIC_URL}/categorytree`}>
                  <TreeContainer/>
              </Route>
              <Route path={`${process.env.PUBLIC_URL}/`}>
                  <MyHeader/>
                  <MyLoader/>
              </Route>
          </AnimatedSwitch>
          <MyFooter/>
      </BrowserRouter>
  );
}

export default App;
