import Header from "./components/Header";
import React from "react";
// components used in routes
import Barchart from "./components/Barchart";
import Choropleth from "./components/Choropleth";
import Sankey from "./components/Sankey";
import Hexbin from "./components/Hexbin";
import Scatterplot from "./components/Scatterplot";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/scatterplot">
            <Scatterplot />
          </Route>
          <Route path="/barchart">
            <Barchart />
          </Route>
          <Route path="/choropleth">
            <Choropleth />
          </Route>
          <Route path="/sankey">
            <Sankey />
          </Route>
          <Route path="/hexbin">
            <Hexbin />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
