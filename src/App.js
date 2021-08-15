import Header from "./components/Header";
import React from "react";

// components used in routes
import Barchart from "./components/Barchart";
import Groupedstackedchart from "./components/Groupedstackedchart";
import Linechart from "./components/Linechart";
import Mapchart from "./components/Mapchart";
import Globe from "./components/Globe";
import Sankey from "./components/Sankey";
import Hexbin from "./components/Hexbin";
import Scatterplot from "./components/Scatterplot";
import Boxplot from "./components/Boxplot";

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
          <Route path="/linechart">
            <Linechart />
          </Route>
          <Route path="/barchart">
            <Barchart />
          </Route>
          <Route path="/groupedandstackedchart">
            <Groupedstackedchart />
          </Route>
          <Route path="/boxplot">
            <Boxplot />
          </Route>
          <Route path="/mapchart">
            <Mapchart />
          </Route>
          <Route path="/globe">
            <Globe />
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
