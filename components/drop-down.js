import { Components } from "./base.js";

const hiddenClass = "hidden";

const containerClassDefault = "whitespace-nowrap cursor-pointer text-xl w-fit";
const titleClassDefault = "text-xl py-2";
const optionsClassDefault = "top-8 right-0 w-full space-y-1 overflow-auto max-h-[90vh]";
const optionClassDefault = "py-2 px-4 text-right rounded bg-slate-50";

const attributes = {
    hideOptionsOnOutsideClick: "hide-options-on-outside-click",
    hideOptionsOnSelected: "hide-options-on-selected"
};

const optionDataId = "data-id";

const elements = {
    title: "title",
    options: "options",
    option: "option",
    optionOfIdx(idx) {
        return `option-${idx}`
    }
};

const MAX_OPTIONS = 100;

class DropDown extends HTMLElement {

    set options(options) {
        this._options = options;
        const optionsHTML = this._optionItemsHTML();
        this._optionsElement.innerHTML = optionsHTML;
        this._setOptionItemsOnClick();
    }

    connectedCallback() {
        const title = Components.attributeValueOrDefault(this, "title", "Drop Down");
        const titleAttributes = Components.mappedAttributes(this, elements.title, { defaultClass: titleClassDefault });

        const optionsAttributes = Components.mappedAttributes(this, elements.options, {
            defaultClass: optionsClassDefault,
            toAddClass: hiddenClass
        });

        this._hideOptionsOnOutsideClick = Components.attributeBooleanValueOrDefault(this, attributes.hideOptionsOnOutsideClick, true);
        this._hideOptionsOnSelected = Components.attributeBooleanValueOrDefault(this, attributes.hideOptionsOnSelected, true);

        const optionsHTML = this._optionItemsHTML();

        this.innerHTML = `
        <div class="relative ${containerClassDefault}">
            <div ${titleAttributes}>${title}</div>
            <ul style="z-index: 999" ${optionsAttributes}>
                ${optionsHTML}
            </ul>
        </div>
        `;

        const options = this.querySelector("ul");
        this._optionsElement = options;

        const container = this.querySelector("div");
        container.onclick = (e) => {
            // Do not hide other, opened DropDowns
            e.stopPropagation();
            options.classList.toggle(hiddenClass);
        };

        this.hideOptions = () => {
            options.classList.add(hiddenClass);
        };

        this._hideOptionsIfOutside = (e) => {
            if (e.target != container && e.target.parentNode != container) {
                options.classList.add(hiddenClass);
            }
        };

        this._setOptionItemsOnClick();

        if (this._hideOptionsOnOutsideClick == true) {
            window.addEventListener("click", this._hideOptionsIfOutside);
        }
    }

    _optionItemsHTML() {
        let optionItems;
        if (this._options) {
            optionItems = this._optionItemsFromPropery(this._options);
        } else {
            optionItems = this._optionItemsFromAttributes();
        }
        return optionItems.join("\n");
    }

    _optionItemsFromPropery(options) {
        const optionItems = [];

        const optionDefaultAttributes = Components.mappedAttributesAsObject(this, elements.option, {
            defaultClass: optionClassDefault
        });

        for (let i = 0; i < options.length; i++) {
            const o = options[i];
            const optionAttributes = Components.mappedAttributes(this, elements.optionOfIdx(i), {
                defaultAttributes: {
                    ...optionDefaultAttributes,
                    optionDataId: o.id
                }
            });
            optionItems.push(this._optionItemHtml(optionAttributes, o.title));
        }

        return optionItems;
    }

    _optionItemHtml(attributes, title) {
        return `<li ${attributes}">${title}</li>`;
    }

    _optionItemsFromAttributes() {
        const optionItems = [];

        const optionDefaultAttributes = Components.mappedAttributesAsObject(this, elements.option, {
            defaultClass: optionClassDefault
        });

        for (let i = 0; i < MAX_OPTIONS; i++) {
            const optionId = elements.optionOfIdx(i);
            const optionTitle = this.getAttribute(`${optionId}-text`);
            if (!optionTitle) {
                break;
            }
            const optionAttributes = Components.mappedAttributes(this, optionId, {
                defaultAttributes: optionDefaultAttributes
            });
            optionItems.push(this._optionItemHtml(optionAttributes, optionTitle));
        }

        return optionItems;
    }

    _setOptionItemsOnClick() {
        this.querySelectorAll("li").forEach(li => {
            li.onclick = (e) => {
                // For controlled hide to work
                e.stopPropagation();

                if (this._hideOptionsOnSelected) {
                    this.hideOptions();
                }

                this.dispatchEvent(new CustomEvent("drop-down-option-chosen", {
                    detail: {
                        text: li.textContent,
                        id: li.getAttribute(optionDataId)
                    }
                }));
            };
        });
    }

    disconnectedCallback() {
        if (this._hideOptionsOnOutsideClick == true) {
            window.removeEventListener("click", this._hideOptionsIfOutside);
        }
    }
}

customElements.define("drop-down", DropDown);