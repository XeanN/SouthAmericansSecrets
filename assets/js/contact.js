document.addEventListener("DOMContentLoaded", () => {

  // Inicializa EmailJS
  emailjs.init("4zsaDURdbgabCbDU0"); // tu Public Key

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const subject = form.title.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please complete all required fields.");
      return;
    }

    // Enviar email con EmailJS
    emailjs.sendForm("service_vbzfuuu", "template_3d5iovd", form)
      .then(() => {
        alert("✅ Your message has been sent successfully!");
        form.reset();

        // Enviar también a WhatsApp
        const text = `📩 *Contact Form*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📱 *Phone:* ${phone}\n📌 *Subject:* ${subject}\n📝 *Message:* ${message}`;
        const phoneNumber = "51956481002";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        alert("There was an error sending your message. Please try again later.");
      });
  });
});
