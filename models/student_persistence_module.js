const fs = require('fs')
const path = require('path')

//Retourne une promesse encapsulant l'ensemble des étudiants du fichier students.json
const getStudents = () => {
    const objPromise = new Promise((resolve, reject) => {
        fs.readFile("./data/students.json", "utf-8", (error, jsonData) => {
            if (!error) {
                resolve(JSON.parse(jsonData))
            } else {
                reject({ error })
            }
        })
    })

    return objPromise
}

//Retourne les données d'un étudiant à partir de son identifiant
const getStudentByMatricule = (mat) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {               
                const tabStudents = objStudents.students
                const filteredStudents = tabStudents.filter(student => student.matricule === mat)
                if(filteredStudents.length > 0){
                    resolve(JSON.stringify(filteredStudents[0]))
                }else{
                    reject({error: "Student not found"})
                }
            })
            .catch(error => reject(error))
    })
    return objPromise
}

//persist students data in file
const saveStudents = (students) => {
    const objPromise = new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'data/students.json'), JSON.stringify(students), error =>{
            if(error){
                reject(error)
            }else{
                resolve({"Success": "Fichier sauvegardé avec succès."})
            }
        })
    })
    return objPromise
}

//Insert a student into students.json file
const addStudent = (student) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {               
                //Check for duplicates
                const duplicateStudents = objStudents.students.
                    filter(current => current.id === student.id)

                //persists the students if no duplicates
                if(duplicateStudents.length === 0){
                    objStudents.students.push(student)
                    saveStudents(objStudents)
                    resolve(student)
                }
            })
            .catch(error => reject(error))
    })

    return objPromise
}

//Suppression d'un étudiant du fichier students.json
const deleteStudent = student => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {               
                //Check for duplicates
                objStudents.students = objStudents.students.
                    filter(current => current.id !== student.id)

                //persists the filtered students after removing
                saveStudents(objStudents)
                resolve(student)
            })
            .catch(error => reject(error))
    })

    return objPromise
}

//Mettre à jour les données d'un étudiant
const updateStudent = (student) => {
    const objPromise = new Promise((resolve, reject) => {
        getStudents()
            .then(objStudents => {
                objStudents.students = objStudents.students.
                    map(current => {
                        if(current.id === student.id){
                            return student
                        }else{
                            return current
                        }
                    })

                saveStudents(objStudents)
                resolve(student)
            })
            .catch(error => reject(error))
    })
    return objPromise
}


module.exports = {
    getStudents,
    getStudentByMatricule,
    addStudent,
    deleteStudent,
    updateStudent
}
