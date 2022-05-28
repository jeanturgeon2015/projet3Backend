// Projet1.js
// Par Ronald Jean-Julien et Jean Turgeon
// Date de remise: 
// Librairie pour projet1.htm

/*
|----------------------------------------------------------------------------------|
| (GLOBAL; AJAX) Déclaration des variables de travail globales
|----------------------------------------------------------------------------------|
*/
var reponseServeurPrenom;
var reponseServeurNom;
var nbSuccursales = 0;
var cleConnection;

/* Détection automatique du dossier où est entreposé l'application serveur */
var strNomApplication = 'http://localhost:7000';

/*
|--------------------------------------------------------------------------------------------------------------|
| initialiseInterface
|--------------------------------------------------------------------------------------------------------------|
*/
function initialiseInterface(binIdentificationPresente, binOperationsSuccursalesPresente, divSuccursalesPresente) {
    masqueB('divIdentification', !binIdentificationPresente);
    masqueB('divOperationsSuccursales', !binOperationsSuccursalesPresente);
    masqueB('divSuccursales', !divSuccursalesPresente);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| initialiseBoutons
|--------------------------------------------------------------------------------------------------------------|
*/
function initialiseBoutons(binBtnSouvenir, binBtnNonSouvenir) {
    masqueB('btnSouvenir', !binBtnSouvenir);
    masqueB('btnNonSouvenir', !binBtnNonSouvenir);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| initialiseIdentifiant
|--------------------------------------------------------------------------------------------------------------|
*/
function initialiseIdentifiant() {
    if (document.cookie.length == 0) {
        initialiseBoutons(true, false);
    } else {
        initialiseBoutons(false, true);
        var userName = recupereCookie("userName");
        b('tbMatricule', userName);
        var password = recupereCookie("password");
        b('tbMotDePasse', password);
    }
}

/*
|--------------------------------------------------------------------------------------------------------------|
| créer clé de connexion
|--------------------------------------------------------------------------------------------------------------|
*/

function creerCleConnection() {
    var mdpSaisi = b('tbMotDePasse');
    var cle = "";
    for (i = 0; i < mdpSaisi.length; i++) {
        if (contientSeulementUnNombre(mdpSaisi[i])) {
            cle += mdpSaisi[i]
        }
    }
    return b('tbMatricule') + cle;
}

/*
|--------------------------------------------------------------------------------------------------------------|
| enregistreIdentifiant
|--------------------------------------------------------------------------------------------------------------|
*/
function enregistreIdentifiant() {
    enregistreCookie("userName", b('tbMatricule'), 365);
    enregistreCookie("password", b('tbMotDePasse'), 365);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| detruitIdentifiant
|--------------------------------------------------------------------------------------------------------------|
*/
function detruitIdentifiant() {
    enregistreCookie("userName", b('tbMatricule'), -1);
    enregistreCookie("password", b('tbMatricule'), -1);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| deconnexion
|--------------------------------------------------------------------------------------------------------------|
*/
function deconnexion() {
    location.reload();
}

/*
|--------------------------------------------------------------------------------------------------------------|
| effacerAjoutModification
|--------------------------------------------------------------------------------------------------------------|
*/
function effacerAjoutModification() {
    b('tbVilleAjout', "");
    b('tbBudgetAjout', "");
    b('lblMessageAjout', "");
}

/*
|--------------------------------------------------------------------------------------------------------------|
| effacerRetrait
|--------------------------------------------------------------------------------------------------------------|
*/
function effacerRetrait() {
    b('tbVilleRetrait', "");
    b('lblMessageRetrait', "");
}

/*
|--------------------------------------------------------------------------------------------------------------|
| effacerBudgetVisualisation
|--------------------------------------------------------------------------------------------------------------|
*/
function effacerBudgetVisualisation() {
    b('lblBudgetVisualisation', "")
    b('lblMessageBudgetVisualisation', "")
    b('tbVilleBudgetVisualisation', "")
}

/*
|--------------------------------------------------------------------------------------------------------------|
| toggleElementsSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function toggleElementsSuccursales(binElements) {
    masqueB('btnReinitialiser', !binElements);
    masqueB('tabRetrait', !binElements);
    masqueB('tabVisualisation', !binElements);
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteConnexion
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_tenteConnexion() {

    /*
   |-----------------------------------------------------------------------------------------------------------|
   | recupereReponseServeur
   |-----------------------------------------------------------------------------------------------------------|
   */
    function recupereReponseServeur(strVerdict) {
        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)

        /* pour sauvegarder l'information de l'utilisateur */
        var tabUtilisateur = strVerdict.split(';');
        if (tabUtilisateur.length == 2) {
            b('lblMessageConnexion', "Utilisateur inconnu")

        } else {
            reponseServeurPrenom = tabUtilisateur[1];
            reponseServeurNom = tabUtilisateur[2];
            b('lblMessageConnexion', "")
            initialiseInterface(false, true, true);
            cleConnection = creerCleConnection()
        }

        ajax_compteSuccursales();
    }

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_tenteConnexion)
    |-----------------------------------------------------------------------------------------------------------|
    */
    strConnexion = strNomApplication + "/students/"
    var identifiantValide = estUnMatricule(b('tbMatricule'));
    var regExPassword = /^[A-Za-z]{1,6}\d{5}$/
    var pswValide = regExPassword.test(b('tbMotDePasse'))

    if (!identifiantValide) {
        b('lblMessageConnexion', "Identifiant invalide")
    }
    if (!pswValide) {
        b('lblMessageConnexion', "Mot de passe invalide")
    }
    if (!identifiantValide && !pswValide) {
        b('lblMessageConnexion', "Identifiant et mot de passe invalides")
    } else if (identifiantValide && pswValide) {
        var infoConnexionValide = true;
        b('lblMessageConnexion', "")
    }

    /* envoi de la requete si indentifiant et mdp sont valides */
    if (infoConnexionValide) {
        strDonneesTransmises = "Action=Connexion&Mat=" + b('tbMatricule') + "&MDP=" + b('tbMotDePasse');
        let objDonneesTransmises = new URLSearchParams({
            "mat": b('tbMatricule'),
            "MDP": b('tbMotDePasse')
        });

        let objOptions = {
            method: 'post',
            body: objDonneesTransmises
        }

        /* Pour la trace de la requete*/
        b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

        // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        fetch(strConnexion, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))
    }

}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_compteSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_compteSuccursales() {

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {

        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)


        /* récupérer le nb de succursales */
        var tabNbSuccursales = strVerdict
        nbSuccursales = tabNbSuccursales.split(';')[0];

        if (nbSuccursales == 0) {
            toggleElementsSuccursales(false);
        } else {
            toggleElementsSuccursales(true);
        }

        b('lblSuccursales', "Nombre de succursale(s): " + nbSuccursales);
        b('lblNomComplet', reponseServeurPrenom + " " + reponseServeurNom);

    }

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_compteSuccursales)
    |-----------------------------------------------------------------------------------------------------------|
    */

    strDonneesTransmises = "&aut=" + cleConnection;
    strConnexion = strNomApplication + "/succursales/succursale-compte";

    let objDonneesTransmises = new URLSearchParams({
        "aut": cleConnection
    });

    let objOptions = {
        method: 'post',
        body: objDonneesTransmises
    }

    /* Pour la trace de la requete*/
    b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

    // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
    fetch(strConnexion, objOptions)
        .then(response => response.text())
        .then(responseData => recupereReponseServeur(responseData))
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_afficheListeSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_afficheListeSuccursales() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)

        if (strVerdict === 'AUCUNE;') {
            b('lblSuccursales', "Aucune succursale enregistrée");

        } else {
            /* récupérer la liste des succursales et construire tableau */
            var RStabSuccursales = strVerdict.split(';');
            var tabSuccursale = "<table class='sTableauSuccursales'>" +
                "<thead class='sEnteteTableauSuccursales'>" +
                "<th>No</th>" +
                "<th>Ville</th>" +
                "<th>Budget</th>" +
                "</thead>";

            for (i = 0; i < RStabSuccursales.length - 1; i++) {
                tabSuccursale += "<tr class='sCorpsTableauSuccursales'>";
                tabSuccursale += "<td class='sCelNoSuccursale'>" + (i + 1) + "</td>";
                tabSuccursale += "<td class='sCelVille'>" + RStabSuccursales[i].split(',')[0] + "</td>";
                tabSuccursale += "<td class='sCelBudget'>" + RStabSuccursales[i].split(',')[1] + " $</td>";
                tabSuccursale += "</tr>";
            }

            tabSuccursale += "</table>";

            b('lblSuccursales', tabSuccursale);
        }
    }

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_afficheListeSuccursales)
    |-----------------------------------------------------------------------------------------------------------|
    */

    strDonneesTransmises = "aut=" + cleConnection;
    strconnexion = strNomApplication + "/succursales/succursale-liste"

    let objDonneesTransmises = new URLSearchParams({
        "aut": cleConnection
    });

    let objOptions = {
        method: 'post',
        body: objDonneesTransmises
    }

    /* Pour la trace de la requete*/
    b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

    // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
    fetch(strconnexion, objOptions)
        .then(response => response.text())
        .then(responseData => recupereReponseServeur(responseData))
}



