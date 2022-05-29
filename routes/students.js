var express = require('express');
const { getStudentByMatricule, addStudent } = require('../models/student_persistence_module')
var router = express.Router();


router.get('/', function (req, res, next) {
    res.render('projet2', { title: 'Express' });
});

router.post('/', (req, res) => {
    // console.log(req.body);
    const matricule = req.body.matricule;
    const psw = req.body.password;
    
    getStudentByMatricule(matricule)
        .then(student => {
            var objStudent = JSON.parse(student)
            if(objStudent.matricule === matricule && objStudent.password === psw) {
                var response = {"firstname" : objStudent.firstname, "lastname": objStudent.lastname}
                res.send(JSON.stringify(response))
            } else if (objStudent.password !== psw) {                
                res.send(JSON.stringify({"message": "Mot de passe invalide. Veuillez réessayer"}))
            }
        })
        .catch( err => {
            if(err) {
                console.log(err);
                res.send(err)  
            }            
        });
});

router.post('/students-ajout', (req, res) => {    
    const objStudent = {
        "matricule": req.body.matricule,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "password": req.body.password
    }
    addStudent(objStudent)
    .then(obj => {
        if(obj) {
            res.send("OK")
        } else {
            res.send("Erreur")
        }
    })
    .catch(error => console.log(error))    
});


module.exports = router;
























module.exports = router;