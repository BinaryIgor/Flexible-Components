import path from "path";
import fs from "fs";

const HTMX_SCRIPT = '<script src="https://unpkg.com/htmx.org@1.9.9" integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX" crossorigin="anonymous"></script>';
const CSS_PATH = path.join("dist", "style.css");

export function scopedScript(script) {
    return `(function() { ${script}} )();`;
}

export function htmlPage(body, component, script = "", additionalComponents = []) {
    return `
    <html>
        <head>
            <title>Flexible Web Components: ${component}</title>
            <link href="${CSS_PATH}" rel="stylesheet">
            <script type="module" src="${component}.js"></script>
            ${additionalComponents.map(c => `<script type="module" src="${c}.js"></script>`).join("\n")}
            ${HTMX_SCRIPT}
        </head>
        <body class="m-4" id="app">
            <h1 class="text-3xl font-bold mb-8">Flexible Web Components: ${component}</h1>
            ${body}

            <script>${script}</script>
        </body>
    <html>`;
}

export function returnHtml(res, html, status = 200) {
    res.contentType('text/html');
    res.status(status);
    res.send(html);
}

export function returnText(res, text, status = 200) {
    res.contentType('text/plain');
    res.status(status);
    res.send(text);
}

export function returnJson(res, object, status = 200) {
    res.status(status);
    res.send(object);
}

export function returnTextError(res, error, status = 400) {
    returnText(res, error, status);
}

export function returnJs(res, js) {
    res.contentType("text/javascript");
    res.send(js);
}

export async function assetsFileContent(name) {
    const filePath = path.join("assets", name);
    return await fs.promises.readFile(filePath, 'utf-8');
}

export async function returnFile(res, filePath, contentType = null) {
    const file = await fs.promises.readFile(filePath);
    const resolvedContentType = contentType ? contentType : contentTypeFromFilePath(filePath);
    if (resolvedContentType) {
        res.contentType(resolvedContentType);
    }
    res.send(file);
}

function contentTypeFromFilePath(filePath) {
    if (filePath.endsWith("png")) {
        return "image/png";
    }
    if (filePath.endsWith("jpg") || filePath.endsWith("jpeg")) {
        return "image/jpeg";
    }
    if (filePath.endsWith("svg")) {
        return "image/svg+xml";
    }
    if (filePath.endsWith("css")) {
        return "text/css";
    }
    if (filePath.endsWith("js")) {
        return "text/javascript";
    }
    return null;
}