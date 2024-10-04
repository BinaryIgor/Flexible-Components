import { Components } from "./base.js";

class FormContainer extends HTMLElement {

    static genericErrorClassDefault = "text-red-600 text-lg italic mt-4 my-2";
    static hiddenClass = "hidden";

    connectedCallback() {
        const formAttributes = Components.mappedAttributesAsObject(this, "form");
        const errorAttributes = Components.mappedAttributesAsObject(this, "generic-error", {
            defaultClass: FormContainer.genericErrorClassDefault,
            toAddClass: FormContainer.hiddenClass
        });
        const submitAttributes = Components.mappedAttributesAsObject(this, "submit", {
            defaultAttributes: {
                value: "Submit"
            }
        });

        const form = document.createElement("form");
        Components.setAttributes(form, formAttributes);

        form.append(...this.children);

        const genericError = document.createElement("p");
        Components.setAttributes(genericError, errorAttributes);

        form.append(genericError);

        const submit = document.createElement("input");
        submit.setAttribute("type", "submit");
        Components.setAttributes(submit, submitAttributes);

        form.append(submit);

        this.append(form);

        this._genericError = genericError;
        this._form = form;
        this._submit = submit;

        this._form.addEventListener("submit", e => {
            this._submit.disabled = true;
        });
    }

    clearInputs() {
        const inputs = [...this.querySelectorAll(`input:not([type="submit"])`)];
        inputs.forEach(i => {
            i.value = "";
        });
    }

    afterSubmit({ error = "", alwaysClearInputs = false, showGenericError = false}) {
        this._submit.disabled = false;

        if (alwaysClearInputs || !error) {
            this.clearInputs();
        }

        if (error && showGenericError) {
            this._genericError.textContent = error;
            this._genericError.classList.remove(FormContainer.hiddenClass);
        } else {
            this._genericError.classList.add(FormContainer.hiddenClass);
        }
    }
}

customElements.define("form-container", FormContainer);