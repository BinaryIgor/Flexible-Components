import { Components } from "./base.js";

export class InputError extends HTMLElement {

    static errorClassDefault = "text-red-500";

    static observedAttributes = ["message"];

    connectedCallback() {
        const message = Components.attributeValueOrDefault(this, "message");
        this._render(message);
    }

    _render(message) {
        const errorAttributes = Components.mappedAttributes(this, "error", { defaultClass: InputError.errorClassDefault });
        this.innerHTML = `<p ${message ? `` : `style="display: none"`} ${errorAttributes}>${message}</p>`;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._render(newValue);
    }
}
customElements.define("input-error", InputError);