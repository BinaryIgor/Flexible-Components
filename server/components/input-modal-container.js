import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "input-modal-container";
export const PATH = "/input-modal-container";

export const router = express.Router();

router.get("/", (req, res) => {
    const body = `
    <input-modal-container title="Some Food Item" ok-text="Ok" 
        hx-post="${PATH}/food-items" hx-trigger="add-food-item-trigger" hx-include="this">
      <input-with-error 
        container:class="mx-4"
        input:type="text"
        input:name="kcals"
        input:placeholder="Input some calories..."
        input:hx-post="${PATH}/food-items/validate-kcals"
        input:hx-trigger="input changed delay:500ms"
        input:hx-swap="outerHTML"
        input:hx-target="next input-error">
      </input-with-error>
      <input-with-error 
        container:class="mx-4 mt-4"
        input:type="text"
        input:name="protein"
        input:placeholder="Input some protein..."
        input:hx-post="${PATH}/food-items/validate-protein"
        input:hx-trigger="input changed delay:500ms"
        input:hx-swap="outerHTML"
        input:hx-target="next input-error">
        </input-with-error>
    </input-modal-container>

    <button id="show-input-modal">Show input modal</button>

    <div id="delete-result" class="text-xl font-bold mt-8 text-red-400"></div>
    `;

    const script = `
        const showInputModalButton = document.getElementById("show-input-modal");
        const inputModal = document.querySelector("input-modal-container");

        const [ kcalsInput, proteinInput] = document.querySelectorAll("input-with-error");

        console.log(kcalsInput, proteinInput);

        showInputModalButton.onclick = () => {
            inputModal.onOk = () => {
                console.log("Ok clicked!");
                // inputModal.hide();
                document.dispatchEvent(new Event("add-food-item-trigger"));
                inputModal.dispatchEvent(new Event("add-food-item-trigger"));
            };
            inputModal.show();
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

    Web.returnHtml(res, Web.htmlPage(body, NAME, script, ["input-error", "input-with-error"]));
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