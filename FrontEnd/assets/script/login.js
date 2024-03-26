const loginForm = document.querySelector(".loginForm");
const loginError = document.querySelector(".loginError");

//Logout
if (sessionStorage.getItem("token")) {
    sessionStorage.removeItem("token");
    const p = document.createElement("p");
    p.innerText = "Vous avez été déconnecté";
    p.classList = "errorMessage";
    loginError.appendChild(p);
}

// Login
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    loginError.innerHTML ="";
    let form = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
    const chargeUtile = JSON.stringify(form);
    if (validateEmail(form.email) && validatePassword(form.password)) {
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        }).then((response) => {
            if (response.status !== 200) {
                const p = document.createElement("p");
                p.innerHTML = "Email ou mot de passe incorrect";
                p.classList = "errorMessage";
                loginError.appendChild(p); 
            } else {
                response.json().then((data) => {
                    sessionStorage.setItem("token", data.token);
                    alert("Vous êtes connecté");
                    window.location.href = "index.html";
                });
            }
        }).catch((error) => {
            console.error('Erreur lors de la requête fetch:', error);
            alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.");
        });
    } else {
        if (!validateEmail(form.email)) {
            const p = document.createElement("p");
            p.innerHTML = "L'E-mail n'est pas conforme";
            p.classList = "errorMessage";
            loginError.appendChild(p);   
        }  else {
            const p = document.createElement("p");
            p.innerHTML = "Le mot de passe n'est pas conforme";
            p.classList = "errorMessage";
            loginError.appendChild(p);   
        }
    }
});

function validateEmail(email) {
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    if (emailRegExp.test(email)) {
        return true;
    } else {
        return false;
    }
}

function validatePassword(password) {
    let passwordRegExp =new RegExp("[a-z0-9A-Z]+.{5,}");
    if (passwordRegExp.test(password)) {
        return true;
    } else {
        return false;
    }
}