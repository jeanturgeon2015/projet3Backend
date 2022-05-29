const { response } = require('express')
const res = require('express/lib/response')
const fs = require('fs')

const getSuccursales = () => {
    const objPromise = new Promise((resolve, reject) => {
        fs.readFile("./data/succursales.json", "utf-8", (error, jsonData) => {
            if (!error) {
                resolve(JSON.parse(jsonData))
            } else {
                reject({ error })
            }
        })
    })

    return objPromise
}

const getSuccursalesByMatricule = (mat) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                const succursales = objSuccursales.succursales
                const succursalesParMatricule = succursales.filter(succursale => succursale.matricule === mat);
                const aucune = []

                if (succursalesParMatricule.length > 0) {                    
                    resolve(succursalesParMatricule)

                } else
                    resolve(aucune)
            })
            .catch(error => reject(error))
    })
    return objPromise
}

const saveSuccursales = (succursales) => {
    const objPromise = new Promise((resolve, reject) => {
        fs.writeFile('./data/succursales.json', JSON.stringify(succursales), error => {
            if (error) {
                reject(error)
            } else {
                resolve({ "Success": "Fichier sauvegardé avec succès." })
            }
        })
    })
    return objPromise
}

const addSuccursale = (succursale) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                //Check for duplicates
                const duplicateSuccursales = objSuccursales.succursales
                    .filter(current => current.matricule === succursale.matricule)
                    .filter(current => current.ville === succursale.ville)

                //persists the students if no duplicates
                if (duplicateSuccursales.length === 0) {
                    objSuccursales.succursales.push(succursale)
                    saveSuccursales(objSuccursales)
                    resolve(succursale)
                }
            })
            .catch(error => reject(error))
    })

    return objPromise
}

const updateSuccursale = (succursale) => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                objSuccursales.succursales = objSuccursales.succursales
                    .map(current => {
                        if ((current.matricule === succursale.matricule) && (current.ville === succursale.ville)) {
                            return succursale
                        } else {
                            return current
                        }
                    })

                saveSuccursales(objSuccursales)
                resolve(succursale)
            })
            .catch(error => reject(error))
    })
    return objPromise
}

const deleteSuccursale = obj => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                // var index = objSuccursales.succursales.findIndex(succursale => {
                //     return (succursale.matricule === obj.matricule && succursale.ville == obj.ville)
                // })
                var tab = objSuccursales.succursales
                for(var i =0; i< tab.length; i++) {
                    if(tab[i].matricule === obj.matricule) {
                        if(tab[i].ville === obj.ville) {
                            objSuccursales.succursales.splice(i, 1)
                        }
                    }
                }
                // console.log(objSuccursales)
                //persists the filtered students after removing
                saveSuccursales(objSuccursales)
                resolve(objSuccursales)
            })
            .catch(error => reject(error))
    })

    return objPromise
}

const deleteAllSuccursales = matricule => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                //Check for duplicates
                // let tabSuccursales = objSuccursales.succursales
                // for (let i = 0; i < tabSuccursales.length; i++) {
                //     if (tabSuccursales[i].matricule === matricule) {
                //         tabSuccursales.splice(i, 1)
                //     }
                // }
                // objSuccursales.succursales = tabSuccursales
                // console.log(objSuccursales);                
                 objSuccursales.succursales = objSuccursales.succursales.filter(succursale => succursale.matricule !== matricule);
                
                
                saveSuccursales(objSuccursales)                
                resolve(objSuccursales)
            })
            .catch(error => reject(error))
    })

    return objPromise
}

const getBudget = objSuccursale => {
    const objPromise = new Promise((resolve, reject) => {
        getSuccursales()
            .then(objSuccursales => {
                const tabSuccursale = objSuccursales.succursales
                    .filter(current => current.matricule === objSuccursale.matricule)
                    .filter(current => current.ville === objSuccursale.ville)
                resolve(tabSuccursale[0])
            })
            .catch(error => reject(error))

    });
    return objPromise
}


module.exports = {
    getSuccursales,
    getSuccursalesByMatricule,
    addSuccursale,
    updateSuccursale,
    deleteSuccursale,
    getBudget,
    deleteAllSuccursales
}