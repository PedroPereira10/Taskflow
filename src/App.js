import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Accueil from "./pages/Accueil";
import Horaires from "./pages/Horaires";
import Equipe from "./pages/Equipe";
import Projects from "./pages/Projects";
import ressourcehumaine from "./pages/Ressourcehumaine";
import Annonces from "./pages/Annonces";

function App() {
  const [viewMode, setViewMode] = useState("grid");
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" component={Register} />
        <Route
          path="/accueil"
          render={(props) => (
            <Accueil {...props} viewMode={viewMode} setViewMode={setViewMode} />
          )}
        />
        <Route path="/horaires" component={Horaires} />
        <Route path="/equipe" component={Equipe} />
        <Route path="/projets" component={Projects} />
        <Route path="/ressourcehumaine" component={ressourcehumaine} />
        <Route path="/annonces" component={Annonces} />
      </Switch>
    </Router>
  );
}

export default App;
