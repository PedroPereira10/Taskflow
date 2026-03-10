import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  Calendar,
  Users,
  User,
  LayoutDashboard,
  Book,
  FolderKanban,
  MoveLeft,
  MessageSquare,
} from "lucide-react";

const Drawer = () => {
  const history = useHistory();

  return (
    <div className="drawer-left">
      <p>Principal</p>
      <NavLink
        exact
        to="/accueil"
        activeClassName="navActive"
        className="nav-link"
      >
        <LayoutDashboard size={20}></LayoutDashboard>Dashboard
      </NavLink>
      <p>Ressources Humaines</p>
      <NavLink
        exact
        to="/ressourcehumaine"
        activeClassName="navActive"
        className="nav-link"
      >
        <Book size={20}></Book>Formations
      </NavLink>
      <p>Opérations</p>
      <NavLink
        exact
        to="/horaires"
        activeClassName="navActive"
        className="nav-link"
      >
        <Calendar size={20}></Calendar>Horaires
      </NavLink>
      <NavLink
        exact
        to="/equipe"
        activeClassName="navActive"
        className="nav-link"
      >
        <Users size={20}></Users>Équipes
      </NavLink>
      <NavLink
        exact
        to="/employes"
        activeClassName="navActive"
        className="nav-link"
      >
        <User size={20}></User>Employes
      </NavLink>
      <p>Projets</p>
      <NavLink
        exact
        to="/projets"
        activeClassName="navActive"
        className="nav-link "
      >
        <FolderKanban size={20}></FolderKanban>Projets
      </NavLink>
      <p>Communication</p>
      <NavLink
        exact
        to="/annonces"
        activeClassName="navActive"
        className="nav-link "
      >
        <MessageSquare size={20}></MessageSquare>Annonces
      </NavLink>
      <button className="btn-logout" onClick={() => history.push("/")}>
        <MoveLeft size={20}></MoveLeft>
        Logout
      </button>
    </div>
  );
};

export default Drawer;
