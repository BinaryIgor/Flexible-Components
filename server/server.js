import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import path from "path";

import * as Web from "./shared/web.js";
import * as InputWithErrorComponent from './components/input-with-error.js';
import * as FormContainerComponent from './components/form-container.js';
import * as ModalContainerComponent from './components/modal-container.js';
import * as ExperimentsComponent from './components/experiments.js';
import * as DropDown from './components/drop-down.js';

const SERVER_PORT = process.env.SERVER_PORT || 8080;
const CSS_PATH = path.join("dist", "style.css");
const COMPONENTS_DIR = '../components';

const components = fs.readdirSync(COMPONENTS_DIR);

const availableComponentsPaths = [
    InputWithErrorComponent.PATH, FormContainerComponent.PATH, ModalContainerComponent.PATH,
    DropDown.PATH,
    ExperimentsComponent.PATH];

console.log();
console.log("Available components: ");
availableComponentsPaths.forEach(p => {
    console.log(`* http://localhost:${SERVER_PORT}${p}`);
});
console.log();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(InputWithErrorComponent.PATH, InputWithErrorComponent.router);
app.use(FormContainerComponent.PATH, FormContainerComponent.router);
app.use(ModalContainerComponent.PATH, ModalContainerComponent.router);
app.use(DropDown.PATH, DropDown.router);
app.use(ExperimentsComponent.PATH, ExperimentsComponent.router);

app.get("*", async (req, res) => {
    try {
        if (req.url.includes(".css")) {
            Web.returnCss(res, await staticFileContentOfPath(CSS_PATH));
        } else if (req.url.includes(".js")) {
            const componentFile = components.find(c => req.url.endsWith(c));
            if (componentFile) {
                returnComponent(res, componentFile);
            } else {
                Web.returnHtml(res, "<p>Unsupported path</p>", 404);
            }
        } else {
            Web.returnHtml(res, "<p>Unsupported path</p>", 404);
        }
    } catch (e) {
        console.error("Failed to process path:", e);
        Web.returnHtml(res, "<p>Internal Error</p>", 500);
    }
});

function staticFileContentOfPath(path) {
    return fs.promises.readFile(path, 'utf-8');
}

async function returnComponent(res, filename) {
    const content = await staticFileContentOfPath(path.join(COMPONENTS_DIR, filename));
    Web.returnJs(res, content);
}

app.listen(SERVER_PORT, () => {
    console.log(`Server has started on port ${SERVER_PORT}!`);
});