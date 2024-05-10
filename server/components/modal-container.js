import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "modal-container";
export const PATH = "/modal-container";

export const router = express.Router();

// Custom close icon was taken from Icons8: https://icons8.com/icon/8112/close

router.get("/", async (req, res) => {
    const body = `
    <modal-container id="default-modal-container"
        content:replace:class="w-11/12=w-4/6 bg-white=bg-sky-200"
        content:add:class="text-slate-600">
        <span class="italic text-lg mx-4">Some custom content...</span>
    </modal-container>

    <modal-container 
        id="info-modal-1"
        title:class="bg-slate-200 italic text-2xl p-2 rounded-t"
        close:add:class="text-slate-600"
        with-left-right-buttons="false"
        hide-on-outside-click="true"
        title="Info Modal 1">
        <div class="p-2 pb-8">Some information...</div>
    </modal-container>

    <modal-container
        id="info-modal-2"
        container:class="bg-black/90"
        content:class="bg-amber-300 border-4 border-amber-400 rounded-lg m-auto mt-[5vh] p-8 w-3/5 relative"
        close-icon="<img class='w-10 h-10' src='/assets/close-icon.png' alt='Close'>"
        close:class="cursor-pointer p-2"
        with-left-right-buttons="false"
        hide-on-outside-click="true"
        title="Info Modal 2"
        title:class="italic text-3xl font-bold">
        <div class="text-xl italic py-8">Custom message</div>
    </modal-container>

    <modal-container 
        id="error-modal" 
        title:add:class="text-red-500"
        with-left-right-buttons="false">
        <div class="px-4 pb-16">Some error information...</div>
    </modal-container>

    <modal-container
        id="confirmation-modal"
        title="Dangerous Delete Action"
        left-button-text="No"
        right-button-text="Yes"
        with-close="false">
        <div class="text-lg italic px-4"></div>
    </modal-container>

    <modal-container 
        id="input-modal-1"
        title="Some Food Item" 
        left-button-text="Cancel" right-button-text="Add" 
        left-right-buttons-container:class="mt-8 pb-4 px-4"
        left-button:class="bg-slate-100 py-2 text-center min-w-24 w-2/5 text-lg cursor-pointer rounded"
        right-button:class="bg-slate-100 py-2 text-center min-w-24 w-2/5 text-lg cursor-pointer rounded"
        hx-post="${PATH}/food-items" 
        hx-trigger="add-food-item-trigger"
        hx-include="this"
        hx-target="#input-modal-1-result">
      <input-with-error 
        container:class="mt-4 mx-4"
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
        container:class="mt-4 mx-4"
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

    <modal-container id="input-modal-2" title="Some Pet">
     <div class="mx-4">
        <drop-down container:add:class="w-full"   
            title:add:class="bg-slate-50 px-2 rounded border-2 rounded"
            options:add:class="bg-white border-b-2 border-x-2 rounded"
            option-0-text="Dog"
            option-1-text="Cat"
            option-2-text="Bear"
            option-3-text="Dinosaur">
        </drop-down>
        </div>
    </modal-container>

    <button class="long-button-like" id="show-default-modal-container">Show Default Modal Container</button>
    <button class="long-button-like" id="show-info-modal-1">Show Info Modal 1</button>
    <button class="long-button-like" id="show-info-modal-2">Show Info Modal 2</button>
    <button class="long-button-like" id="show-error-modal">Show Error Modal</button>
    <button class="long-button-like" id="show-confirmation-modal">Show Confirmation Modal</button>
    <button class="long-button-like" id="show-confirmation-modal-using-htmx"
        hx-delete="${PATH}/confirmation-modal"
        hx-confirm="Are you sure about deleting this test entity using HTMX?"
        hx-target="#confirmation-modal-result">
        Show Confirmation Modal using HTMX
    </button>
    <button class="long-button-like" id="show-input-modal-1">Show Input Modal 1</button>
    <button class="long-button-like" id="show-input-modal-2">Show Input Modal 2</button>

    <h2 class="text-xl font-bold mt-16">Confirmation Modal Result:</h2>
    <div id="confirmation-modal-result"></div>
    
    <h2 class="text-xl font-bold mt-8">Input Modal 1 Result:</h2>
    <div id="input-modal-1-result"></div>
    
    <h2 class="text-xl font-bold mt-8">Input Modal 2 Result:</h2>
    <div id="input-modal-2-result"></div>
    `;

    const script = await Web.assetsFileContent("modal-container-page.js");

    Web.returnHtml(res, Web.htmlPage(body, NAME, script, ["input-error", "input-with-error", "drop-down"]));
});

router.delete(`/confirmation-modal`, (req, res) => {
    Web.returnText(res, `HTMX Confirmed: ${new Date().toISOString()}`);
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
        Web.returnText(res, `Food item with ${kcals} kcals and ${protein} protein`, 201);
    } else {
        Web.returnJson(res, { kcals: kcalsError, protein: proteinError }, 400);
    }
});
