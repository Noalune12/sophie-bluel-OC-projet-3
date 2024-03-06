const loginForm = document.querySelector(".loginForm") 
const loginError = document.querySelector(".loginError")

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    loginError.innerHTML ="";
    let form = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
    const chargeUtile = JSON.stringify(form);
    if (validerEmail(form.email) && validerPassword(form.password)) {
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        }).then((response) => {
            if (response.status !== 200) {
                const p = document.createElement("p");
                p.innerHTML = "Email ou mot de passe incorrect";
                p.classList = "errorMessage"
                loginError.appendChild(p); 
            } else {
                response.json().then((data) => {
                    sessionStorage.setItem("token", data.token);
                    console.log(data.token);
                    alert("Vous êtes connecté")
                    window.location.href = "index.html";
                })
            }
    })
    } else {
        if (!validerEmail(form.email)) {
            const p = document.createElement("p");
            p.innerHTML = "L'E-mail n'est pas conforme";
            p.classList = "errorMessage"
            loginError.appendChild(p);   
        }  else {
            const p = document.createElement("p");
            p.innerHTML = "Le mot de passe n'est pas conforme";
            p.classList = "errorMessage"
            loginError.appendChild(p);   
        }
    }
})

function validerEmail(email) {
    let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
    if (emailRegExp.test(email)) {
        return true
    } else {
        return false
    }
}

function validerPassword(password) {
    let passwordRegExp =new RegExp("[a-z0-9A-Z]+.{5,}");
    if (passwordRegExp.test(password)) {
        return true
    } else {
        return false
    }
}