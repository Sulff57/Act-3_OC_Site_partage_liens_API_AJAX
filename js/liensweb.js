/* ----------- rajout code après ligne 124 -----------------------
 + modifs code activite 2: retrait contenu variable listeLiens (ligne 13)
 + appel script ajax.js dans liensweb.html
+ modif lignes 106-108)

Activité 3
*/

// Liste des liens Web à afficher. Un lien est défini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publié)
var listeLiens = [];

// Crée et renvoie un élément DOM affichant les données d'un lien
// Le paramètre lien est un objet JS représentant un lien
function creerElementLien(lien) {
    var titreElt = document.createElement("a");
    titreElt.href = lien.url;
    titreElt.style.color = "#428bca";
    titreElt.style.textDecoration = "none";
    titreElt.style.marginRight = "5px";
    titreElt.appendChild(document.createTextNode(lien.titre));

    var urlElt = document.createElement("span");
    urlElt.appendChild(document.createTextNode(lien.url));

    // Cette ligne contient le titre et l'URL du lien
    var ligneTitreElt = document.createElement("h4");
    ligneTitreElt.style.margin = "0px";
    ligneTitreElt.appendChild(titreElt);
    ligneTitreElt.appendChild(urlElt);

    // Cette ligne contient l'auteur
    var ligneDetailsElt = document.createElement("span");
    ligneDetailsElt.appendChild(document.createTextNode("Ajouté par " + lien.auteur));

    var divLienElt = document.createElement("div");
    divLienElt.classList.add("lien");
    divLienElt.appendChild(ligneTitreElt);
    divLienElt.appendChild(ligneDetailsElt);

    return divLienElt;
}

var contenuElt = document.getElementById("contenu");
// Parcours de la liste des liens et ajout d'un élément au DOM pour chaque lien
listeLiens.forEach(function (lien) {
    var lienElt = creerElementLien(lien);
    contenuElt.appendChild(lienElt);
});

// Crée et renvoie un élément DOM de type input
function creerElementInput(placeholder, taille) {
    var inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.setAttribute("size", taille);
    inputElt.setAttribute("required", "true");
    return inputElt;
}

var ajouterLienElt = document.getElementById("ajoutLien");
// Gère l'ajout d'un nouveau lien
ajouterLienElt.addEventListener("click", function () {
    var auteurElt = creerElementInput("Entrez votre nom", 20);
    var titreElt = creerElementInput("Entrez le titre du lien", 40);
    var urlElt = creerElementInput("Entrez l'URL du lien", 40);

    var ajoutElt = document.createElement("input");
    ajoutElt.type = "submit";
    ajoutElt.value = "Ajouter";

    var formAjoutElt = document.createElement("form");
    formAjoutElt.appendChild(auteurElt);
    formAjoutElt.appendChild(titreElt);
    formAjoutElt.appendChild(urlElt);
    formAjoutElt.appendChild(ajoutElt);

    var p = document.querySelector("p");
    // Remplace le bouton d'ajout par le formulaire d'ajout
    p.replaceChild(formAjoutElt, ajouterLienElt);

    // Ajoute le nouveau lien
    formAjoutElt.addEventListener("submit", function (e) {
        e.preventDefault(); // Annule la publication du formulaire

        var url = urlElt.value;
        // Si l'URL ne commence ni par "http://" ni par "https://"
        if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
            // On la préfixe par "http://"
            url = "http://" + url;
        }

        // Création de l'objet contenant les données du nouveau lien
        var lien = {
            titre: titreElt.value,
            url: url,
            auteur: auteurElt.value
        };

        var lienElt = creerElementLien(lien);
        // Ajoute le nouveau lien en haut de la liste
        // En cas de succès de la requête ajax post
        ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", lien, function (reponse){
          contenuElt.insertBefore(lienElt, contenuElt.firstChild);
        }, true);
        // Remplace le formulaire d'ajout par le bouton d'ajout
        p.replaceChild(ajouterLienElt, formAjoutElt);

        // Création du message d'information
        var infoElt = document.createElement("div");
        infoElt.classList.add("info");
        infoElt.textContent = "Le lien \"" + lien.titre + "\" a bien été ajouté.";
        p.insertBefore(infoElt, ajouterLienElt);
        // Suppresion du message après 2 secondes
        setTimeout(function () {
            p.removeChild(infoElt);
        }, 2000);
    });
});
// ----------- Nouveau code activité 3 -----------------------------------------

// on récupère les données du site grâce à l'API
// et on programme l'appel de la fonction insererLien avec le résultat à son arrivée
ajaxGet("https://oc-jswebsrv.herokuapp.com/api/liens", insererLien);

// on récupère le tableau au format JSON
// puis on en fait un objet JS
// pour chaque élément de ce tableau on crée l'élement div correspondant en réutilisant
// la fonction creerElementLien de l'activite 2 puis on l'insère à la fin
// car le tableau JSON renvoyé par le serveur est déjà trié du plus récent au plus vieux
function insererLien(reponse)
{
  var tabDataApiLien = JSON.parse(reponse);
  tabDataApiLien.forEach(function (element){
    var lien = {
          titre: element.titre,
          url: element.url,
          auteur: element.auteur
    };
    var divLienElt = creerElementLien(lien);
    contenuElt.appendChild(divLienElt);
  });
}