/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteAjoutModificationSuccursale
|--------------------------------------------------------------------------------------------------------------|
*/

function ajax_tenteAjoutModificationSuccursale() {

    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)

        switch (strVerdict) {
            case "PASOK;":
                b('lblMessageAjout', "Succursale déjà existante!");
                break;
            case "OKM;":
                b('lblMessageAjout', "Succursale modifiée");
                break;
            case "OKI;":
                b('lblMessageAjout', "Succursale ajoutée");
                nbSuccursales++;
                b('lblSuccursales', "Nombre de succursale(s): " + nbSuccursales);
                toggleElementsSuccursales(true);
                break;
            default:
                b('lblMessageAjout', "Une erreur inattendue est survenue!");
        }
    }
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_tenteAjoutModificationSuccursale)
    |-----------------------------------------------------------------------------------------------------------|
    */
    strConnexion = strNomApplication + "/succursales/succursale-ajout";

    /* Validation de la ville saisie */
    var villeSaisie = b('tbVilleAjout');
    var villeValide = validerNomVille(villeSaisie);

    if (!villeValide) {
        b('lblMessageAjout', 'Ville invalide!')
    }

    /* validation du budget saisi */
    var budgetValide = false;
    var budgetSaisi = b('tbBudgetAjout');
    var regExBudget = /\d{3,7}/;
    budgetSaisi = parseInt(budgetSaisi)

    if (regExBudget.test(budgetSaisi) && budgetSaisi >= 500) {
        budgetValide = true;
    } else {
        b('lblMessageAjout', 'Budget invalide!')
    }

    if (!villeValide && !budgetValide) {
            b('lblMessageAjout', 'Ville et budget invalides!')
    }

    //envoi de la requete si ville et budget sont valides
    if (villeValide && budgetValide) {
        strDonneesTransmises = "aut=" + cleConnection + "&ville=" +
            villeSaisie + "&budget=" + budgetSaisi;

        let objDonneesTransmises = new URLSearchParams({
            "aut": cleConnection,
            "ville": b('tbVilleAjout'),
            "budget": b('tbBudgetAjout')
        });

        let objOptions = {
            method: 'post',
            body: objDonneesTransmises
        }

        /* Pour la trace de la requete*/
        b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

        // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        fetch(strConnexion, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))
    }

    

}

