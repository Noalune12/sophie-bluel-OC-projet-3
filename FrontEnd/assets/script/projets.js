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
const btnObjets = document.querySelector(".btnObjets");
const btnAppart = document.querySelector(".btnAppart");
const btnHotels = document.querySelector(".btnHotels");
let projetsFiltres = projet


//Fonction boutons filtres selected
function boutonFilter () {
    btnFilter.forEach(bouton => {
        bouton.addEventListener("click", function(){
            const boutonSelectionne = document.querySelector(".btnFilter.selected");
            if (boutonSelectionne) {
                boutonSelectionne.classList.remove("selected");
            } 
            bouton.classList.add("selected");
        })
    })
}

//Filtrer les projets
for (let i =0; i < btnFilter.length; i++) {
    btnFilter[i].addEventListener("click", function() {
        let btnClass = btnFilter[i].classList
        if (btnClass.contains("btnObjets")) {
            projetsFiltres = projet.filter(function(projet) {
                return projet.categoryId === 1;
            })
        }
        else if (btnClass.contains("btnAppart")) {
            projetsFiltres = projet.filter(function(projet) {
                return projet.categoryId === 2;
            })
        }
        else if (btnClass.contains("btnHotels")) {
            projetsFiltres = projet.filter(function(projet) {
                return projet.categoryId === 3;
            })
        }
        else {
            projetsFiltres = projet
        }
        resetProjets();
        genererProjets(projetsFiltres);
        boutonFilter();
    })
}



// btnTous.addEventListener("click", function(){
//     const projetsFiltres = projet
//     resetProjets();
//     genererProjets(projetsFiltres);
// });


// btnObjets.addEventListener("click", function(){
//     const projetsFiltres = projet.filter(function(projet) {
//         return projet.categoryId === 1;
//     });
//     resetProjets();
//     genererProjets(projetsFiltres);
// });


// btnAppart.addEventListener("click", function(){
//     const projetsFiltres = projet.filter(function(projet) {
//         return projet.categoryId === 2;
//     });
//     resetProjets();
//     genererProjets(projetsFiltres);
// });


// btnHotels.addEventListener("click", function(){
//     const projetsFiltres = projet.filter(function(projet) {
//         return projet.categoryId === 3;
//     });
//     resetProjets();
//     genererProjets(projetsFiltres);
// });

//autre possibilité pour filtres selected
// for (let index = 0; index < btnFilter.length; index++) {
//     btnFilter[index].addEventListener("click", function(){
//         let current = document.querySelector(".selected");
//         current.classList.remove("selected"); 
//         this.classList.add("selected");
//     });
// }

//test filtres projets avec switch
// for (let i = 0; i < btnFilter.length; i++) {
//     btnFilter[i].addEventListener("click", function(){
//         switch (btnFilter[i].classList) {
//                 case btnObjets:
//                     console.log("Bouton Objet");
//                     break;
//                 case btnAppart:
//                     console.log("Bouton Appart");
//                     break;
//             };
//     })
// }



