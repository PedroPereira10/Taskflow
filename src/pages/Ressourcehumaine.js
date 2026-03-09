import React, { useState, useEffect } from "react";
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

const Ressourcehumaine = () => {
  const [formationsDisponibles, setFormationsDisponibles] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);
  const [nouvelleFormation, setNouvelleFormation] = useState({
    nom: "",
    description: "",
  });

  // cette effect cherche le firebase
  useEffect(() => {
    const fetchFormations = async () => {
      const snapshot = await getDocs(collection(db, "formations"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFormationsDisponibles(data);
    };
    fetchFormations();
  }, []);

  // salvegarde la formation dans le firebase
  const handleAjouterFormation = async () => {
    if (!nouvelleFormation.nom) return;
    const docRef = await addDoc(
      collection(db, "formations"),
      nouvelleFormation,
    );
    setFormationsDisponibles([
      ...formationsDisponibles,
      { id: docRef.id, ...nouvelleFormation },
    ]);
    setNouvelleFormation({ nom: "", description: "", link: "" });
    setShowModal(false);
  };

  const handleSupprimer = (index) => {
    setConfirmerSuppression(index);
  };

  // supprime de la base de donnees Firebase
  const handleConfirmerSuppression = async () => {
    const formation = formationsDisponibles[confirmerSuppression];
    await deleteDoc(doc(db, "formations", formation.id));
    setFormationsDisponibles(
      formationsDisponibles.filter((_, i) => i !== confirmerSuppression),
    );
    setConfirmerSuppression(null);
  };

  const formationsFiltrees = formationsDisponibles.filter((formation) =>
    formation.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <div className="page-layout">
      <Drawer />
      <div className="ressourcehumaine-content">
        <div className="page-header">
          <h1>Ressources Humaines</h1>
          <button
            className="btn-nouvelle-formation"
            onClick={() => setShowModal(true)}
          >
            + Nouvelle Formation
          </button>
        </div>
        <p> {formationsDisponibles.length} formations disponibles</p>
        <div className="recherche-section">
          <input
            type="text"
            placeholder="Rechercher une formation"
            className="input-recherche"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        {formationsFiltrees.map((formation, index) => (
          <div key={index} className="formation-card">
            <div>
              <h2>{formation.nom}</h2>
              <p>{formation.description}</p>
              <a
                href={formation.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir la formation
              </a>
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
              <p>Êtes-vous sûr de vouloir supprimer cette formation ?</p>
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
              <h2>Nouvelle Formation</h2>
              <input
                type="text"
                placeholder="Nom de la formation"
                value={nouvelleFormation.nom}
                onChange={(e) =>
                  setNouvelleFormation({
                    ...nouvelleFormation,
                    nom: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={nouvelleFormation.description}
                onChange={(e) =>
                  setNouvelleFormation({
                    ...nouvelleFormation,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Lien"
                value={nouvelleFormation.link}
                onChange={(e) =>
                  setNouvelleFormation({
                    ...nouvelleFormation,
                    link: e.target.value,
                  })
                }
              />
              <div className="modal-buttons">
                <button className="btn-cree" onClick={handleAjouterFormation}>
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
export default Ressourcehumaine;
