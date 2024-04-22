import { Components } from "./base.js";

const containerClass = "fixed z-10 left-0 top-0 w-full h-full overflow-auto";
const containerClassDefault = "bg-black/50";
const contentClassDefault = "m-auto mt-16 p-2 w-4/5 md:w-3/5 lg:w-2/5 bg-white rounded";
const titleClassDefault = "text-2xl font-bold mb-2 px-4 pt-4";
const closeClass = "absolute top-0 right-0";
const closeClassDefault = "cursor-pointer text-3xl px-2";
const cancelOkContainerClassDefault = "mt-4";
const cancelClassDefault = "cursor-pointer text-lg ml-4";
const okClassDefault = "cursor-pointer text-lg mr-4";

const SHOW_EVENT = "show-input-modal-container";
const HIDDEN_EVENT = "input-modal-container-hidden";

class InputModalContainer extends HTMLElement {

    connectedCallback() {
        this._hidden = !this.hasAttribute("visible");

        this._render();

        this.onCancel = () => this.hide();
        this.onOk = () => { };

        window.addEventListener("click", this.hide);
        window.addEventListener(SHOW_EVENT, this._showOnEvent);
    }

    _render(title, cancel, ok) {
        const titleToRender = title ? title : Components.attributeValueOrDefault(this, "title", "Default title");
        const cancelToRender = cancel ? cancel : Components.attributeValueOrDefault(this, "cancel-text", "Cancel");
        const okToRender = ok ? ok : Components.attributeValueOrDefault(this, "ok-text", "Ok");

        const containerAttributes = Components.mappedAttributesAsObject(this, "container", {
            toAddClass: containerClass,
            defaultClass: containerClassDefault
        });
        const contentAttributes = Components.mappedAttributesAsObject(this, "content", {
            defaultClass: contentClassDefault
        });

        const titleAttributes = Components.mappedAttributesAsObject(this, "title", { defaultClass: titleClassDefault });

        const closeIcon = Components.attributeValueOrDefault(this, "close-icon", "&times;");
        const closeAttributes = Components.mappedAttributesAsObject(this, "close", {
            toAddClass: closeClass,
            defaultClass: closeClassDefault,
            toSkipAttributes: ["icon"]
        });

        const cancelOkContainerAttributes = Components.mappedAttributesAsObject(this, "cancel-ok-container", {
            defaultClass: cancelOkContainerClassDefault
        });
        const cancelAttributes = Components.mappedAttributesAsObject(this, "cancel", {
            toAddClass: cancelClassDefault
        });
        const okAttributes = Components.mappedAttributesAsObject(this, "ok", {
            toAddClass: okClassDefault
        });

        const container = Components.createElementWithAttributes("div", containerAttributes);
        if (this._hidden) {
            container.style = "display: none;";
        }

        const content = Components.createElementWithAttributes("div", contentAttributes);
        content.style = "position: relative;";

        const close = Components.createElementWithAttributes("span", closeAttributes);
        close.innerHTML = closeIcon;

        const titleEl = Components.createElementWithAttributes("div", titleAttributes);
        titleEl.textContent = titleToRender;

        content.append(close, titleEl);
        content.append(...this.children);

        container.append(content);

        const cancelOkContainer = Components.createElementWithAttributes("div", cancelOkContainerAttributes);
        cancelOkContainer.style = "display: flex; justify-content: space-between";

        const cancelEl = Components.createElementWithAttributes("div", cancelAttributes);
        cancelEl.textContent = cancelToRender;

        const okEl = Components.createElementWithAttributes("div", okAttributes);
        okEl.textContent = okToRender;

        cancelOkContainer.append(cancelEl);
        cancelOkContainer.append(okEl);

        content.append(cancelOkContainer);

        this.append(container);

        `
        <div ${this._hidden ? `style="display: none;"` : ""} ${containerAttributes}>
            <div style="position: relative;" ${contentAttributes}>
                <span ${closeAttributes}>${closeIcon}</span>
                <div ${titleAttributes}>${titleToRender}</div>
                ${this.innerHTML}
                <div style="display: flex; justify-content: space-between" ${cancelOkContainerAttributes}>
                    <div ${cancelAttributes} ${Components.renderedCustomIdAttribute("cancel")}>${cancelToRender}</div>
                    <div ${okAttributes} ${Components.renderedCustomIdAttribute("ok")}>${okToRender}</div>
              </div>
            </div>
        </div>
        `;

        this._container = container;
        this._close = close;
        this._cancel = cancelEl;
        this._ok = okEl;

        this._showOnEvent = (e) => {
            const eDetail = e.detail;
            if (!this.id || this.id == eDetail.targetId) {
                this._render(eDetail.title, eDetail.cancel, eDetail.ok);
                this._container.style.display = "block";
            }
        };

        this.show = () => {
            this._container.style.display = "block";
        };

        this.hide = e => {
            if (e == undefined || e.target == this._container) {
                this._container.style.display = "none";
                window.dispatchEvent(new CustomEvent(HIDDEN_EVENT, { detail: { id: this.id } }));
            }
        };

        this._close.onclick = () => {
            this._container.style.display = "none";
            window.dispatchEvent(new CustomEvent(HIDDEN_EVENT, { detail: { id: this.id } }));
        };

        this._cancel.onclick = () => this.onCancel();
        this._ok.onclick = () => this.onOk();
    }

    disconnectedCallback() {
        window.removeEventListener("click", this.hide);
        window.removeEventListener(SHOW_EVENT, this._showOnEvent);
    }
}

customElements.define("input-modal-container", InputModalContainer);