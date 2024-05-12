import { Components } from "./base.js";

const inputClassDefault = "rounded p-2 border-2 border-solid border-slate-100 focus:border-slate-300 outline-none";

//Dependencies: registered input-error
export class InputWithError extends HTMLElement {

    connectedCallback() {
        const containerAttributes = Components.mappedAttributes(this, "container");
        const inputAttributes = Components.mappedAttributes(this, "input", {
            defaultClass: inputClassDefault
        });
        const inputErrorAttributes = Components.mappedAttributes(this, "input-error");
        const errorAttributes = Components.mappedAttributes(this, "error");

        this.innerHTML = `
        <div ${containerAttributes}>
            <input ${inputAttributes}></input>
            <input-error ${inputErrorAttributes} ${errorAttributes}></input-error>
        </div>
        `;

        this._input = this.querySelector("input");
        this._inputError = this.querySelector("input-error");

        this.onInputValidated = (error) => {
            this._inputError.setAttribute("message", error);
        };

        this.onInputChanged = (input) => {
            if (this.inputValidator) {
                const error = this.inputValidator(input);
                this.onInputValidated(error);
            }
        };

        this._input.addEventListener("input", e => {
            this.onInputChanged(this._input.value);
        });
    }

    clear() {
        this._input.value = "";
        this._inputError = this.querySelector("input-error");
        this._inputError.setAttribute("message", "");
    }
}

customElements.define("input-with-error", InputWithError);
