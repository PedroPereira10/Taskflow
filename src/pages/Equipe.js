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

const Equipe = () => {
  const [equipes, setEquipes] = useState([]);
  const [projets, setProjets] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);
  const [nouvelleEquipe, setNouvelleEquipe] = useState({
    nom: "",
    description: "",
    cor: "#6366f1",
  });

  useEffect(() => {
    const fetchEquipes = async () => {
      const snapshot = await getDocs(collection(db, "equipes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipes(data);
    };

    const fetchProjets = async () => {
      const snapshot = await getDocs(collection(db, "projets"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjets(data);
    };

    fetchEquipes();
    fetchProjets();
  }, []);

  const handleAjouterEquipe = async () => {
    if (!nouvelleEquipe.nom) return;
    const docRef = await addDoc(collection(db, "equipes"), nouvelleEquipe);
    setEquipes([...equipes, { id: docRef.id, ...nouvelleEquipe }]);
    setNouvelleEquipe({ nom: "", description: "", cor: "#6366f1" });
    setShowModal(false);
  };

  const handleSupprimer = (index) => setConfirmerSuppression(index);

  const handleConfirmerSuppression = async () => {
    const equipe = equipes[confirmerSuppression];
    await deleteDoc(doc(db, "equipes", equipe.id));
    setEquipes(equipes.filter((_, i) => i !== confirmerSuppression));
    setConfirmerSuppression(null);
  };

  const getProjetsDEquipe = (nomEquipe) => {
    return projets.filter((p) => p.equipe === nomEquipe);
  };

  const equipesFiltrees = equipes.filter((equipe) =>
    equipe.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <div className="page-layout">
      <Drawer />
      <div className="equipe-content">
        <div className="page-header">
          <h1>Équipes</h1>
          <button
            className="btn-nouvelle-equipe"
            onClick={() => setShowModal(true)}
          >
            + Nouvelle Équipe
          </button>
        </div>
        <p>{equipes.length} équipes disponibles</p>
        <div className="recherche-section">
          <input
            type="text"
            placeholder="Rechercher une équipe"
            className="input-recherche"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {equipesFiltrees.map((equipe, index) => {
          const projetsEquipe = getProjetsDEquipe(equipe.nom);
          return (
            <div
              key={index}
              className="equipe-card"
              style={{ borderTop: `2px solid ${equipe.cor || "#6366f1"}` }}
            >
              <div>
                <h2 style={{ color: equipe.cor || "#6366f1" }}>{equipe.nom}</h2>
                <p>{equipe.description}</p>
                {projetsEquipe.length > 0 ? (
                  <div>
                    <p>
                      <strong>Projets :</strong>
                    </p>
                    {projetsEquipe.map((projet, i) => (
                      <p key={i}>• {projet.nom}</p>
                    ))}
                  </div>
                ) : (
                  <p>Aucun projet assigné</p>
                )}
              </div>
              <button
                className="btn-supprimer-icon"
                onClick={() => handleSupprimer(index)}
              >
                <Trash />
              </button>
            </div>
          );
        })}

        {confirmerSuppression !== null && (
          <div
            className="modal-overlay"
            onClick={() => setConfirmerSuppression(null)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Confirmer la suppression</h2>
              <p>Êtes-vous sûr de vouloir supprimer cette équipe ?</p>
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
              <h2>Nouvelle Équipe</h2>
              <input
                type="text"
                placeholder="Nom de l'équipe"
                value={nouvelleEquipe.nom}
                onChange={(e) =>
                  setNouvelleEquipe({ ...nouvelleEquipe, nom: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={nouvelleEquipe.description}
                onChange={(e) =>
                  setNouvelleEquipe({
                    ...nouvelleEquipe,
                    description: e.target.value,
                  })
                }
              />
              <label className="label-cor">
                Couleur de l'équipe
                <input
                  type="color"
                  value={nouvelleEquipe.cor}
                  onChange={(e) =>
                    setNouvelleEquipe({
                      ...nouvelleEquipe,
                      cor: e.target.value,
                    })
                  }
                />
              </label>
              <div className="modal-buttons">
                <button className="btn-cree" onClick={handleAjouterEquipe}>
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

export default Equipe;
