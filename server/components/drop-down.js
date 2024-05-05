import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "drop-down";
export const PATH = "/drop-down";

export const router = express.Router();

router.get("/", (req, res) => {
    const manyOptions = [];
    for (let i = 0; i < 100; i++) {
        const option = i + 1;
        manyOptions.push(`option-${i}-text="Right Option ${option}"`);
        if (option % 2 == 0) {
            manyOptions.push(`option-${i}:data-id="${i}"`);
        }
    }
    const manyOptionsTexts = manyOptions.join("\n");

    const body = `
        <drop-down title="HTMX & attributes-based Drop-down"
            hide-options-on-outside-click="false"
            hide-options-on-selected="false"
            options-z-index="100"
            id="attributes-drop-down"
            option:add:class="text-2xl"
            option-0-text="A"
            option-0:add:class="font-bold"
            option-0:data-id="A-1"
            option-0:hx-get="${PATH}/option-0"
            option-0:hx-push-url="true"
            option-0:hx-target="#app"
            option-1-text="B"
            option-1:data-id="B-1">
        </drop-down>

        <drop-down title="JS-based Drop-down"
            option:add:class="bg-sky-200 border-sky-100 border-2 rounded-md italic text-slate-600"
            id="js-drop-down">
        </drop-down>

        <div class="text-xl italic font-bold p-8 max-w-[500px]">Some content that should be hidden by the DropDown</div>

        <drop-down id="right-drop-down" 
            title="Right Drop-down with many options" class="absolute top-0 right-0 z-10"
            title:class="font-bold text-xl text-slate-800 p-4"
            option-0:class="bg-slate-300 text-right p-2 text-slate-600"
            ${manyOptionsTexts}>
        </drop-down>
    `;

    const script = `
        const attributesDropdown = document.getElementById("attributes-drop-down");

        attributesDropdown.addEventListener("drop-down-option-chosen", e => {
            console.log("Option chosen for HTMX & attributes dropdown...", e.detail);
            // dropdown.hideOptions();
        });

        const jsDropdown = document.getElementById("js-drop-down");
        
        // On purpose to test out after component initialization property set
        setTimeout(() => {
            console.log("Late set...");

            jsDropdown.setAttribute("option-0:add:class", "text-2xl");

            const options = [
                {
                    title: "Option A",
                    dataId: 22
                },
                {
                    title: "Option B"
                }
            ];
    
            jsDropdown.options = options;
        }, 500);

        jsDropdown.addEventListener("drop-down-option-chosen", e => {
            console.log("Option chosen for js dropdown...", e.detail);
            // dropdown.hideOptions();
        });

        const rightDropdown = document.getElementById("right-drop-down");
        rightDropdown.addEventListener("drop-down-option-chosen", e => {
            console.log("Options chosen for right dropdown...", e.detail);
        });
    `;

    Web.returnHtml(res, Web.htmlPage(body, NAME, Web.scopedScript(script)));
});

router.get("/option-0", (req, res) => {
    Web.returnText(res, "<div>Option 0 Demo Page</div>");
});