/*
|--------------------------------------------------------------------------------------------------------------|
| Validation Ville
|--------------------------------------------------------------------------------------------------------------|
*/
function validerNomVille(nomVilleSaisi) {
    var accents = ["á", "à", "ã", "â", "é", "è", "ê", "í", "ì", "î", "õ", "ó", "ò", "ô", "ú", "ù", "û", "ç"]
    var contientCharacteresInterdits = false;

    for (var i = 0; i < nomVilleSaisi.length; i++) {
        if (estUneChaineBlanche(nomVilleSaisi[i])) {
            contientCharacteresInterdits = true;
        }
        for (var j = 0; j < accents.length; j++) {
            if (nomVilleSaisi[i] === accents[j]) {
                contientCharacteresInterdits = true;
            }
        }
    }

    var regExVille = /^[A-Za-z]{1,}(\-?[A-Za-z]{1,}){0,}$/

    if (!contientCharacteresInterdits && regExVille.test(nomVilleSaisi)) {
        return true;
    } else {
        return false;
    }

}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteRetraitSuccursale
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_tenteRetraitSuccursale() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)

        switch (strVerdict) {
            case "PASOK;":
                b('lblMessageRetrait', "Succursale inconnue!");
                break;
            case "OK;":
                b('lblMessageRetrait', "Succursale retirée");
                nbSuccursales--;
                break;
            default:
                b('lblMessageRetrait', "Une erreur inattendue est survenue!");
        }
        if (nbSuccursales == 0) {
            toggleElementsSuccursales(false);
        } else if (nbSuccursales > 0) {
            toggleElementsSuccursales(true);
        }
    }
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_tenteRetraitSuccursale)
    |-----------------------------------------------------------------------------------------------------------|
    */
    strconnexion = strNomApplication + "/succursales/succursale-retrait"

    var villeRetraitSaisie = b('tbVilleRetrait');
    var villeRetraitValide = validerNomVille(villeRetraitSaisie);
    if (villeRetraitValide) {
        strDonneesTransmises = "aut=" + cleConnection + "&ville=" + villeRetraitSaisie;

        let objDonneesTransmises = new URLSearchParams({            
            "aut": cleConnection,
            "ville": villeRetraitSaisie,
        });

        let objOptions = {
            method: 'delete',
            body: objDonneesTransmises
        }

        /* Pour la trace de la requete*/
        b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

        // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        fetch(strconnexion, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))


    } else {
        b('lblMessageRetrait', " Ville invalide!");
    }

}


