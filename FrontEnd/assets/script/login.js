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
    // console.log(chargeUtile)
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
            alert("Vous êtes connecté")
            window.location.href = "index.html";
        }
})
})