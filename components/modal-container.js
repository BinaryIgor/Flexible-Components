import { Components } from "./base.js";

// Chrome black border
const dialogClassDefault = "backdrop:bg-black/50 outline-none focus-none rounded-md max-w-lg w-11/12";
const titleClassDefault = "text-2xl font-bold p-2";
const closeClass = "absolute top-0 right-0";
const closeClassDefault = "cursor-pointer text-3xl px-2";
const leftRightButtonsContainerClassDefault = "mt-2";
const leftButtonClassDefault = "cursor-pointer text-lg pl-2 pr-4 py-2";
const rightButtonClassDefault = "cursor-pointer text-lg pl-4 pr-2 py-2";

const HIDDEN_EVENT = "modal-container-hidden";

const TITLE_ATTRIBUTE = "title";

class ModalContainer extends HTMLElement {

    static observedAttributes = [TITLE_ATTRIBUTE];

    connectedCallback() {
        this._render();

        if (!this.onLeft) {
            this.onLeft = () => this.hide();
        }
        if (!this.onRight) {
            this.onRight = () => { };
        }

        const hideOnOutsideClick = Components.attributeBooleanValueOrDefault(this, "hide-on-outside-click", false);
        if (hideOnOutsideClick) {
            this._dialog.addEventListener("click", this.hide);
        }
    }

    _render() {
        const titleToRender = Components.attributeValueOrDefault(this, TITLE_ATTRIBUTE, "Default Title");

        const dialogAttributes = Components.mappedAttributesAsObject(this, "dialog", {
            defaultClass: dialogClassDefault
        });

        const titleAttributes = Components.mappedAttributesAsObject(this, "title", { defaultClass: titleClassDefault });

        const closeIcon = Components.attributeValueOrDefault(this, "close-icon", "&times;");
        const closeAttributes = Components.mappedAttributesAsObject(this, "close", {
            toAddClass: closeClass,
            defaultClass: closeClassDefault,
            toSkipAttributes: ["icon"]
        });

        const dialog = Components.createElementWithAttributes("dialog", dialogAttributes);

        const close = Components.createElementWithAttributes("span", closeAttributes);
        close.innerHTML = closeIcon;

        const titleEl = Components.createElementWithAttributes("div", titleAttributes);
        titleEl.textContent = titleToRender;

        dialog.append(close, titleEl);
        dialog.append(...this.children);

        const hideLeftRightContainer = Components.attributeBooleanValueOrDefault(this, "hide-left-right-container", "false");
        if (!hideLeftRightContainer) {
            dialog.append(this._leftRightContainer());
        }

        this._dialog = dialog;
        this._title = titleEl;
        this._close = close;

        this.append(dialog);

        this.show = () => {
            this._dialog.showModal();
        };

        this.hide = e => {
            if (e == undefined || e.target == this._dialog) {
                this._dialog.close();
                window.dispatchEvent(new CustomEvent(HIDDEN_EVENT, { detail: { id: this.id } }));
            }
        };

        this._close.onclick = () => {
            this._dialog.close();
            window.dispatchEvent(new CustomEvent(HIDDEN_EVENT, { detail: { id: this.id } }));
        };
    }

    _leftRightContainer() {
        const leftToRender = Components.attributeValueOrDefault(this, "left-text", "Cancel");
        const rightToRender = Components.attributeValueOrDefault(this, "right-text", "Ok");

        const leftRightContainerAttributes = Components.mappedAttributesAsObject(this, "left-right-container", {
            defaultClass: leftRightButtonsContainerClassDefault
        });

        const leftAttributes = Components.mappedAttributesAsObject(this, "left", {
            defaultClass: leftButtonClassDefault
        });
        const rightAttributes = Components.mappedAttributesAsObject(this, "right", {
            defaultClass: rightButtonClassDefault
        });

        const leftRightContainer = Components.createElementWithAttributes("div", leftRightContainerAttributes);
        leftRightContainer.style = "display: flex; justify-content: space-between";

        const leftEl = Components.createElementWithAttributes("div", leftAttributes);
        leftEl.textContent = leftToRender;

        const rightEl = Components.createElementWithAttributes("div", rightAttributes);
        rightEl.textContent = rightToRender;

        const hideLeftContainer = Components.attributeBooleanValueOrDefault(this, "hide-left-container", "false");
        const hideRightContainer = Components.attributeBooleanValueOrDefault(this, "hide-right-container", "false");

        if (!hideLeftContainer) {
            leftRightContainer.append(leftEl);
            this._left = leftEl;
            this._left.onclick = () => this.onLeft();
        }
        if (!hideRightContainer) {
            leftRightContainer.append(rightEl);
            this._right = rightEl;
            this._right.onclick = () => this.onRight();
        }

        return leftRightContainer;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._dialog) {
            return;
        }
        if (name == TITLE_ATTRIBUTE) {
            this._title.textContent = newValue;
        }
    }

    disconnectedCallback() {
        // window.removeEventListener(SHOW_EVENT, this._showOnEvent);
    }
}

customElements.define("modal-container", ModalContainer);