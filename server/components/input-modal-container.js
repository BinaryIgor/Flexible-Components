import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "input-modal-container";
export const PATH = "/input-modal-container";

export const router = express.Router();

router.get("/", (req, res) => {
    const body = `
    <input-modal-container title="Calories:" ok-text="Ok">
      <input-with-error 
        container:class="mx-4"
        input:type="text"
        input:name="kcal"
        input:placeholder="Input some calories..."
        input:hx-post="${PATH}/validate-kcal"
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

        showInputModalButton.onclick = () => {
            inputModal.onOk = () => {
                console.log("Ok clicked!");
                inputModal.hide();
            };
            inputModal.show();
        };
    `;

    Web.returnHtml(res, Web.htmlPage(body, NAME, script, ["input-error", "input-with-error"]));
});

router.post(`/validate-kcal`, (req, res) => {
    Web.returnHtml(res, `<input-error message="Kcals are not valid!"></input-error>`);
});
