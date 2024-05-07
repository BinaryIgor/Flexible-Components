import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "modal-container";
export const PATH = "/modal-container";

export const router = express.Router();

router.get("/", (req, res) => {
    const body = `
    <modal-container 
        id="info-modal"
        title:class="bg-slate-200 italic text-2xl p-2"
        close:add:class="text-slate-600"
        hide-left-right-container="true"
        title="Info modal">
        <div class="p-2">Some information...</div>
    </modal-container>

    <modal-container
        id="highly-customized-info-modal"
        dialog:class="backdrop:bg-black/80 bg-amber-300 outline-none focus-none border-solid border-4 border-amber-400 rounded-lg m-auto mt-32 px-4 pt-4 pb-8 w-3/5"
        close-icon="<div class='font-bold'>X</div>"
        close:class="text-2xl p-4 cursor-pointer"
        hide-left-right-container="true"
        title="Custom Title"
        title:add:class="italic">
        <div class="text-lg italic">Custom message</div>
    </modal-container>

    <modal-container 
        id="error-modal" 
        title:add:class="text-red-500"
        hide-left-right-container="true"
        hide-on-outside-click="false">
        <div class="px-2 pb-4">Some error information...</div>
    </modal-container>

    <modal-container
        id="confirmation-modal"
        title="Dangerous, Delete Action"
        left-text="No"
        right-text="Yes">
        <div class="text-lg italic px-2"></div>
    </modal-container>

    <modal-container 
        id="input-modal-container"
        title="Some Food Item" left-text="Cancel" right-text="Add" 
        left-right-container:class="mt-8"
        left:class="bg-slate-100 py-2 text-center min-w-24 w-2/5 text-lg cursor-pointer rounded"
        right:class="bg-slate-100 py-2 text-center min-w-24 w-2/5 text-lg cursor-pointer rounded"
        hx-post="${PATH}/food-items" hx-trigger="add-food-item-trigger" hx-include="this">
      <input-with-error 
        container:class="mt-4 mx-2"
        input:add:class="w-full"
        input:type="text"
        input:name="kcals"
        input:placeholder="Input some calories..."
        input:hx-post="${PATH}/food-items/validate-kcals"
        input:hx-trigger="input changed delay:500ms"
        input:hx-swap="outerHTML"
        input:hx-target="next input-error">
      </input-with-error>
      <input-with-error 
        container:class="mt-4 mx-2"
        input:add:class="w-full"
        input:type="text"
        input:name="protein"
        input:placeholder="Input some protein..."
        input:hx-post="${PATH}/food-items/validate-protein"
        input:hx-trigger="input changed delay:500ms"
        input:hx-swap="outerHTML"
        input:hx-target="next input-error">
      </input-with-error>
    </modal-container>

    <modal-container id="input-modal-2">
        <drop-down container:add:class="px-2 pb-16"
            option-0-text="option-1"
            option-1-text="option-2"
            option-2-text="option-3"
            option-3-text="option-4">
        </drop-down>
    </modal-container>

    <button class="button-like block my-2 w-full max-w-[600px]" id="show-info-modal">Show InfoModal</button>
    <button class="button-like block my-2 w-full max-w-[600px]" id="show-highly-customized-info-modal">Show highly customized InfoModal</button>
    <button class="button-like block my-2 w-full max-w-[600px]" id="show-error-modal">Show ErrorModal</button>
    <button class="button-like block my-2 w-full max-w-[600px]" id="show-confirmation-modal">Show ConfirmationModal</button>
    <button class="button-like block my-2 w-full max-w-[600px]" id="show-confirmation-modal-using-htmx"
        hx-delete="${PATH}/confirmation-modal"
        hx-confirm="Are you sure to delete this test entity?"
        hx-target="#confirmation-modal-result">
        Show ConfirmationModal using HTMX
    </button>
    <button class="button-like block my-2 w-full max-w-[600px]" id="show-input-modal">Show InputModal</button>
    <button class="button-like block my-2 w-full max-w-[600px]" id="show-input-modal-2">Show InputModal 2</button>

    <div id="confirmation-modal-result" class="text-xl font-bold mt-16">Confirmation Modal Result Placeholder</div>

    <div id="input-modal-result" class="text-xl font-bold mt-8">Input Modal Result Placeholder</div>
    `;

    const script = `
        const showInfoModal = document.getElementById("show-info-modal");
        const infoModal = document.getElementById("info-modal");
        const infoModalMessage = infoModal.querySelector("div");

        const showHighlyCustomizedInfoModal = document.getElementById("show-highly-customized-info-modal");
        const highlyCustomizedInfoModal = document.getElementById("highly-customized-info-modal");

        const showErrorModal = document.getElementById("show-error-modal");
        const errorModal = document.getElementById("error-modal");
        const errorModalMessage = errorModal.querySelector("div");

        const showConfirmationModalButton = document.getElementById("show-confirmation-modal");
        const showConfirmationModalUsingHtmxButton = document.getElementById("show-confirmation-modal-using-htmx");
        const confirmationModal = document.getElementById("confirmation-modal");
        const confirmationModalMessage = confirmationModal.querySelector("div");

        const showInputModalButton = document.getElementById("show-input-modal");
        const inputModal = document.getElementById("input-modal-container");
        const [kcalsInput, proteinInput] = inputModal.querySelectorAll("input-with-error");

        const showInputModal2Button = document.getElementById("show-input-modal-2");
        const inputModal2 = document.getElementById("input-modal-2");

        const confirmationModalResult = document.getElementById("confirmation-modal-result");

        showInfoModal.onclick = () => {
            infoModal.show();
        };

        showHighlyCustomizedInfoModal.onclick = () => {
            highlyCustomizedInfoModal.show();
        };

        showErrorModal.onclick = () => {
            errorModal.setAttribute("title", "Something went wrong...");
            errorModalMessage.textContent = \`Some error occurred at \${Date.now()}\`;
            errorModal.show();
        };

        confirmationModal.onLeft = () => {
            confirmationModal.hide();
            confirmationModalResult.textContent = "Not Confirmed: " + Date.now();
        };

        showConfirmationModalButton.onclick = () => {
            confirmationModalMessage.textContent = "Are you sure?";
            confirmationModal.onRight = () => {
                confirmationModalResult.textContent = "Confirmed: " + Date.now();
                confirmationModal.hide();
            };
            confirmationModal.show();
        };
        showConfirmationModalUsingHtmxButton.addEventListener("htmx:confirm", e => {
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

        inputModal.onRight = () => {
            console.log("Right clicked!");
            // inputModal.hide();
            document.dispatchEvent(new Event("add-food-item-trigger"));
            inputModal.dispatchEvent(new Event("add-food-item-trigger"));
        };

        showInputModalButton.onclick = () => {
            kcalsInput.clear();
            proteinInput.clear();
            inputModal.show();
        };

        showInputModal2Button.onclick = () => {
            inputModal2.show();
        };

        window.addEventListener("input-modal-container-hidden", e => {
            console.log("Input modal container was hidden!");
        });

        inputModal.addEventListener("htmx:afterRequest", e => {
            console.log("Input modal, after request...", e.detail);
            if (e.detail.failed) {
                const response = e.detail.xhr.responseText;
                const [kcalsError, proteinError] = response.split('||');
                console.log("Error response:", kcalsError, proteinError);
                kcalsInput.onInputValidated(kcalsError);
                proteinInput.onInputValidated(proteinError);
            }
        });
    `;

    Web.returnHtml(res, Web.htmlPage(body, NAME, script, ["input-error", "input-with-error", "drop-down"]));
});

