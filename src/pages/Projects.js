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
import { Trash } from "lucide-react";

const Projects = () => {
  const [projetsDisponible, setProjetsDisponible] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);
  const [nouveauProjet, setNouveauProjet] = useState({
    nom: "",
    description: "",
    equipe: "",
  });

  useEffect(() => {
    const fetchProjets = async () => {
      const snapshot = await getDocs(collection(db, "projets"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjetsDisponible(data);
    };

    const fetchEquipes = async () => {
      const snapshot = await getDocs(collection(db, "equipes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipes(data);
    };

    fetchProjets();
    fetchEquipes();
  }, []);

  const handleAjouterProjet = async () => {
    if (!nouveauProjet.nom) return;
    const docRef = await addDoc(collection(db, "projets"), nouveauProjet);
    setProjetsDisponible([
      ...projetsDisponible,
      { id: docRef.id, ...nouveauProjet },
    ]);
    setNouveauProjet({ nom: "", description: "", equipe: "" });
    setShowModal(false);
  };

  const handleSupprimer = (index) => {
    setConfirmerSuppression(index);
  };

  const handleConfirmerSuppression = async () => {
    const projet = projetsDisponible[confirmerSuppression];
    await deleteDoc(doc(db, "projets", projet.id));
    setProjetsDisponible(
      projetsDisponible.filter((_, i) => i !== confirmerSuppression),
    );
    setConfirmerSuppression(null);
  };

  const projetsFiltrees = projetsDisponible.filter((projet) =>
    projet.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  const getColleurEquipe = (nomEquipe) => {
    const equipe = equipes.find((e) => e.nom === nomEquipe);
    return equipe?.cor || "#6366f1";
  };

  return (
    <div className="page-layout">
      <Drawer />
      <div className="projets-content">
        <div className="page-header">
          <h1>Projets</h1>
          <button
            className="btn-nouveau-projet"
            onClick={() => setShowModal(true)}
          >
            + Nouveau projet
          </button>
        </div>
        <p>{projetsDisponible.length} projets disponibles</p>
        <div className="recherche-section">
          <input
            type="text"
            placeholder="Rechercher un projet"
            className="input-recherche"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {projetsFiltrees.map((projet, index) => (
          <div
            key={index}
            className="projet-card"
            style={{
              borderTop: `2px solid ${getColleurEquipe(projet.equipe)}`,
            }}
          >
            <div>
              <h2>{projet.nom}</h2>
              <p>{projet.description}</p>
              <p>Équipe : {projet.equipe}</p>
            </div>
            <button
              className="btn-supprimer-icon"
              onClick={() => handleSupprimer(index)}
            >
              <Trash />
            </button>
          </div>
        ))}

        {confirmerSuppression !== null && (
          <div
            className="modal-overlay"
            onClick={() => setConfirmerSuppression(null)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Confirmer la suppression</h2>
              <p>Êtes-vous sûr de vouloir supprimer ce projet ?</p>
              <div className="modal-buttons">
                <button
                  className="btn-supprimer"
                  onClick={handleConfirmerSuppression}
                >
                  Supprimer
                </button>
                <button
                  className="btn-card"
                  onClick={() => setConfirmerSuppression(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Nouveau projet</h2>
              <input
                type="text"
                placeholder="Nom du projet"
                value={nouveauProjet.nom}
                onChange={(e) =>
                  setNouveauProjet({ ...nouveauProjet, nom: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={nouveauProjet.description}
                onChange={(e) =>
                  setNouveauProjet({
                    ...nouveauProjet,
                    description: e.target.value,
                  })
                }
              />

              <select
                value={nouveauProjet.equipe}
                onChange={(e) =>
                  setNouveauProjet({ ...nouveauProjet, equipe: e.target.value })
                }
              >
                <option value="">Sélectionner une équipe</option>
                {equipes.map((equipe) => (
                  <option key={equipe.id} value={equipe.nom}>
                    {equipe.nom}
                  </option>
                ))}
              </select>

              <div className="modal-buttons">
                <button className="btn-cree" onClick={handleAjouterProjet}>
                  Créer
                </button>
                <button
                  className="btn-card"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
