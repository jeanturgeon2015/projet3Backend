var express = require('express');
var router = express.Router();
const {
  getSuccursales,
  getSuccursalesByMatricule,
  addSuccursale,
  updateSuccursale,
  deleteSuccursale,
  getBudget,
  deleteAllSuccursales

}
  = require('../models/succursales_persistence_module');

router.get('/', function (req, res, next) {
  res.render('projet2', { title: 'Express' });
});


//Afficher le nombre de succursales créées par un matricule
router.post('/succursale-compte', (req, res) => {
  const matricule = req.body.matricule;  
  getSuccursalesByMatricule(matricule)
    .then(objSuccursales => {
      res.send(`${objSuccursales.length}`);
    });
});


//Afficher la listes des succursales créées par un matricule
router.post('/succursale-liste', (req, res) => {
  const matricule = req.body.matricule;  
  getSuccursales()
  .then(objSuccursales => {               
    const tabSuccursales = objSuccursales.succursales
    const filteredSuccursales = tabSuccursales.filter(succursale => succursale.matricule === matricule)
    if(filteredSuccursales.length > 0){
        res.send(JSON.stringify(filteredSuccursales))
    }
})
.catch(error => reject(error))
      
});


// Ajout ou modification d'une succursale
router.post('/succursale-ajout', (req, res) => {
  let newSuccursale = {
    "matricule": req.body.aut.substring(0, 7),
    "ville": req.body.ville,
    "budget": req.body.budget
  }

  getSuccursales()
    .then(objSuccursales => {
      //Check for duplicates
      const duplicateSuccursales = objSuccursales.succursales
        .filter(current => current.matricule === newSuccursale.matricule)
        .filter(current => current.ville === newSuccursale.ville)
        .filter(current => current.budget === newSuccursale.budget)

      //persists if no duplicates
      if (duplicateSuccursales.length > 0) {
        res.send("PASOK;")
      } else {
        //check if we either update or add from scratch if not exist
        const updateBudget = objSuccursales.succursales
          .filter(current => current.matricule === newSuccursale.matricule)
          .filter(current => current.ville === newSuccursale.ville)
        if (updateBudget.length > 0) {
          updateSuccursale(newSuccursale)
            .then(res.send("OKM;"))
        } else {
          addSuccursale(newSuccursale)
            .then(res.send("OKI;"))
        }
      }
    })
});

//Delete UNE succursale
router.delete("/succursale-retrait", (req, res) => {
  deleteSuccursale(req.body)
    .then(succursale => {
      if (succursale) {
        res.send("OK;");
      } else {
        res.send("PASOK;");
      }
    });
});

// Delete TOUTES les succursales
router.delete("/succursale-suppression", (req, res) => {
  const matricule = req.body.aut.substring(0, 7);
  deleteAllSuccursales(matricule)
    .then(obj => {
      if (obj) {
        res.send("OK;")
      }

    });
});

//afficher le budget d'une succursale
router.post("/succursale-budget", (req, res) => {
  let objToGetBudget = {
    "matricule": req.body.aut.substring(0, 7),
    "ville": req.body.ville
  }
  getBudget(objToGetBudget)
    .then(obj => {
      if (obj) {        
        res.send(`${obj.budget}`);
      } else {
        res.send("PASOK;")
      }
    });
})


module.exports = router;
