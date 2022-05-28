function b(strID, strValeur) {
    var objb = document.getElementById(strID);
    if (objb==null) {
        alert('Attention... balise "' + strID + '" inexistante [fonction b]!');
    }
    else {
        if (objb.value != null) {
            if (strValeur != null) {
                objb.value = strValeur;
            }
            else {
                return objb.value;
            }
        }
        else {
            if (strValeur != null) {
                objb.innerHTML = strValeur;
            }
            else {
                return objb.innerHTML;
            }
        }
    }
}

// Cette fonction affecte ou retourne les sélecteurs de mise en forme
// de l'élément XHTML identifié par strID

function s(strID, strSelecteurs) {
    var objb = document.getElementById(strID);
    if (objb==null) {
        alert('Attention... balise "' + strID + '" inexistante ! ');
    }
    else {
        if (strSelecteurs != null) {
            objb.className = strSelecteurs;
        }
        else {
            return objb.className;
        }
    }    
}

// Cette fonction affecte ou retourne si l'élément XHTML 
// identifié par strID est masqué ou non

function masqueB(strID, binMasque) {
    var objB = document.getElementById(strID);
    if (objB==null) {
        alert('Attention... balise "' + strID + '" inexistante ! [fonction masqueB]');
    }
    else {
        if (binMasque != null) {
            objB.style.display = binMasque ? 'none' : 'inline';
        }
        else {
            return objB.style.display == 'none';
        }
    }
}

// Cette fonction affecte ou retourne si l'élément XHTML 
// identifié par strID est caché ou non

function cacheB(strID, binCache) {
    var objB = document.getElementById(strID);
    if (objB==null) {
        alert('Attention... balise "' + strID + '" inexistante !');
    }
    else {
        if (binCache != null) {
            objB.style.visibility = binCache ? 'hidden' : 'visible';
        }
        else {
            return objB.style.visibility == 'hidden';
        }
    }
}

// Cette fonction récupère et retourne 
// la valeur d'une donnée transmise à une page Web.
// Si la donnée n'est pas récupérable, cette fonction
// retourne null. 
function recupereDonnee(strNomDonnee) {
	// Va chercher les données transmises
	var strDonnees = location.search.substring(1);		
	var tabStrDonnees = strDonnees.split('&');
	var strValeurDonnee = null;
	var binTrouve=false;
	for (var i = 0; i < tabStrDonnees.length && !binTrouve; i++) {
		var tabStrUneDonnee = tabStrDonnees[i].split('=');
		if (tabStrUneDonnee[0] == strNomDonnee) {
			strValeurDonnee = tabStrUneDonnee[1];
			// Remplacer les + par des espaces
			while (strValeurDonnee.indexOf('+') != -1)
			    strValeurDonnee = strValeurDonnee.replace('+', ' ');
		    // Remplacer les %2F par /
			while (strValeurDonnee.indexOf('%2F') != -1)
			    strValeurDonnee = strValeurDonnee.replace('%2F', '/');
		    // Remplacer les %27 par l'apostropphe (')
			while (strValeurDonnee.indexOf('%27') != -1)
				strValeurDonnee = strValeurDonnee.replace('%27', '\'');
				
			binTrouve = true;
		}
	}
    return strValeurDonnee;
}

// Cette fonction enregistre un cookie.
// Si le cookie est déjà présent sa valeur est remplacée.
// intDuree représente la durée du cookie en jours.
// Si la durée est négative, le cookie est automatiquement détruit.
// S'il n'y a pas de durée, le cookie est créé mais détruit à la fermeture du navigateur
function enregistreCookie(strNomCookie, strValeurCookie, intDuree) {
    if (intDuree) {  // Transforme la durée en date d'échéance
        var objDate = new Date();
        objDate.setTime(objDate.getTime() + (intDuree * 24 * 60 * 60 * 1000));
        var strEcheance = '; expires=' + objDate.toGMTString()
    }
    else
        var strEcheance = '';
   
    // Ajoute le cookie
    document.cookie = strNomCookie + '=' + strValeurCookie + strEcheance;
}

// Cette fonction récupère la valeur d'un cookie.
// Si le cookie n'existe pas, cette fonction retourne null.
function recupereCookie(strNomCookie) {
    // Va chercher tous les cookies accessibles
    var tabStrCookies = document.cookie.split(';');
    var strValeurCookie = null;
    for (var i = 0; i < tabStrCookies.length; i++) {
        // Sépare le nom de sa valeur
        var tabStrUnCookie = tabStrCookies[i].split('=');
        // Enlève l'espace avant le nom
        if (tabStrUnCookie[0].charAt(0) == ' ')
          tabStrUnCookie[0] = tabStrUnCookie[0].substring(1);
        if (tabStrUnCookie[0] == strNomCookie) {
            // Le nom a été trouvé; va chercher sa valeur
            strValeurCookie = tabStrUnCookie[1];
        }
    }
    return strValeurCookie;
}
