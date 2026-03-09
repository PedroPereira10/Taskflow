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

const Annonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);
  const [nouvelleAnnonce, setNouvelleAnnonce] = useState({
    nom: "",
    description: "",
  });

  useEffect(() => {
    const fetchAnnonces = async () => {
      const snapshot = await getDocs(collection(db, "annonce"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAnnonces(data);
    };

    fetchAnnonces();
  }, []);

  const handleAjouterAnnonce = async () => {
    if (!nouvelleAnnonce.nom) return;
    const docRef = await addDoc(collection(db, "annonce"), nouvelleAnnonce);
    setAnnonces([...annonces, { id: docRef.id, ...nouvelleAnnonce }]);
    setNouvelleAnnonce({ nom: "", description: "" });
    setShowModal(false);
  };

  const handleSupprimer = (index) => {
    setConfirmerSuppression(index);
  };

  const handleConfirmerSuppression = async () => {
    const annonce = annonces[confirmerSuppression];
    await deleteDoc(doc(db, "annonce", annonce.id));
    setAnnonces(annonces.filter((_, i) => i !== confirmerSuppression));
    setConfirmerSuppression(null);
  };

  const annoncesFiltrees = annonces.filter((annonce) =>
    annonce.nom.toLowerCase().includes(recherche.toLowerCase()),
  );
  return (
    <div className="page-layout">
      <Drawer />
      <div className="annonce-content">
        <div className="page-header">
          <h1>Annonces</h1>
          <button
            className="btn-nouvelle-annonce"
            onClick={() => setShowModal(true)}
          >
            + Nouvelle Annonce
          </button>
        </div>
        <p>{annonces.length} annonces disponibles</p>
        <div className="recherche-section">
          <input
            type="text"
            placeholder="Rechercher une annonce"
            className="input-recherche"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {annoncesFiltrees.map((annonce, index) => (
          <div key={index} className="annonce-card">
            <div>
              <h2>{annonce.nom}</h2>
              <p>{annonce.description}</p>
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
              <h2>Nouvelle Annonce</h2>
              <input
                type="text"
                placeholder="Titre de l'annonce"
                value={nouvelleAnnonce.nom}
                onChange={(e) =>
                  setNouvelleAnnonce({
                    ...nouvelleAnnonce,
                    nom: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={nouvelleAnnonce.description}
                onChange={(e) =>
                  setNouvelleAnnonce({
                    ...nouvelleAnnonce,
                    description: e.target.value,
                  })
                }
              />
              <div className="modal-buttons">
                <button className="btn-cree" onClick={handleAjouterAnnonce}>
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

export default Annonces;