/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_tenteVisualisationBudgetSuccursale
|--------------------------------------------------------------------------------------------------------------|
*/

function ajax_tenteVisualisationBudgetSuccursale() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)
        var RSbudget;

        switch (strVerdict) {
            case "PASOK;":
                b('lblBudgetVisualisation', "");
                b('lblMessageBudgetVisualisation', "Succursale inconnue!");
                break;
            case "ERREUR;":
                b('lblBudgetVisualisation', "");
                b('lblMessageBudgetVisualisation', "Une erreur inattendue est survenue!");
                break;
            default:
                RSbudget = strVerdict.split(';')[0];
                b('lblBudgetVisualisation', RSbudget);
                b('lblMessageBudgetVisualisation', "Budget affiché");
        }

    }
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_tenteVisualisationBudgetSuccursale)
    |-----------------------------------------------------------------------------------------------------------|
    */
    
    strconnexion = strNomApplication + "/succursales/succursale-budget"
    /* Validation de la ville saisie */
    var villeBudgetSaisie = b('tbVilleBudgetVisualisation');
    var villeBudgetValide = validerNomVille(villeBudgetSaisie);

    if (villeBudgetValide) {
        strDonneesTransmises = "aut=" + cleConnection + "&ville=" + villeBudgetSaisie;

        let objDonneesTransmises = new URLSearchParams({            
            "aut": cleConnection,
            "ville": villeBudgetSaisie,
        });

        let objOptions = {
            method: 'post',
            body: objDonneesTransmises            
        }

        /* Pour la trace de la requete*/
        b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

        // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        fetch(strconnexion, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))

    } else {
        b('lblMessageBudgetVisualisation', " Ville invalide!");
    }
}

/*
|--------------------------------------------------------------------------------------------------------------|
| Module ajax_reinitialiseSuccursales
|--------------------------------------------------------------------------------------------------------------|
*/
function ajax_reinitialiseSuccursales() {
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | recupereReponseServeur
    |-----------------------------------------------------------------------------------------------------------|
    */
    function recupereReponseServeur(strVerdict) {
        /* Pour la trace de la reponse */
        b('lblReponse', strVerdict)

        /* effacer le contenue la page */
        effacerAjoutModification();
        effacerRetrait();
        effacerBudgetVisualisation();
        nbSuccursales = 0;
        ajax_compteSuccursales();
    }
    /*
    |-----------------------------------------------------------------------------------------------------------|
    | Module directeur (ajax_reinitialiseSuccursales)
    |-----------------------------------------------------------------------------------------------------------|
    */
    var reset = confirm('Supprimer toutes les succursales enregistrées?\n(cette action est irréversible)')
    strConnexion = strNomApplication + "/succursales/succursale-suppression"
    
    if (reset) {
        strDonneesTransmises = "aut=" + cleConnection

        let objDonneesTransmises = new URLSearchParams({            
            "aut": cleConnection,
        });

        let objOptions = {
            method: 'delete',
            body: objDonneesTransmises
        }

        /* Pour la trace de la requete*/
        b('lblRequete', strNomApplication + '?' + strDonneesTransmises)

        // requeteServeur(strNomApplication, strDonneesTransmises, recupereReponseServeur, true)
        fetch(strConnexion, objOptions)
            .then(response => response.text())
            .then(responseData => recupereReponseServeur(responseData))

    } else {
        return;
    }
}