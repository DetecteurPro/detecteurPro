// Formulaire contact AVEC ENVOI MAIL + auto-reply utilisateur
const form = document.getElementById('contactForm');

form.addEventListener('submit', function(e){
    e.preventDefault();

    const alertBox = document.getElementById('alertContact');

    const nom = form.querySelector('input[placeholder="Nom"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    if(!nom || !email || !message){
        alertBox.classList.remove('d-none');
        alertBox.classList.remove('alert-success');
        alertBox.classList.add('alert-danger');
        alertBox.textContent = "❌ Veuillez remplir tous les champs.";
        return;
    }

    // 1️⃣ Mail pour toi
    emailjs.send("service_syscl6j", "template_3cyir4h", {
        nom: nom,
        email: email,
        message: message
    })
    .then(() => {
        // 2️⃣ Auto-reply pour l'utilisateur
        emailjs.send("service_syscl6j", "template_6ah87yj", {
            nom: nom,
            email: email
        })
        .then(() => {
            alertBox.classList.remove('d-none');
            alertBox.classList.remove('alert-danger');
            alertBox.classList.add('alert-success');
            alertBox.textContent = "✅ Message envoyé et réponse automatique envoyée !";
            form.reset();
        })
        .catch(err => {
            console.error("Erreur auto-reply :", err);
            alertBox.classList.remove('d-none');
            alertBox.classList.remove('alert-success');
            alertBox.classList.add('alert-danger');
            alertBox.textContent = "⚠️ Message envoyé, mais erreur auto-reply.";
        });
    })
    .catch(err => {
        console.error("Erreur envoi message :", err);
        alertBox.classList.remove('d-none');
        alertBox.classList.remove('alert-success');
        alertBox.classList.add('alert-danger');
        alertBox.textContent = "❌ Erreur lors de l'envoi du message.";
    });
});