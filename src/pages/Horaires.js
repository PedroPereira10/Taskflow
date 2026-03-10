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
import { Trash, Clock } from "lucide-react";

const JOURS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const Horaires = () => {
  const [horaires, setHoraires] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [semaineComplete, setSemaineComplete] = useState(false);
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);
  const [nouvelHoraire, setNouvelHoraire] = useState({
    employe: "",
    jour: "Lundi",
    heureDebut: "",
    heureFin: "",
  });

  useEffect(() => {
    const fetchHoraires = async () => {
      const snapshot = await getDocs(collection(db, "horaires"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHoraires(data);
    };

    const fetchEmployes = async () => {
      const snapshot = await getDocs(collection(db, "employes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployes(data);
    };

    fetchHoraires();
    fetchEmployes();
  }, []);

  const handleAjouter = async () => {
    if (
      !nouvelHoraire.employe ||
      !nouvelHoraire.heureDebut ||
      !nouvelHoraire.heureFin
    )
      return;

    if (semaineComplete) {
      const nouveauxHoraires = [];
      for (const jour of JOURS_SEMAINE) {
        const horaire = { ...nouvelHoraire, jour };
        const docRef = await addDoc(collection(db, "horaires"), horaire);
        nouveauxHoraires.push({ id: docRef.id, ...horaire });
      }
      setHoraires([...horaires, ...nouveauxHoraires]);
    } else {
      const docRef = await addDoc(collection(db, "horaires"), nouvelHoraire);
      setHoraires([...horaires, { id: docRef.id, ...nouvelHoraire }]);
    }

    setNouvelHoraire({
      employe: "",
      jour: "Lundi",
      heureDebut: "",
      heureFin: "",
    });
    setSemaineComplete(false);
    setShowModal(false);
  };

  const handleSupprimer = (index) => setConfirmerSuppression(index);

  const handleConfirmerSuppression = async () => {
    const horaire = horaires[confirmerSuppression];
    await deleteDoc(doc(db, "horaires", horaire.id));
    setHoraires(horaires.filter((_, i) => i !== confirmerSuppression));
    setConfirmerSuppression(null);
  };

  const horaireParJour = JOURS.map((jour) => ({
    jour,
    horaires: horaires.filter((h) => h.jour === jour),
  }));

  return (
    <div className="page-layout">
      <Drawer />
      <div className="horaires-content">
        <div className="page-header">
          <h1>Horaires</h1>
          <button
            className="btn-nouvel-horaire"
            onClick={() => setShowModal(true)}
          >
            + Ajouter un horaire
          </button>
        </div>
        <p>{horaires.length} horaires enregistrés</p>

        <div className="horaires-grid">
          {horaireParJour.map(({ jour, horaires }) => (
            <div key={jour} className="jour-card">
              <div className="jour-header">
                <h3>{jour}</h3>
                <span className="jour-count">{horaires.length}</span>
              </div>
              <div className="jour-horaires">
                {horaires.length === 0 ? (
                  <p className="vide">Aucun horaire</p>
                ) : (
                  horaires.map((h, index) => (
                    <div key={index} className="horaire-item">
                      <div className="horaire-info">
                        <p className="employe-nom">{h.employe}</p>
                        <div className="horaire-temps">
                          <Clock size={12} />
                          <span>
                            {h.heureDebut} - {h.heureFin}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn-supprimer-icon"
                        onClick={() => handleSupprimer(horaires.indexOf(h))}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {confirmerSuppression !== null && (
          <div
            className="modal-overlay"
            onClick={() => setConfirmerSuppression(null)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Confirmer la suppression</h2>
              <p>Êtes-vous sûr de vouloir supprimer cet horaire ?</p>
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
              <h2>Ajouter un horaire</h2>

              <select
                value={nouvelHoraire.employe}
                onChange={(e) =>
                  setNouvelHoraire({
                    ...nouvelHoraire,
                    employe: e.target.value,
                  })
                }
              >
                <option value="">Sélectionner un employé</option>
                {employes.map((employe) => (
                  <option key={employe.id} value={employe.nom}>
                    {employe.nom}
                  </option>
                ))}
              </select>

              {/* toggle semaine complète */}
              <label className="toggle-semaine">
                <input
                  type="checkbox"
                  checked={semaineComplete}
                  onChange={(e) => setSemaineComplete(e.target.checked)}
                />
                Remplir toute la semaine (Lun - Ven)
              </label>

              {!semaineComplete && (
                <select
                  value={nouvelHoraire.jour}
                  onChange={(e) =>
                    setNouvelHoraire({ ...nouvelHoraire, jour: e.target.value })
                  }
                >
                  {JOURS.map((jour) => (
                    <option key={jour} value={jour}>
                      {jour}
                    </option>
                  ))}
                </select>
              )}

              <div className="horaire-inputs">
                <input
                  type="time"
                  value={nouvelHoraire.heureDebut}
                  onChange={(e) =>
                    setNouvelHoraire({
                      ...nouvelHoraire,
                      heureDebut: e.target.value,
                    })
                  }
                />
                <span>→</span>
                <input
                  type="time"
                  value={nouvelHoraire.heureFin}
                  onChange={(e) =>
                    setNouvelHoraire({
                      ...nouvelHoraire,
                      heureFin: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-buttons">
                <button className="btn-cree" onClick={handleAjouter}>
                  Ajouter
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

export default Horaires;
