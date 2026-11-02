
/* Simza's Car Wash - WEDE5020 Part 3 */

document.addEventListener("DOMContentLoaded", function () {

    /* 1. SERVICE SEARCH AND FILTER */

    const searchInput = document.getElementById("serviceSearch");
    const filterSelect = document.getElementById("serviceFilter");
    const serviceCards = document.querySelectorAll("[data-service-card]");
    const resultMessage = document.getElementById("serviceResult");
    const noResults = document.getElementById("noServicesFound");

    function filterServices() {
        if (!searchInput || !filterSelect) {
            return;
        }

        const searchText = searchInput.value.toLowerCase().trim();
        const selectedType = filterSelect.value;
        let visibleCount = 0;

        serviceCards.forEach(function (card) {
            const cardText = card.textContent.toLowerCase();
            const cardType = card.dataset.serviceType;

            const matchesSearch = cardText.includes(searchText);
            const matchesCategory =
                selectedType === "all" || selectedType === cardType;

            const showCard = matchesSearch && matchesCategory;

            card.hidden = !showCard;

            if (showCard) {
                visibleCount++;
            }
        });

        if (resultMessage) {
            resultMessage.textContent =
                "Showing " + visibleCount + " of " +
                serviceCards.length + " services.";
        }

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterServices);
    }

    if (filterSelect) {
        filterSelect.addEventListener("change", filterServices);
    }


    /* 2. FAQ ACCORDION */

    const faqButtons = document.querySelectorAll(".p3-faq-question");

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            const answerId = button.getAttribute("aria-controls");
            const answer = document.getElementById(answerId);

            if (!answer) {
                return;
            }

            const isOpen =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isOpen));
            answer.hidden = isOpen;

            const symbol = button.querySelector("span");

            if (symbol) {
                symbol.textContent = isOpen ? "+" : "−";
            }
        });
    });


    /* 3. SET THE EARLIEST ENQUIRY DATE TO TODAY */

    const dateInput = document.getElementById("enquiryDate");

    if (dateInput) {
        const today = new Date();
        const localDate = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        dateInput.min = localDate;
    }


    /* 4. ENQUIRY FORM VALIDATION */

    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!enquiryForm.checkValidity()) {
                enquiryForm.reportValidity();
                return;
            }

            const status = document.getElementById("enquiryStatus");

            if (status) {
                status.textContent =
                    "Your enquiry details are valid. " +
                    "Please note that this demonstration form does not " +
                    "send or store your enquiry yet.";

                status.className = "p3-status show success";
            }
        });
    }


    /* 5. CONTACT FORM VALIDATION AND EMAIL PREPARATION */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const recipient = contactForm.dataset.recipient;

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const phone = document.getElementById("contactPhone").value.trim();
            const messageType = document.getElementById("messageType").value;
            const message = document.getElementById("contactMessage").value.trim();

            const subject = encodeURIComponent(
                "Simza's Car Wash - " + messageType
            );

            const body = encodeURIComponent(
                "Name: " + name + "\n" +
                "Email: " + email + "\n" +
                "Phone: " + phone + "\n" +
                "Message type: " + messageType + "\n\n" +
                "Message:\n" + message
            );

            const status = document.getElementById("contactStatus");

            if (!recipient || recipient === "YOUR-EMAIL-ADDRESS") {
                if (status) {
                    status.textContent =
                        "Please configure the business email address first.";
                    status.className = "p3-status show error";
                }
                return;
            }

            if (status) {
                status.textContent =
                    "Your message is ready. Your email application " +
                    "will open so you can send it.";
                status.className = "p3-status show success";
            }

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + subject +
                "&body=" + body;
        });
    }


    /* 6. IMAGE LIGHTBOX */

    const lightboxImages = document.querySelectorAll("img[data-lightbox]");

    if (lightboxImages.length > 0) {

        const lightbox = document.createElement("div");

        lightbox.id = "p3-lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Enlarged image");

        const enlargedImage = document.createElement("img");
        enlargedImage.alt = "";

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.textContent = "Close";
        closeButton.setAttribute("aria-label", "Close enlarged image");

        lightbox.appendChild(enlargedImage);
        lightbox.appendChild(closeButton);
        document.body.appendChild(lightbox);

        function closeLightbox() {
            lightbox.hidden = true;
            enlargedImage.src = "";
        }

        lightboxImages.forEach(function (img) {

            img.style.cursor = "zoom-in";
            img.setAttribute("tabindex", "0");

            img.addEventListener("click", function () {
                enlargedImage.src = img.src;
                enlargedImage.alt = img.alt || "Enlarged image";
                lightbox.hidden = false;
                closeButton.focus();
            });

            img.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    img.click();
                }
            });
        });

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeLightbox();
            }
        });
    }

});


