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

const Employes = () => {
  const [employes, setEmployes] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);
  const [nouvelEmploye, setNouvelEmploye] = useState({
    nom: "",
    poste: "",
    equipe: "",
  });

  useEffect(() => {
    const fetchEmployes = async () => {
      const snapshot = await getDocs(collection(db, "employes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployes(data);
    };

    const fetchEquipes = async () => {
      const snapshot = await getDocs(collection(db, "equipes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEquipes(data);
    };

    fetchEmployes();
    fetchEquipes();
  }, []);

  const handleAjouterEmploye = async () => {
    if (!nouvelEmploye.nom) return;
    const docRef = await addDoc(collection(db, "employes"), nouvelEmploye);
    setEmployes([...employes, { id: docRef.id, ...nouvelEmploye }]);
    setNouvelEmploye({ nom: "", poste: "", equipe: "" });
    setShowModal(false);
  };

  const handleSupprimer = (index) => setConfirmerSuppression(index);

  const handleConfirmerSuppression = async () => {
    const employe = employes[confirmerSuppression];
    await deleteDoc(doc(db, "employes", employe.id));
    setEmployes(employes.filter((_, i) => i !== confirmerSuppression));
    setConfirmerSuppression(null);
  };

  const getCorEquipe = (nomEquipe) => {
    const equipe = equipes.find((e) => e.nom === nomEquipe);
    return equipe?.cor || "#6366f1";
  };

  const employesFiltres = employes.filter((employe) =>
    employe.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  return (
    <div className="page-layout">
      <Drawer />
      <div className="employes-content">
        <div className="page-header">
          <h1>Employés</h1>
          <button
            className="btn-nouvel-employe"
            onClick={() => setShowModal(true)}
          >
            + Nouvel Employé
          </button>
        </div>
        <p>{employes.length} employés</p>
        <div className="recherche-section">
          <input
            type="text"
            placeholder="Rechercher un employé"
            className="input-recherche"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        {employesFiltres.map((employe, index) => (
          <div
            key={index}
            className="employe-card"
            style={{ borderTop: `2px solid ${getCorEquipe(employe.equipe)}` }}
          >
            <div>
              <h2 style={{ color: getCorEquipe(employe.equipe) }}>
                {employe.nom}
              </h2>
              <p>{employe.poste}</p>
              <p>Équipe : {employe.equipe || "Aucune équipe"}</p>
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
              <p>Êtes-vous sûr de vouloir supprimer cet employé ?</p>
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
              <h2>Nouvel Employé</h2>
              <input
                type="text"
                placeholder="Nom de l'employé"
                value={nouvelEmploye.nom}
                onChange={(e) =>
                  setNouvelEmploye({ ...nouvelEmploye, nom: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Poste"
                value={nouvelEmploye.poste}
                onChange={(e) =>
                  setNouvelEmploye({ ...nouvelEmploye, poste: e.target.value })
                }
              />
              <select
                value={nouvelEmploye.equipe}
                onChange={(e) =>
                  setNouvelEmploye({ ...nouvelEmploye, equipe: e.target.value })
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
                <button className="btn-cree" onClick={handleAjouterEmploye}>
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

export default Employes;
