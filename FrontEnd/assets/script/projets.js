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

//Création des boutons filtres
function boutonTous () {
    const bouton = document.createElement("button");
    bouton.innerText = "Tous les projets";
    bouton.className = "btnFilter btnTous selected";
    btncontainer.appendChild(bouton);
}

function autresBoutons () {
    const categories = {};
    projet.forEach(item => {
        const projetCategoryId = item.category.id;
        const projetCategoryName = item.category.name;
        if (!categories[projetCategoryId]) {
            categories[projetCategoryId] = projetCategoryName;
            const bouton = document.createElement("button");
            bouton.innerText = projetCategoryName;
            bouton.classList = `btnFilter btn${projetCategoryId}`;
            btncontainer.appendChild(bouton);
            }
        })
}

boutonTous()
autresBoutons()


const btnFilter = document.querySelectorAll(".btnFilter");

// const btnTous = document.querySelector(".btnTous");
// const btnObjets = document.querySelector(".btn1");
// const btnAppart = document.querySelector(".btn2");
// const btnHotels = document.querySelector(".btn3");
let projetsFiltres = projet



//Fonction boutons filtres selected
function boutonFilterSelected () {
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
    boutonFilterSelected();
    btnFilter[i].addEventListener("click", function() {
        let btnClass = btnFilter[i].classList
        if (btnClass.contains("btn1")) {
            projetsFiltres = projet.filter(function(projet) {
                return projet.categoryId === 1;
            })
        }
        else if (btnClass.contains("btn2")) {
            projetsFiltres = projet.filter(function(projet) {
                return projet.categoryId === 2;
            })
        }
        else if (btnClass.contains("btn3")) {
            projetsFiltres = projet.filter(function(projet) {
                return projet.categoryId === 3;
            })
        }
        else {
            projetsFiltres = projet
        }
        resetProjets();
        genererProjets(projetsFiltres);
    })
}



// btnTous.addEventListener("click", function(){
//     const projetsFiltres = projet
//     resetProjets();
//     genererProjets(projetsFiltres);
// });


// btn1.addEventListener("click", function(){
//     const projetsFiltres = projet.filter(function(projet) {
//         return projet.categoryId === 1;
//     });
//     resetProjets();
//     genererProjets(projetsFiltres);
// });


// btn2.addEventListener("click", function(){
//     const projetsFiltres = projet.filter(function(projet) {
//         return projet.categoryId === 2;
//     });
//     resetProjets();
//     genererProjets(projetsFiltres);
// });


// btn3.addEventListener("click", function(){
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

// MODALE

//Afficher modifier
let tokenAdmin = sessionStorage.getItem("token")
console.log(tokenAdmin)
function pageAdmin () {
    if (tokenAdmin?.length === 143) {
        btncontainer.style.display ="none";
        document.getElementById("login").innerText = "logout";
        document.querySelector(".modify-portfolio").style.display = "flex"
    } else if (tokenAdmin === null) {
        btncontainer.style.display ="flex";
        document.getElementById("login").innerText = "login";
        document.querySelector(".modify-portfolio").style.display = "none"
    }    
}

pageAdmin()

// afficher, cacher et naviguer - modale

let modaleBackground = document.querySelector(".modale")
let editGallery = document.getElementById("editGallery")
let addPhoto = document.getElementById("addPhoto")

function afficherModale() {
    modaleBackground.classList.add("active")
    editGallery.style.display = "flex"
}

function cacherModale() {
    modaleBackground.classList.remove("active")
    editGallery.style.display = "none"
    addPhoto.style.display = "none"
}

function initAddEventListenerModale () {
    let linkModale = document.querySelector(".modifier-link")
    linkModale.addEventListener("click", () => {
        afficherModale()
    })
    modaleBackground.addEventListener("click", (event) => {
        if (event.target === modaleBackground) {
            cacherModale()
        }
    })
}

initAddEventListenerModale()

const btnAddPhoto = document.querySelector(".btnAddPhoto")
btnAddPhoto.addEventListener("click", function() {
    editGallery.style.display = "none";
    addPhoto.style.display = "flex";

})

const fleche = document.getElementById("fleche")
fleche.addEventListener("click", function() {
    editGallery.style.display = "flex";
    addPhoto.style.display = "none";
})

// Modale - Gallerie

const modaleProjets = document.querySelector(".modale-projets")
function genererProjetsModale(projet) {
    modaleProjets.innerHTML = "";
    for(let i = 0; i < projet.length; i++) {
        const miniProjet = document.createElement("figure");
        miniProjet.classList.add("miniProjet")
        modaleProjets.appendChild(miniProjet);
        const modaleImg = document.createElement("img");
        modaleImg.src = projet[i].imageUrl;
        modaleImg.alt = projet[i].title;
        modaleImg.title = projet[i].title;
        miniProjet.appendChild(modaleImg);
        const trashCan = document.createElement("i");
        trashCan.classList.add("fa-solid", "fa-trash-can");
        trashCan.id = projet[i].id;
        miniProjet.appendChild(trashCan);
    }

}

genererProjetsModale(projet)

// Modale - Delete

let trashCans = document.querySelectorAll(".fa-trash-can");
trashCans.forEach(trashCan => {
    trashCan.addEventListener("click", function () {
    const confirmation = confirm("Êtes vous sûr de vouloir supprimer ce projet ?")
    if (confirmation) {
        console.log(trashCan.id);
        deleteProject(trashCan.id);
    } else {
        console.log("J'ai refusé")
    }
    })
})


function deleteProject(i) {
    fetch("http://localhost:5678/api/works/" + i, {
        method: "DELETE",
        headers:  {
            "Accept" : 'application/json',
            "Authorization" : `Bearer ${tokenAdmin}`
        }
    }).then((response) => {
        if (response.ok) {
            projet = projet.filter((p) => p.id != i);
            console.log(projet);
            resetProjets();
            genererProjets(projet);
            genererProjetsModale(projet);
            alert("Projet supprimé avec succés !")
        } else {
            alert("Ereur inconnu: " + response.status);
        }

        // if (response.status === 200) {
        //     alert("Projet supprimé avec succés !")
        //     projet = projet.filter(p => p.id !==i);
        //     genererProjets(projet);
        //     genererProjetsModale(projet);
        // } else if (response.status === 401) {
        //     alert("Erreur : Unauthorized");
        // } else if (response.status === 500) {
        //     alert("Erreur : Unexpected Behavior");
        // } else {
        //     alert("Ereur inconnu: " + response.status);
        // }
    })
}


