import { Components } from "./base.js";

class DropDown extends HTMLElement {

    static hiddenClass = "hidden";

    static defaultContainerClass = "cursor-pointer text-xl w-fit";
    static defaultTitleClass = "text-xl py-2";
    static defaultOptionsClass = "w-full space-y-1 overflow-auto max-h-[90vh]";
    static defaultOptionClass = "py-2 px-2 text-right rounded bg-slate-50";

    static attributes = {
        title: "title",
        hideOptionsOnOutsideClick: "hide-options-on-outside-click",
        hideOptionsOnSelected: "hide-options-on-selected",
        optionsZIndex: "options-z-index"
    };

    static optionDataId = "data-id";

    static elements = {
        container: "container",
        title: "title",
        options: "options",
        option: "option",
        optionOfIdx(idx) {
            return `option-${idx}`
        }
    };

    static maxOptions = 100;

    static observedAttributes = [DropDown.attributes.title];

    set options(options) {
        this._options = options;
        const optionsHTML = this._optionItemsHTML();
        this._optionsElement.innerHTML = optionsHTML;
        this._setOptionItemsOnClick();
    }

    connectedCallback() {
        const containerAttributes = Components.mappedAttributes(this, DropDown.elements.container,
            { defaultClass: DropDown.defaultContainerClass });

        const title = Components.attributeValueOrDefault(this, DropDown.attributes.title, "DropDown");
        const titleAttributes = Components.mappedAttributes(this, DropDown.elements.title,
            { defaultClass: DropDown.defaultTitleClass });

        const optionsAttributes = Components.mappedAttributes(this, DropDown.elements.options, {
            defaultClass: DropDown.defaultOptionsClass,
            toAddClass: DropDown.hiddenClass
        });
        const optionsZIndex = Components.attributeValueOrDefault(this, DropDown.attributes.optionsZIndex, "99");

        this._hideOptionsOnOutsideClick = Components.attributeBooleanValueOrDefault(this, DropDown.attributes.hideOptionsOnOutsideClick, true);
        this._hideOptionsOnSelected = Components.attributeBooleanValueOrDefault(this, DropDown.attributes.hideOptionsOnSelected, true);

        const optionsHTML = this._optionItemsHTML();

        this.innerHTML = `
        <div style="position: relative;" ${containerAttributes}>
            <div ${titleAttributes}>${title}</div>
            <ul style="position: absolute; z-index: ${optionsZIndex}" ${optionsAttributes}>
                ${optionsHTML}
            </ul>
        </div>
        `;

        this._titleElement = this.querySelectorAll("div")[1];

        const options = this.querySelector("ul");
        this._optionsElement = options;

        const container = this.querySelector("div");
        container.onclick = (e) => {
            // Do not hide other, opened DropDowns
            e.stopPropagation();
            options.classList.toggle(DropDown.hiddenClass);
        };

        this.hideOptions = () => {
            options.classList.add(DropDown.hiddenClass);
        };

        this._hideOptionsIfOutside = (e) => {
            if (this._hideOptionsOnOutsideClick &&
                e.target != container && e.target.parentNode != container) {
                options.classList.add(DropDown.hiddenClass);
            }
        };

        this._setOptionItemsOnClick();

        window.addEventListener("click", this._hideOptionsIfOutside);
    }

    _optionItemsHTML() {
        let optionItems;
        if (this._options) {
            optionItems = this._optionItemsFromProperty(this._options);
        } else {
            optionItems = this._optionItemsFromAttributes();
        }
        return optionItems.join("\n");
    }

    _optionItemsFromProperty(options) {
        const optionItems = [];

        const defaultOptionAttributes = Components.mappedAttributesAsObject(this, DropDown.elements.option, {
            defaultClass: DropDown.defaultOptionClass
        });

        for (let i = 0; i < options.length; i++) {
            const o = options[i];

            const defaultAttributes = { ...defaultOptionAttributes };
            if (o.dataId) {
                defaultAttributes[DropDown.optionDataId] = o.dataId;
            }
            const optionAttributes = Components.mappedAttributes(this, DropDown.elements.optionOfIdx(i), {
                defaultAttributes: defaultAttributes
            });

            optionItems.push(this._optionItemHTML(optionAttributes, o.title));
        }

        return optionItems;
    }

    _optionItemHTML(attributes, title) {
        return `<li ${attributes}>${title}</li>`;
    }

    _optionItemsFromAttributes() {
        const optionItems = [];

        const defaultOptionAttributes = Components.mappedAttributesAsObject(this, DropDown.elements.option, {
            defaultClass: DropDown.defaultOptionClass
        });

        for (let i = 0; i < DropDown.maxOptions; i++) {
            const optionId = DropDown.elements.optionOfIdx(i);
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
                        dataId: li.getAttribute(DropDown.optionDataId)
                    }
                }));
            };
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == DropDown.attributes.title && this._titleElement) {
            this._titleElement.textContent = newValue;
        }
    }

    disconnectedCallback() {
        window.removeEventListener("click", this._hideOptionsIfOutside);
    }
}

customElements.define("drop-down", DropDown);