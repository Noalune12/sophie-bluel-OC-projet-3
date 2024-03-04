//Etape 1.1


const sectionProjets = document.querySelector(".gallery");

const response = await fetch('http://localhost:5678/api/works');
let projet = await response.json();

//Reset de la galerie de projets
function resetProjets() {
    sectionProjets.innerHTML = "";
}

resetProjets();

//Génération des projets depuis l'API
function genererProjets(projet) {
    for(let i = 0; i < projet.length; i++) {
        const figure = document.createElement("figure");
        sectionProjets.appendChild(figure);
        const img = document.createElement("img");
        img.src = projet[i].imageUrl;
        img.alt = projet[i].title;
        figure.appendChild(img);
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = projet[i].title;
        figure.appendChild(figcaption);
    }

}

genererProjets(projet)

//Etape 1.2 - Trier les projets par catégorie
const btncontainer = document.querySelector(".filters");
const btnFilter = document.querySelectorAll(".btnFilter");

const btnTous = document.querySelector(".btnTous");

btnTous.addEventListener("click", function(){
    const projetsFiltres = projet
    resetProjets();
    genererProjets(projetsFiltres);
});

const btnObjets = document.querySelector(".btnObjets");

btnObjets.addEventListener("click", function(){
    const projetsFiltres = projet.filter(function(projet) {
        return projet.categoryId === 1;
    });
    resetProjets();
    genererProjets(projetsFiltres);
});

const btnAppart = document.querySelector(".btnAppart");

btnAppart.addEventListener("click", function(){
    const projetsFiltres = projet.filter(function(projet) {
        return projet.categoryId === 2;
    });
    resetProjets();
    genererProjets(projetsFiltres);
});

const btnHotels = document.querySelector(".btnHotels");

btnHotels.addEventListener("click", function(){
    const projetsFiltres = projet.filter(function(projet) {
        return projet.categoryId === 3;
    });
    resetProjets();
    genererProjets(projetsFiltres);
});

for (var index = 0; index < btnFilter.length; index++) {
    btnFilter[index].addEventListener("click", function(){
        var current = document.getElementsByClassName("selected");
        current[0].className = current[0].className.replace(" selected", "");
        this.className += " selected";
    });
}


/*btnFilter.forEach(bouton => {
    bouton.addEventListener("click", function() {
        bouton.classList.remove('selected');
    });
    this.classList.add('selected');
});*/


