import { Components } from "./base.js";

const hiddenClass = "hidden";

const defaultContainerClass = "cursor-pointer text-xl w-fit";
const defaultTitleClass = "text-xl py-2";
const defaultOptionsClass = "w-full space-y-1 overflow-auto max-h-[90vh]";
const defaultOptionClass = "py-2 px-2 text-right rounded bg-slate-50";

const attributes = {
    hideOptionsOnOutsideClick: "hide-options-on-outside-click",
    hideOptionsOnSelected: "hide-options-on-selected",
    optionsZIndex: "options-z-index"
};

const optionDataId = "data-id";

const elements = {
    container: "container",
    title: "title",
    options: "options",
    option: "option",
    optionOfIdx(idx) {
        return `option-${idx}`
    }
};

const maxOptions = 100;

class DropDown extends HTMLElement {

    set options(options) {
        this._options = options;
        const optionsHTML = this._optionItemsHTML();
        this._optionsElement.innerHTML = optionsHTML;
        this._setOptionItemsOnClick();
    }

    connectedCallback() {
        const containerAttributes = Components.mappedAttributes(this, elements.container, { defaultClass: defaultContainerClass });

        const title = Components.attributeValueOrDefault(this, "title", "DropDown");
        const titleAttributes = Components.mappedAttributes(this, elements.title, { defaultClass: defaultTitleClass });

        const optionsAttributes = Components.mappedAttributes(this, elements.options, {
            defaultClass: defaultOptionsClass,
            toAddClass: hiddenClass
        });
        const optionsZIndex = Components.attributeValueOrDefault(this, attributes.optionsZIndex, "99");

        this._hideOptionsOnOutsideClick = Components.attributeBooleanValueOrDefault(this, attributes.hideOptionsOnOutsideClick, true);
        this._hideOptionsOnSelected = Components.attributeBooleanValueOrDefault(this, attributes.hideOptionsOnSelected, true);

        const optionsHTML = this._optionItemsHTML();

        this.innerHTML = `
        <div style="position: relative;" ${containerAttributes}>
            <div ${titleAttributes}>${title}</div>
            <ul style="position: absolute; z-index: ${optionsZIndex}" ${optionsAttributes}>
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
            if (this._hideOptionsOnOutsideClick &&
                e.target != container && e.target.parentNode != container) {
                options.classList.add(hiddenClass);
            }
        };

        this._setOptionItemsOnClick();

        window.addEventListener("click", this._hideOptionsIfOutside);
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

        const defaultOptionAttributes = Components.mappedAttributesAsObject(this, elements.option, {
            defaultClass: defaultOptionClass
        });

        for (let i = 0; i < options.length; i++) {
            const o = options[i];

            const defaultAttributes = { ...defaultOptionAttributes };
            if (o.dataId) {
                defaultAttributes[optionDataId] = o.dataId;
            }
            const optionAttributes = Components.mappedAttributes(this, elements.optionOfIdx(i), {
                defaultAttributes: defaultAttributes
            });

            optionItems.push(this._optionItemHTML(optionAttributes, o.title));
        }

        return optionItems;
    }

    _optionItemHTML(attributes, title) {
        return `<li ${attributes}">${title}</li>`;
    }

    _optionItemsFromAttributes() {
        const optionItems = [];

        const defaultOptionAttributes = Components.mappedAttributesAsObject(this, elements.option, {
            defaultClass: defaultOptionClass
        });

        for (let i = 0; i < maxOptions; i++) {
            const optionId = elements.optionOfIdx(i);
            const optionTitle = this.getAttribute(`${optionId}-text`);
            if (!optionTitle) {
                break;
            }
            const optionAttributes = Components.mappedAttributes(this, optionId, {
                defaultAttributes: defaultOptionAttributes
            });
            optionItems.push(this._optionItemHTML(optionAttributes, optionTitle));
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
                        dataId: li.getAttribute(optionDataId)
                    }
                }));
            };
        });
    }

    disconnectedCallback() {
        window.removeEventListener("click", this._hideOptionsIfOutside);
    }
}

customElements.define("drop-down", DropDown);