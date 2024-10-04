import express from "express";
import * as Web from '../shared/web.js';

export const NAME = "experiments";
export const PATH = "/experiments";

export const router = express.Router();

router.get("/", (req, res) => {
    const body = `
    <div id="custom-message-container">
      <custom-message category="Curiosities" message="Some interesting message">
      </custom-message>
    </div>

    <button id="fade-in-out" class="block my-8">Fade in/out</button>

    <div id="to-fade-in-out" class="mt-8" style="display: none">
        Fade me in/out
    </div>
    `;

    const script = `
        const customMessage = document.querySelector("custom-message");
        const customMessageContainer = document.getElementById("custom-message-container");
        
        setTimeout(() => {
            customMessage.setAttribute("category", "Another category");
            customMessage.setAttribute("message", "Another message");
        }, 1000);

        // setTimeout(() => {
        //     customMessageContainer.innerHTML = "Gone";
        // }, 2000);

        const toFadeInOut = document.getElementById("to-fade-in-out");
        let fadeIn = true;

        document.getElementById("fade-in-out").onclick = () => {
            if (fadeIn) {
                toFadeInOut.classList.remove("fade-out");
                toFadeInOut.style = "display: block";
                toFadeInOut.classList.add("fade-in");
            } else {
                toFadeInOut.classList.remove("fade-in");
                toFadeInOut.classList.add("fade-out");
                setTimeout(() => toFadeInOut.style = "display: none", 1000);
            }
            fadeIn = !fadeIn;
        };
    `;

    Web.returnHtml(res, Web.htmlPage(body, NAME, script));
});
