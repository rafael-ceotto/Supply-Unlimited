document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".toggle-password");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function () {
            const wrapper = this.closest(".password-wrapper");
            const input = wrapper.querySelector("input[type='password'], input[type='text']");

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                this.textContent = "👁️"; // mostra olho aberto
            } else {
                input.type = "password";
                this.textContent = "🙈"; // mostra olho fechado
            }
        });
    });
});
