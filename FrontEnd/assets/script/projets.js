//Etape 1.1


const sectionProjets = document.querySelector(".gallery");

const response = await fetch('http://localhost:5678/api/works');
let projet = await response.json();

genererProjets(projet);

//Etape 1.2 - Trier les projets par catégorie
const btncontainer = document.querySelector(".filters");

boutonTous();
autresBoutonsCategories();

//Filtrer les projets
boutonFiltre();


// MODALE

//Afficher modifier et mode édiction
let tokenAdmin = sessionStorage.getItem("token")
pageAdmin();

// afficher, cacher et naviguer - modale
let modaleBackground = document.querySelector(".modale");
let editGallery = document.getElementById("editGallery");
let addPhoto = document.getElementById("addPhoto");
initAddEventListenerModale();

const btnAddPhoto = document.querySelector(".btnAddPhoto");
btnAddPhoto.addEventListener("click", function() {
    editGallery.style.display = "none";
    addPhoto.style.display = "flex";
});

const fleche = document.getElementById("fleche");
fleche.addEventListener("click", function() {
    editGallery.style.display = "flex";
    addPhoto.style.display = "none";
});

const croixBtns = document.querySelectorAll(".fa-xmark");
croixBtns.forEach(btn => {
    btn.addEventListener("click", function() {
    cacherModale();
    });
});

// Modale - Gallerie

const modaleProjets = document.querySelector(".modale-projets");

genererProjetsModale(projet);

// Modale - Delete

modaleProjets.addEventListener("click", function(event) {
    const trashCanBtn = event.target;
    if (event.target.classList.contains("fa-trash-can")) {
        const confirmation = confirm("Êtes vous sûr de vouloir supprimer ce projet ?");
        if(confirmation) {
            const projectId = event.target.id;
            deleteProject(projectId);
        } else {
            console.log("J'ai refusé");
        }
    };
})


// Modale - Ajouter Projet

//Preview Image
const newImage = document.getElementById("photoPreviewImg");
const iconeImage = document.getElementById("newPhotoImage");
const labelImage = document.getElementById("labelImage");
const pImage = document.querySelector("#newPhoto p");
const inputImage = document.getElementById("image");
const blocPreview = document.getElementById("newPhoto");
const deleteImage = document.getElementById("delete-image");
const deleteImageContainer = document.querySelector(".delete-bouton");


inputImage.addEventListener("change", function() {
    const selectedImage = inputImage.files[0];
    newImage.src = URL.createObjectURL(selectedImage);
    labelImage.style.display = "none";
    iconeImage.style.display = "none";
    pImage.style.display = "none";
    newImage.style.display = "flex";
    blocPreview.classList.toggle("input-image");
    deleteImageContainer.style.display = "flex";
});

deleteImage.addEventListener("click", function(event) {
    event.preventDefault();
    inputImage.value ="";
    labelImage.style.display = "flex";
    iconeImage.style.display = "flex";
    pImage.style.display = "flex";
    newImage.style.display = "none";
    blocPreview.classList.toggle("input-image");
    deleteImageContainer.style.display = "none";
});

//Catégories
const selectCategory = document.getElementById("modale-projets-category");

formCategory();


//Submit button
const newImageTitre = document.getElementById("modale-projets-titre");
const submitBtn = document.getElementById("valider");

inputImage.addEventListener("input", checkForm);
newImageTitre.addEventListener("change", checkForm);
selectCategory.addEventListener("change", checkForm);

