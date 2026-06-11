document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       REDIRECTION SI DÉJÀ CONNECTÉ ADMIN
    ========================= */
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.role === "admin") {
        window.location.href = "dashboard.html";
        return;
    }

    /* =========================
       CHARGEMENT JSON
    ========================= */
    try {
        const response = await fetch("users.json");
        const data = await response.json();

        if (!localStorage.getItem("users")) {
            localStorage.setItem("users", JSON.stringify(data.users));
        }
    } catch (error) {
        console.log("Erreur JSON :", error);
    }

    /* =========================
       ELEMENTS
    ========================= */
    const loginCard = document.querySelector(".card");
    const registerCard = document.querySelector(".card-I");
    const createAccountBtn = document.querySelector(".create-account");
    const backLoginBtn = document.querySelector(".back-login");

    /* =========================
       BASCULE CONNEXION INSCRIPTION
    ========================= */
    createAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginCard.classList.add("hidden");
        registerCard.classList.remove("hidden");
    });

    backLoginBtn.addEventListener("click", () => {
        registerCard.classList.add("hidden");
        loginCard.classList.remove("hidden");
    });

    /* =========================
       CLIENT / ADMIN
    ========================= */
    const roles = document.querySelectorAll(".role-item");
    let selectedRole = "client"; // par défaut

    roles.forEach((role, index) => {
        role.addEventListener("click", () => {
            roles.forEach(item => item.classList.remove("active"));
            role.classList.add("active");
            selectedRole = index === 0 ? "client" : "admin";
        });
    });

    /* =========================
       AFFICHER / MASQUER MOT DE PASSE
    ========================= */
    const eyeIcons = document.querySelectorAll(".eye-icon");

    eyeIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    /* =========================
       INSCRIPTION
    ========================= */
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const emailExists = users.some(user => user.email === email);

        if (emailExists) {
            alert("Cet email existe déjà.");
            return;
        }

        const newUser = {
            fullname,
            phone,
            email,
            password,
            role: "client"
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Compte créé avec succès !");
        registerForm.reset();
        registerCard.classList.add("hidden");
        loginCard.classList.remove("hidden");
    });

    /* =========================
       CONNEXION
    ========================= */
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert("Email ou mot de passe incorrect.");
            return;
        }

        // Vérif si le rôle sélectionné correspond au rôle du user
        if (user.role !== selectedRole) {
            alert(`Ce compte est un compte ${user.role.toUpperCase()}. Sélectionnez le bon rôle.`);
            return;
        }

        // Stocke l'utilisateur connecté
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert(`Bienvenue ${user.fullname}`);

        // REDIRECTION : ADMIN VA SUR DASHBOARD.HTML
        if (user.role === "admin") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "zirk.html";
        }
    });

});