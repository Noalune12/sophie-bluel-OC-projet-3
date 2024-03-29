const sectionProjects = document.querySelector(".gallery");
const btncontainer = document.querySelector(".filters");
const modalProjects = document.querySelector(".modal-projects");

const response = await fetch('http://localhost:5678/api/works')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des projets');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des projets:', error);
        alert("Une erreur s'est produite lors de la récupération des projets.");
    });

if (response) {
    generateProjects(response);
    buttonAllProjects();
    buttonsCategories(response);
    buttonFiltered(response);
    generateProjectsModal(response);
}


// MODAL

let tokenAdmin = sessionStorage.getItem("token")
pageAdmin();

let modalBackground = document.querySelector(".modal");
let editGallery = document.getElementById("editGallery");
let addPhoto = document.getElementById("add-photo");
initAddEventListenerModal();

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
    hideModal();
    });
});



// Modal - Delete

modalProjects.addEventListener("click", function(event) {
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


// Modal - Add New work
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

const selectCategory = document.getElementById("modal-projects-category");
formCategory();


const newImageTitre = document.getElementById("modal-projects-titre");
const submitBtn = document.getElementById("valider");

inputImage.addEventListener("input", checkForm);
deleteImage.addEventListener("click", checkForm);
newImageTitre.addEventListener("change", checkForm);
selectCategory.addEventListener("change", checkForm);

submitBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const image = document.getElementById("image").files[0];
    const title = document.getElementById("modal-projects-titre").value;
    const category = document.getElementById("modal-projects-category").value;
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
                generateProjectsModal(projectUpdate);
                alert("Le nouveau projet a été ajouté avec succés");
                resetForm();
                hideModal();        
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

function buttonsCategories (projects) {
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

function buttonFiltered (projects) {
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

function showModal() {
    modalBackground.classList.add("active");
    editGallery.style.display = "flex";
}

function hideModal() {
    modalBackground.classList.remove("active");
    editGallery.style.display = "none";
    addPhoto.style.display = "none";
}

function initAddEventListenerModal () {
    let linkModal = document.querySelector(".modify-portfolio");
    linkModal.addEventListener("click", () => {
        showModal();
    });
    modalBackground.addEventListener("click", (event) => {
        if (event.target === modalBackground) {
            hideModal();
        }
    });
}

function generateProjectsModal(projects) {
    modalProjects.innerHTML = "";
    for(let i = 0; i < projects.length; i++) {
        const p = projects[i];
        const miniProjet = document.createElement("figure");
        miniProjet.classList.add("miniProjet");
        modalProjects.appendChild(miniProjet);
        const modalImg = document.createElement("img");
        modalImg.src = p.imageUrl;
        modalImg.alt = p.title;
        modalImg.title = p.title;
        miniProjet.appendChild(modalImg);
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
            generateProjectsModal(projectUpdate);
            alert("Projet supprimé avec succés !");
        } else {
            alert("Ereur inconnue: " + response.status);
        }
    }).catch(error => {
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