//Add new work
submitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const image = document.getElementById("image").files[0];
    const title = document.getElementById("modale-projets-titre").value;
    const category = document.getElementById("modale-projets-category").value;
    if(!image || !title || !category) {
        alert("Veuillez remplir tous les champs du formulaire.");
        return;
    } 
    if (image.size > 4 * 1024 * 1024) {
        alert("La taille de l'image ne doit pas dépasser 4 Mo.");
        return;
    }

    const formData = new FormData();
    formData.append("image", image, image.name);
    formData.append("title", title);
    formData.append("category", category);
    let tokenAdmin = sessionStorage.getItem("token");

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${tokenAdmin}`,
        },
        body: formData
    })
    
    .then(async(response) => {
        if (response.ok) {
            const responseUpdate = await fetch('http://localhost:5678/api/works');
                let projetUpdate = await responseUpdate.json();
                genererProjets(projetUpdate);
                genererProjetsModale(projetUpdate);
                alert("Le nouveau projet a été ajouté avec succés");
                resetForm();
                cacherModale();        
            } else {
                alert("Ereur inconnue: " + response.status);
            }
    })
    .catch(error => {
        console.error('Une erreur est survenue:', error);
        alert("Une erreur est survenue lors de l'ajout du projet.");
    });
})

//Bouton contact
const formContact = document.querySelector("form");
formContact.addEventListener("submit", function(event) {
    event.preventDefault();
});

/*************/
/* FONCTIONS */
/*************/

//Reset de la galerie de projets
function resetProjets() {
    sectionProjets.innerHTML = "";
}


//Génération des projets depuis l'API
function genererProjets(projet) {
    resetProjets();
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

//Création des boutons filtres
function boutonTous () {
    const bouton = document.createElement("button");
    bouton.innerText = "Tous les projets";
    bouton.className = "btnFilter btnTous selected";
    btncontainer.appendChild(bouton);
}

function autresBoutonsCategories () {
    const categories = {};
    projet.forEach(item => {
        const projetCategoryId = item.category.id;
        const projetCategoryName = item.category.name;
        if (!categories[projetCategoryId]) {
            categories[projetCategoryId] = projetCategoryName;
            const bouton = document.createElement("button");
            bouton.innerText = projetCategoryName;
            bouton.classList = `btnFilter btn${projetCategoryId}`;
            bouton.setAttribute("data-id-category", projetCategoryId);
            btncontainer.appendChild(bouton);
            }
        });
}

//Fonction boutons filtres selected + filtrer les projets
function boutonFiltre () {
    const btnFilter = document.querySelectorAll(".btnFilter");
    let projetsFiltres = projet;
    btnFilter.forEach(bouton => {
        bouton.addEventListener("click", function(){
            const boutonSelectionne = document.querySelector(".btnFilter.selected");
            if (boutonSelectionne) {
                boutonSelectionne.classList.remove("selected");
            } 
            bouton.classList.add("selected");
            const idCategoryString = bouton.getAttribute("data-id-category");
            let idCategory = Number(idCategoryString);
            if (isNaN(idCategory)) {
                idCategory = null;
            }
            if (idCategory === null || idCategory === 0) {
                projetsFiltres = projet;
            } else {
                projetsFiltres = projet.filter(function(projet) {
                    return projet.categoryId === idCategory;
                });
            }
            genererProjets(projetsFiltres);
        });
    });
}

//Modale
//Afficher modifier et mode édiction
function pageAdmin () {
    if (tokenAdmin?.length === 143) {
        btncontainer.style.display ="none";
        document.getElementById("login").innerText = "logout";
        document.querySelector(".modify-portfolio").style.display = "flex";
        document.getElementById("logo-edition").style.display = "flex";
    } else if (tokenAdmin === null) {
        btncontainer.style.display ="flex";
        document.getElementById("login").innerText = "login";
        document.querySelector(".modify-portfolio").style.display = "none";
        document.getElementById("logo-edition").style.display = "none";
    }    
}

//Afficher, cacher et naviguer - modale
function afficherModale() {
    modaleBackground.classList.add("active");
    editGallery.style.display = "flex";
}

function cacherModale() {
    modaleBackground.classList.remove("active");
    editGallery.style.display = "none";
    addPhoto.style.display = "none";
}

function initAddEventListenerModale () {
    let linkModale = document.querySelector(".modify-portfolio");
    linkModale.addEventListener("click", () => {
        afficherModale();
    });
    modaleBackground.addEventListener("click", (event) => {
        if (event.target === modaleBackground) {
            cacherModale();
        }
    });
}

//Générer la gallerie
function resetProjetsModale() {
    modaleProjets.innerHTML = "";
}

function genererProjetsModale(projet) {
    resetProjetsModale();
    for(let i = 0; i < projet.length; i++) {
        const p = projet[i];
        const miniProjet = document.createElement("figure");
        miniProjet.classList.add("miniProjet");
        modaleProjets.appendChild(miniProjet);
        const modaleImg = document.createElement("img");
        modaleImg.src = p.imageUrl;
        modaleImg.alt = p.title;
        modaleImg.title = p.title;
        miniProjet.appendChild(modaleImg);
        const trashCan = document.createElement("i");
        trashCan.classList.add("fa-solid", "fa-trash-can");
        trashCan.id = p.id;
        miniProjet.appendChild(trashCan);
    }

}

//Suppresion de projets
function deleteProject(i) {
    fetch("http://localhost:5678/api/works/" + i, {
        method: "DELETE",
        headers:  {
            "Accept" : 'application/json',
            "Authorization" : `Bearer ${tokenAdmin}`
        }
    }).then(async function(response) {
        if (response.ok) {
            const responseUpdate = await fetch('http://localhost:5678/api/works');
            let projetUpdate = await responseUpdate.json();
            genererProjets(projetUpdate);
            genererProjetsModale(projetUpdate);
            alert("Projet supprimé avec succés !");
        } else {
            alert("Ereur inconnue: " + response.status);
        }
    }).catch(error => {
        console.error('Une erreur est survenue:', error);
        console.error('Erreur lors de la suppression du projet:', error);
        alert("Une erreur s'est produite lors de la suppression du projet.");
    });
}

//Catégories - ajout de projet
function formCategory() {
    selectCategory.innerHTML = "";
    let option = document.createElement("option");
    selectCategory.appendChild(option);

    let categories = [];
    fetch("http://localhost:5678/api/categories")
        .then( response => {
            return response.json();
        })
        .then (data => {
            categories = data;
            categories.forEach((categorie) => {
                option = document.createElement("option");
                option.value = categorie.id;
                option.innerText = categorie.name;
                option.id = categorie.id;
                selectCategory.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error);
            // Gérer l'erreur ici
        });     
}

//Submit button
function checkForm() {
    const formValide = inputImage.value !== "" && newImageTitre.value !== "" && selectCategory.selectedIndex !== 0;
    submitBtn.classList.toggle("formValide", formValide); 
}

//reste form new work
function resetForm () {
    inputImage.value ="";
    labelImage.style.display = "flex";
    iconeImage.style.display = "flex";
    pImage.style.display = "flex";
    newImage.style.display = "none";
    blocPreview.classList.toggle("input-image");
    deleteImageContainer.style.display = "none";
    newImageTitre.value = "";
    if (selectCategory.options.length > 0) {
        selectCategory.selectedIndex = 0;
    }
    checkForm();
}