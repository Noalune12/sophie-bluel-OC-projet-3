const sectionProjects = document.querySelector(".gallery");

const response = await fetch('http://localhost:5678/api/works');
let projects = await response.json();

generateProjects(projects);

const btncontainer = document.querySelector(".filters");

buttonAllProjects();
buttonsCategories();
buttonFiltered();


// MODALE

let tokenAdmin = sessionStorage.getItem("token")
pageAdmin();

let modaleBackground = document.querySelector(".modale");
let editGallery = document.getElementById("editGallery");
let addPhoto = document.getElementById("add-photo");
initAddEventListenerModale();

const btnAddPhoto = document.querySelector(".btn-add-photo");
btnAddPhoto.addEventListener("click", function() {
    editGallery.style.display = "none";
    addPhoto.style.display = "flex";
});

const arrow = document.getElementById("arrow");
arrow.addEventListener("click", function() {
    editGallery.style.display = "flex";
    addPhoto.style.display = "none";
});

const closeBtn = document.querySelectorAll(".fa-xmark");
closeBtn.forEach(btn => {
    btn.addEventListener("click", function() {
    hideModale();
    });
});

const modaleProjects = document.querySelector(".modale-projects");

generateProjectsModale(projects);

// Modale - Delete

modaleProjects.addEventListener("click", function(event) {
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


// Modale - Add New work
const newImage = document.getElementById("photo-preview-img");
const iconeImage = document.getElementById("new-photo-image");
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector("#new-photo p");
const inputImage = document.getElementById("image");
const blocPreview = document.getElementById("new-photo");
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

const selectCategory = document.getElementById("modale-projects-category");
formCategory();


const newImageTitre = document.getElementById("modale-projects-titre");
const submitBtn = document.getElementById("valider");

inputImage.addEventListener("input", checkForm);
newImageTitre.addEventListener("change", checkForm);
selectCategory.addEventListener("change", checkForm);

submitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const image = document.getElementById("image").files[0];
    const title = document.getElementById("modale-projects-titre").value;
    const category = document.getElementById("modale-projects-category").value;
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
                let projectUpdate = await responseUpdate.json();
                generateProjects(projectUpdate);
                generateProjectsModale(projectUpdate);
                alert("Le nouveau projet a été ajouté avec succés");
                resetForm();
                hideModale();        
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

function generateProjects(projects) {
    sectionProjects.innerHTML = "";
    for(let i = 0; i < projects.length; i++) {
        const figure = document.createElement("figure");
        sectionProjects.appendChild(figure);
        const img = document.createElement("img");
        img.src = projects[i].imageUrl;
        img.alt = projects[i].title;
        figure.appendChild(img);
        const figcaption = document.createElement("figcaption");
        figcaption.innerHTML = projects[i].title;
        figure.appendChild(figcaption);
    }

}

function buttonAllProjects () {
    const button = document.createElement("button");
    button.innerText = "Tous les projets";
    button.className = "btnFilter btnTous selected";
    btncontainer.appendChild(button);
}

function buttonsCategories () {
    const categories = {};
    projects.forEach(item => {
        const projetCategoryId = item.category.id;
        const projetCategoryName = item.category.name;
        if (!categories[projetCategoryId]) {
            categories[projetCategoryId] = projetCategoryName;
            const button = document.createElement("button");
            button.innerText = projetCategoryName;
            button.classList = `btnFilter btn${projetCategoryId}`;
            button.setAttribute("data-id-category", projetCategoryId);
            btncontainer.appendChild(button);
            }
        });
}

function buttonFiltered () {
    const btnFilter = document.querySelectorAll(".btnFilter");
    let projectsFiltered = projects;
    btnFilter.forEach(button => {
        button.addEventListener("click", function(){
            const buttonSelected = document.querySelector(".btnFilter.selected");
            if (buttonSelected) {
                buttonSelected.classList.remove("selected");
            } 
            button.classList.add("selected");
            const idCategoryString = button.getAttribute("data-id-category");
            let idCategory = Number(idCategoryString);
            if (isNaN(idCategory)) {
                idCategory = null;
            }
            if (idCategory === null || idCategory === 0) {
                projectsFiltered = projects;
            } else {
                projectsFiltered = projects.filter(function(projects) {
                    return projects.categoryId === idCategory;
                });
            }
            generateProjects(projectsFiltered);
        });
    });
}

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

function showModale() {
    modaleBackground.classList.add("active");
    editGallery.style.display = "flex";
}

function hideModale() {
    modaleBackground.classList.remove("active");
    editGallery.style.display = "none";
    addPhoto.style.display = "none";
}

function initAddEventListenerModale () {
    let linkModale = document.querySelector(".modify-portfolio");
    linkModale.addEventListener("click", () => {
        showModale();
    });
    modaleBackground.addEventListener("click", (event) => {
        if (event.target === modaleBackground) {
            hideModale();
        }
    });
}

function generateProjectsModale(projects) {
    modaleProjects.innerHTML = "";
    for(let i = 0; i < projects.length; i++) {
        const p = projects[i];
        const miniProjet = document.createElement("figure");
        miniProjet.classList.add("miniProjet");
        modaleProjects.appendChild(miniProjet);
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
            let projectUpdate = await responseUpdate.json();
            generateProjects(projectUpdate);
            generateProjectsModale(projectUpdate);
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
        });     
}

function checkForm() {
    const formValide = inputImage.value !== "" && newImageTitre.value !== "" && selectCategory.selectedIndex !== 0;
    submitBtn.classList.toggle("formValide", formValide); 
}

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