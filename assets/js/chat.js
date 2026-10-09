(() => {
    const widget = document.querySelector("#kai-chat-widget");

    if (!widget || widget.dataset.initialized === "true") {
        return;
    }

    widget.dataset.initialized = "true";

    const panel = widget.querySelector("#kai-chat-panel");
    const toggle = widget.querySelector("#kai-chat-toggle");
    const close = widget.querySelector("#kai-chat-close");
    const form = widget.querySelector("#kai-chat-form");
    const input = widget.querySelector("#kai-chat-input");
    const messages = widget.querySelector("#kai-chat-messages");
    const quickReplies = widget.querySelector(".kai-quick-replies");

    function setOpen(open) {
        panel.classList.toggle("is-open", open);
        panel.setAttribute("aria-hidden", String(!open));
        panel.inert = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
            "aria-label",
            open ? "Fermer la discussion KAI" : "Ouvrir la discussion KAI"
        );

        if (open) {
            input.focus();
        } else {
            toggle.focus();
        }
    }

    function addMessage(text, sender) {
        const bubble = document.createElement("div");
        bubble.className = `kai-message kai-message-${sender}`;

        // textContent évite d'interpréter le message comme du HTML.
        bubble.append(document.createTextNode(text));

        const time = document.createElement("time");
        time.textContent = new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });

        bubble.appendChild(time);
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    function sendMessage(text) {
        const message = text.trim();

        if (!message) return;

        addMessage(message, "user");
        input.value = "";
        input.focus();

        // Réponse de démonstration uniquement.
        window.setTimeout(() => {
            addMessage(
                "Merci pour votre message ! Ceci est une démonstration. " +
                "La connexion réelle à l'équipe KAI sera ajoutée ensuite.",
                "bot"
            );
        }, 700);
    }

    toggle.addEventListener("click", () => {
        setOpen(!panel.classList.contains("is-open"));
    });

    close.addEventListener("click", () => setOpen(false));

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendMessage(input.value);
    });

    quickReplies.addEventListener("click", (event) => {
        const button = event.target.closest("[data-message]");

        if (button) {
            sendMessage(button.dataset.message);
        }
    });

    widget.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            panel.classList.contains("is-open")
        ) {
            setOpen(false);
        }
    });
})();