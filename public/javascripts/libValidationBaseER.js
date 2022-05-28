/* 	Nom du script: libValidationBaseER.js
	Auteurs: Ronald Jean-Julien
	Date: Le 24/02/2022
	But: Librairie de fonctions pour des validations de base 
*/

// Retourne true si la donnée vaut null
// sinon retourne false
const estNull = (donnee) => {
	return (donnee == null);
}

// Retourne true si la donnée est un nombre (de type number ou de type object)
// sinon retourne false
const estUnNombre = (fltDonnee) => {
	return (!estNull(fltDonnee) && (typeof fltDonnee == 'number') ||
    (typeof fltDonnee == 'object' && fltDonnee instanceof Number));
}

// Retourne true si la donnée est une chaîne (de type string ou de type object)
// sinon retourne false
const estUneChaine = (strDonnee) => {
    return (!estNull(strDonnee) && (typeof strDonnee == 'string') ||
    (typeof strDonnee == 'object' && strDonnee instanceof String));
}

// Retourne true si la donnée est un tableau
// sinon retourne false
const estUnTableau = (tabDonnee) => {
    return (!estNull(tabDonnee) && (typeof tabDonnee == 'object' && tabDonnee instanceof Array));
}

// Retourne true si les deux données sont de même type
// sinon retourne false
const sontDeMemeType = (donnee1, donnee2) => {
	return (!estNull(donnee1) && !estNull(donnee2) && (typeof donnee1 == typeof donnee2));
}

// Retourne true si une donnée est située entre une valeur et une autre valeur
// sinon retourne false
const estDansIntervalle = (donnee, valeur1, valeur2) => {
    return (sontDeMemeType(donnee, valeur1) && sontDeMemeType(valeur1, valeur2) && donnee >= valeur1 && donnee <= valeur2);
}

// Retourne true si une chaîne de caractères contient seulement un nombre
// sinon retourne false
const contientSeulementUnNombre = (strDonnee) => {
    var exprReg = /^[-+]?\d+(\.\d+)?$/;
    return(estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères contient seulement un nombre entier
// sinon retourne false
const contientSeulementUnNombreEntier = (strDonnee) => {
    var exprReg = /^[-+]?\d+$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères contient seulement un nombre hexadécimal
// sinon retourne false
const contientSeulementUnNombreHexa = (strDonnee) => {
    var exprReg = /^[0-9A-Fa-f]+$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères est vide
// sinon retourne false
const estUneChaineVide = (strDonnee) => {
    var exprReg = /^$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères ne contient que des caractères blancs
// sinon retourne false
const estUneChaineBlanche = (strDonnee) => {
    var exprReg = /^\s*$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères contient un seul chiffre
// sinon retourne false
const estUnCaractereNumerique = (strDonnee) => {
    var exprReg = /^\d$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères contient une seule lettre
// sinon retourne false
const estUnCaractereAlpha = (strDonnee) => {
    var exprReg = /^[A-Z]$/i
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une chaîne de caractères contient un seul chiffre ou une seule lettre
// sinon retourne false
const estUnCaractereAlphaNumerique = (strDonnee) => {
    var exprReg = /^[A-Z0-9]$/i
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si un caractère est présent parmi les choix
// sinon retourne false
const estUnCaractereValide = (strCaractere, strChoixCaracteres) => {
    return (estUneChaine(strCaractere) && estUneChaine(strChoixCaracteres) && strCaractere.length == 1 && strChoixCaracteres.indexOf(strCaractere) != -1);
}

// Retourne true si une donnée est dans un format valide
// sinon retourne false
// Dans le format, # représente un chiffre, @ représente une lettre
// tout autre caractère est le caractère lui-même 
const estDansUnFormatValide = (strDonnee, strFormat) => {
    var binValide = estUneChaine(strDonnee) && estUneChaine(strFormat) && strFormat.length == strDonnee.length;

    if (binValide)
        for (var i = 0; (i < strDonnee.length) && binValide; i++)
            switch (strFormat.charAt(i)) {
            case '@':
                binValide = estUnCaractereAlpha(strDonnee.charAt(i));
                break;

            case '#':
                binValide = estUnCaractereNumerique(strDonnee.charAt(i));
                break;

            default:
                binValide = strFormat.charAt(i) == strDonnee.charAt(i);
        }

        return binValide;
}

// Retourne true si une donnée est un code postal
// sinon retourne false
const estUnCodePostal = (strDonnee) => {
    var exprReg = /^[A-Z]\d[A-Z] \d[A-Z]\d$/i;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une donnée est un numéro d'assurance sociale
// sinon retourne false
const estUnNAS = (strDonnee) => {
    var exprReg = /^\d{3} \d{3} \d{3}$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une donnée est un matricule
// sinon retourne false
const estUnMatricule = (strDonnee) => {
    var exprReg = /^\d{7}$/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une donnée est un code permanent
// sinon retourne false
const estUnCodePermanent = (strDonnee) => {
    var exprReg = /^[A-Z]{4}\d{8}$/i;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si une donnée est un numéro de téléphone
// sinon retourne false
const estUnNoDeTelephone = (strDonnee) => {
    var exprReg = /(^\(\d{3}\) \d{3}\-\d{4}$)|(^\d{3}\-\d{3}\-\d{4}$)/;
    return (estUneChaine(strDonnee) && exprReg.test(strDonnee));
}

// Retourne true si les données représentent une date valide
// sinon retourne false
const estUneDateValide = (strJour, strMois, strAnnee) => {
    var binValide = contientUnNombreEntier(strJour) && contientUnNombreEntier(strMois) &&
                    contientUnNombreEntier(strAnnee);
    if (binValide) {
        var intMois = parseInt(strMois);
        var intJour = parseInt(strJour);
        var intAnnee = parseInt(strAnnee);
        binValide = estDansIntervalle(intMois, 1, 12);
        if (binValide) {
            var intMaxJours = 31;
            switch (intMois) {              
                case 4:
                case 6:
                case 9:
                case 11:
                    intMaxJours = 30;
                    break;

                case 2: 
                    intMaxJours = ((intAnnee % 400 == 0) || (intAnnee % 4 == 0 && intAnnee % 100 != 0)) ? 29 : 28;
            } // fin du switch

            binValide = estDansIntervalle(intJour, 1, intMaxJours);
        } 
   }
   
   return binValide;         
}