router.delete(`/confirmation-modal`, (req, res) => {
    Web.returnText(res, `HTMX Confirmed: ${Date.now()}`);
});

router.post(`/food-items/validate-kcals`, (req, res) => {
    Web.returnHtml(res, `<input-error message="${validateKcals(req.body.kcals)}"></input-error>`);
});

function validateKcals(kcals) {
    return isPositiveNumber(kcals) ? "" : "Kcals need to be a positive number";
}

function isPositiveNumber(number) {
    try {
        return !isNaN(number) && parseInt(number) > 0;
    } catch (e) {
        return false;
    }
}

router.post(`/food-items/validate-protein`, (req, res) => {
    Web.returnHtml(res, `<input-error message="${validatProtein(req.body.protein)}"></input-error>`);
});

function validatProtein(protein) {
    return isPositiveNumber(protein) ? "" : "Protein need to be a positive number";
}

router.post("/food-items", (req, res) => {
    const kcals = req.body.kcals;
    const protein = req.body.protein;

    const kcalsError = validateKcals(kcals);
    const proteinError = validatProtein(protein);
    if (!kcalsError && !proteinError) {
        // TODO: do add food item
        console.log("Adding food item...");
        Web.returnText(res, "OK", 201);
    } else {
        Web.returnText(res,`${kcalsError}||${proteinError}`, 400);
    }
});