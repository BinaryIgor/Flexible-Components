const fadeInClass = "fade-in";
const fadeOutClass = "fade-out";
const fadeOutDelay = 500;
const fadeInLongClass = "fade-in-long";
const fadeOutLongClass = "fade-out-long";
const fadeOutLongDelay = 1500;

function setupDefaultModalContainer() {
    const defaultModalContainer = document.getElementById("default-modal-container");
    document.getElementById("show-default-modal-container")
        .onclick = () => defaultModalContainer.show();
}

function setupInfoModal1() {
    const showInfoModal1 = document.getElementById("show-info-modal-1");
    const infoModal1 = document.getElementById("info-modal-1");

    showInfoModal1.onclick = () => {
        infoModal1.show();
        infoModal1.classList.add(fadeInClass);
    };

    infoModal1.hideDelay = fadeOutDelay;
    infoModal1.beforeHideListener = () => {
        infoModal1.classList.add(fadeOutClass);
    };
    infoModal1.afterHideListener = () => {
        infoModal1.classList.remove(fadeOutClass);
        infoModal1.classList.remove(fadeInClass);
    };
}

function setupInfoModal2() {
    const showInfoModal2 = document.getElementById("show-info-modal-2");
    const infoModal2 = document.getElementById("info-modal-2");

    showInfoModal2.onclick = () => {
        infoModal2.show();
        infoModal2.classList.add(fadeInLongClass);
    };

    infoModal2.hideDelay = fadeOutLongDelay;
    infoModal2.beforeHideListener = () => {
        infoModal2.classList.add(fadeOutLongClass);
    };
    infoModal2.afterHideListener = () => {
        infoModal2.classList.remove(fadeOutLongClass);
        infoModal2.classList.remove(fadeInLongClass);
    };
}

function setupErrorModal() {
    const showErrorModal = document.getElementById("show-error-modal");
    const errorModal = document.getElementById("error-modal");
    const errorModalMessage = errorModal.querySelector("div");

    showErrorModal.onclick = () => {
        errorModal.setAttribute("title", "Something went wrong...");
        errorModalMessage.textContent = `Some error occurred: ${new Date().toISOString()}`;
        errorModal.show();
    };
}

function setupConfirmationModal() {
    const showConfirmationModal = document.getElementById("show-confirmation-modal");
    const showConfirmationModalUsingHtmx = document.getElementById("show-confirmation-modal-using-htmx");
    const confirmationModal = document.getElementById("confirmation-modal");
    const confirmationModalMessage = confirmationModal.querySelector("div");

    const confirmationModalResult = document.getElementById("confirmation-modal-result");

    showConfirmationModal.onclick = () => {
        confirmationModal.onLeft = () => {
            confirmationModal.hide();
            confirmationModalResult.textContent = `Not confirmed at ${new Date().toISOString()}`;
        };
        confirmationModal.onRight = () => {
            confirmationModal.hide();
            confirmationModalResult.textContent = `Confirmed at ${new Date().toISOString()}`;
        };

        confirmationModalMessage.textContent = "Are you sure?";
        confirmationModal.show();
    };

    showConfirmationModalUsingHtmx.addEventListener("htmx:confirm", e => {
        // do not issue htmx request
        e.preventDefault();

        confirmationModal.onLeft = () => {
            confirmationModal.hide();
            confirmationModalResult.textContent = `HTMX not confirmed at ${new Date().toISOString()}`;
        };

        confirmationModalMessage.textContent = e.detail.question;
        confirmationModal.show();

        confirmationModal.onRight = () => {
            e.detail.issueRequest(e);
            confirmationModal.hide();
        };
    });
}

function setupInputModal1() {
    const showInputModal1 = document.getElementById("show-input-modal-1");
    const inputModal1 = document.getElementById("input-modal-1");
    const [kcalsInput, proteinInput] = inputModal1.querySelectorAll("input-with-error");

    let addFoodItemClicked = false;

    inputModal1.onRight = () => {
        addFoodItemClicked = true;
        inputModal1.dispatchEvent(new Event("add-food-item-trigger"));
    };

    showInputModal1.onclick = () => {
        kcalsInput.clear();
        proteinInput.clear();
        inputModal1.show();
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

    inputModal2Dropdown.addEventListener("drop-down-option-chosen", e => {
        inputModal2ChosenOption = e.detail.text;
        inputModal2Dropdown.setAttribute("title", inputModal2ChosenOption);
    });

    showInputModal2.onclick = () => {
        inputModal2ChosenOption = null;
        inputModal2Dropdown.setAttribute("title", "Choose something...");
        inputModal2.show();
    }

    inputModal2.onRight = () => {
        if (inputModal2ChosenOption) {
            inputModal2.hide();
            inputModal2Result.textContent = "Last chosen option: " + inputModal2ChosenOption;
        }
    };
}

setupDefaultModalContainer();

setupInfoModal1();
setupInfoModal2();

setupErrorModal();

setupConfirmationModal();

setupInputModal1();
setupInputModal2();