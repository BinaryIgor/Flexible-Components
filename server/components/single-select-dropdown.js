import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "single-select-dropdown";
export const PATH = "/single-select-dropdown";

export const router = express.Router();

router.get("/", (req, res) => {
    const body = `
        <single-select-dropdown title="Some Custom Title"
            id="single-select-dropdown"
            option-0-text="A"
            option-0:data-id="A-1"
            option-0:hx-get="${PATH}/option-0"
            option-0:hx-push-url="true"
            option-0:hx-target="#single-select-dropdown"
            option-1-text="B"
            option-1:data-id="B-1">
        </single-select-dropdown>
    `;

    const script = `
        console.log("Some script...");

        const dropdown = document.querySelector("single-select-dropdown");

        dropdown.addEventListener("single-select-dropdown-option-chosen", e => {
            console.log("Option chosen...", e.detail);
            // dropdown.hideOptions();
        });
    `;

    Web.returnHtml(res, Web.htmlPage(body, NAME, Web.scopedScript(script)));
});

router.get("/option-0", (req, res) => {
    Web.returnText(res, "Option 0 Page");
});