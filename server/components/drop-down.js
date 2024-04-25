import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "drop-down";
export const PATH = "/drop-down";

export const router = express.Router();

router.get("/", (req, res) => {
    const body = `
        <drop-down title="Some Custom Title"
            id="drop-down"
            option-0-text="A"
            option-0:data-id="A-1"
            option-0:hx-get="${PATH}/option-0"
            option-0:hx-push-url="true"
            option-0:hx-target="#drop-down"
            option-1-text="B"
            option-1:data-id="B-1">
        </drop-down>
    `;

    const script = `
        console.log("Some script...");

        const dropdown = document.querySelector("drop-down");

        dropdown.addEventListener("drop-down-option-chosen", e => {
            console.log("Option chosen...", e.detail);
            // dropdown.hideOptions();
        });
    `;

    Web.returnHtml(res, Web.htmlPage(body, NAME, Web.scopedScript(script)));
});

router.get("/option-0", (req, res) => {
    Web.returnText(res, "Option 0 Page");
});