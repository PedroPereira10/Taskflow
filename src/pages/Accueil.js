import React, { useEffect, useState } from "react";
import Drawer from "../components/Drawer";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Clock } from "lucide-react";

const JOURS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const Accueil = () => {
  const [equipes, setEquipes] = useState([]);
  const [projets, setProjets] = useState([]);
  const [formations, setFormations] = useState([]);
  const [horaires, setHoraires] = useState([]);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    const fetchProjets = async () => {
      const snapshot = await getDocs(collection(db, "projets"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjets(data);
    };

    const fetchEquipes = async () => {
      const snapshot = await getDocs(collection(db, "equipes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipes(data);
    };

    const fetchFormations = async () => {
      const snapshot = await getDocs(collection(db, "formations"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFormations(data);
    };

    const fetchHoraires = async () => {
      const snapshot = await getDocs(collection(db, "horaires"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHoraires(data);
    };

    fetchProjets();
    fetchEquipes();
    fetchFormations();
    fetchHoraires();
  }, []);

  const projetsFiltrees = projets.filter((projet) =>
    projet.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  const equipesFiltrees = equipes.filter((equipe) =>
    equipe.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  const formationsFiltrees = formations.filter((formation) =>
    formation.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  const horaireParJour = JOURS.map((jour) => ({
    jour,
    horaires: horaires.filter((h) => h.jour === jour),
  }));

  const getColleurEquipe = (nomEquipe) => {
    const equipe = equipes.find((e) => e.nom === nomEquipe);
    return equipe?.cor || "#6366f1";
  };

  return (
    <div className="page-layout">
      <Drawer />
      <div className="dashboard-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Vue de l'organisation de votre entreprise</p>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-section">
            <h2>Projets</h2>
            {projetsFiltrees.map((projet, index) => (
              <div
                key={index}
                className="projet-card-dashboard"
                style={{
                  borderTop: `2px solid ${getColleurEquipe(projet.equipe)}`,
                }}
              >
                <h3>{projet.nom}</h3>
                <p>{projet.description}</p>
              </div>
            ))}
          </div>

          <div className="dashboard-section">
            <h2>Équipes</h2>
            {equipesFiltrees.map((equipe, index) => {
              return (
                <div
                  key={index}
                  className="equipe-card-dashboard"
                  style={{ borderTop: `2px solid ${equipe.cor || "#6366f1"}` }}
                >
                  <h3>{equipe.nom}</h3>
                  <p>{equipe.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-section">
            <h2>Formations</h2>
            {formationsFiltrees.map((formation, index) => (
              <div key={index} className="formation-card-dashboard">
                <h3>{formation.nom}</h3>
                <p>{formation.description}</p>
              </div>
            ))}
          </div>

          <div className="dashboard-section">
            <h2>Horaires</h2>
            {horaireParJour.map(
              ({ jour, horaires }) =>
                horaires.length > 0 && (
                  <div key={jour} className="jour-card">
                    <div className="jour-header">
                      <h3>{jour}</h3>
                      <span className="jour-count">{horaires.length}</span>
                    </div>
                    {horaires.map((h, index) => (
                      <div key={index} className="horaire-item">
                        <p className="employe-nom">{h.employe}</p>
                        <p>
                          {h.heureDebut} - {h.heureFin}
                        </p>
                      </div>
                    ))}
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
