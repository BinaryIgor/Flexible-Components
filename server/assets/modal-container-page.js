const fadeInClass = "fade-in";
const fadeOutClass = "fade-out";
const fadeOutDelay = 500;
const fadeInLongClass = "fade-in-long";
const fadeOutLongClass = "fade-out-long";
const fadeOutLongDelay = 1500;

function setupDefaultModalContainer() {
    const defaultModalContainer = document.getElementById("default-modal-container");
    document.getElementById("show-default-modal-container").onclick = () => defaultModalContainer.show();
}

function setupFadeInOutModal({ modal, showModal, modalHideDelay, fadeInClass, fadeOutClass }) {
    modal.hideDelay = modalHideDelay;
    modal.beforeHideListener = () => modal.classList.add(fadeOutClass);
    modal.afterHideListener = () => {
        modal.classList.remove(fadeOutClass);
        modal.classList.remove(fadeInClass);
    };
    showModal.onclick = () => {
        modal.show();
        modal.classList.add(fadeInClass);
    };
}

function setupInfoModal1() {
    const showInfoModal1 = document.getElementById("show-info-modal-1");
    const infoModal1 = document.getElementById("info-modal-1");

    setupFadeInOutModal({
        modal: infoModal1,
        showModal: showInfoModal1,
        modalHideDelay: fadeOutDelay,
        fadeInClass: fadeInClass,
        fadeOutClass: fadeOutClass
    });
}

function setupInfoModal2() {
    const showInfoModal2 = document.getElementById("show-info-modal-2");
    const infoModal2 = document.getElementById("info-modal-2");

    setupFadeInOutModal({
        modal: infoModal2,
        showModal: showInfoModal2,
        modalHideDelay: fadeOutLongDelay,
        fadeInClass: fadeInLongClass,
        fadeOutClass: fadeOutLongClass
    });
}

function setupErrorModal() {
    const showErrorModal = document.getElementById("show-error-modal");
    const errorModal = document.getElementById("error-modal");
    const errorModalMessage = errorModal.querySelector("div");

    showErrorModal.onclick = () => {
        errorModal.setAttribute("title", "Something went wrong...");
        errorModalMessage.textContent = `Some error occurred at ${new Date().toISOString()}`;
        errorModal.show();
    };
}

function setupConfirmationModal() {
    const showConfirmationModal = document.getElementById("show-confirmation-modal");
    const showConfirmationModalUsingHtmx = document.getElementById("show-confirmation-modal-using-htmx");
    const confirmationModal = document.getElementById("confirmation-modal");
    const confirmationModalMessage = confirmationModal.querySelector("div");

    const confirmationModalResult = document.getElementById("confirmation-modal-result");

    confirmationModal.onLeft = () => {
        confirmationModal.hide();
        confirmationModalResult.textContent = "Not Confirmed: " + new Date().toISOString();
    };

    showConfirmationModal.onclick = () => {
        confirmationModalMessage.textContent = "Are you sure?";
        confirmationModal.onRight = () => {
            confirmationModalResult.textContent = "Confirmed: " + new Date().toISOString();
            confirmationModal.hide();
        };
        confirmationModal.show();
    };

    showConfirmationModalUsingHtmx.addEventListener("htmx:confirm", e => {
        console.log("Let's confirm htmx request..", e);

        // do not issue htmx request
        e.preventDefault();

        confirmationModalMessage.textContent = e.detail.question;

        confirmationModal.onRight = () => {
            e.detail.issueRequest(e);
            confirmationModal.hide();
        };

        confirmationModal.show();
    });
}

function setupInputModal1() {
    const showInputModal1 = document.getElementById("show-input-modal-1");
    const inputModal1 = document.getElementById("input-modal-1");
    const [kcalsInput, proteinInput] = inputModal1.querySelectorAll("input-with-error");

    let addFoodItemClicked = false;

    showInputModal1.onclick = () => {
        addFoodItemClicked = false;
        kcalsInput.clear();
        proteinInput.clear();
        inputModal1.show();
    };

    inputModal1.onRight = () => {
        addFoodItemClicked = true;
        inputModal1.dispatchEvent(new Event("add-food-item-trigger"));
    };

    inputModal1.afterHideListener = () => {
        console.log("Input modal container was hidden!");
    };

    inputModal1.addEventListener("htmx:afterRequest", e => {
        if (e.detail.failed) {
            const response = JSON.parse(e.detail.xhr.response);
            const { kcals: kcalsError, protein: proteinError } = response;
            kcalsInput.onInputValidated(kcalsError);
            proteinInput.onInputValidated(proteinError);
        } else if (addFoodItemClicked) {
            inputModal1.hide();
        }
        addFoodItemClicked = false;
    });
}

function setupInputModal2() {
    const showInputModal2 = document.getElementById("show-input-modal-2");
    const inputModal2 = document.getElementById("input-modal-2");
    const inputModal2Dropdown = inputModal2.querySelector("drop-down");

    const inputModal2Result = document.getElementById("input-modal-2-result");

    let inputModal2ChosenOption = null;

    showInputModal2.onclick = () => {
        inputModal2ChosenOption = null;
        inputModal2Dropdown.setAttribute("title", "Choose something...");
        inputModal2.show();
    };

    inputModal2.onRight = () => {
        if (inputModal2ChosenOption) {
            inputModal2.hide();
            inputModal2Result.textContent = `${inputModal2ChosenOption.text} was the last chosen option`;
        }
    };

    inputModal2Dropdown.addEventListener("drop-down-option-chosen", e => {
        console.log("Option choosen...", e);
        inputModal2ChosenOption = e.detail;
        inputModal2Dropdown.setAttribute("title", e.detail.text);
    });
}

setupDefaultModalContainer();

setupInfoModal1();
setupInfoModal2();

setupErrorModal();

setupConfirmationModal();

setupInputModal1();
setupInputModal2();