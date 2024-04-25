import { Components } from "./base.js";

const hiddenClass = "hidden";

const defaultContainerClass = "cursor-pointer text-xl w-fit";
const defaultDropdownOptionsClass = "top-8 right-0 rounded-md w-full space-y-1";
const defaultDropdownOptionClass = "bg-slate-100 py-2 px-4 text-right";

const MAX_OPTIONS = 100;

class DropDown extends HTMLElement {

    connectedCallback() {
        const title = Components.attributeValueOrDefault(this, "title", "Drop Down");

        this._hideOptionsOnSelected = Components.attributeValueOrDefault(this, "hide-options-on-selected", true);

        const optionItems = [];

        for (let i = 0; i < MAX_OPTIONS; i++) {
            const optionId = `option-${i}`;
            const optionTitle = this.getAttribute(`${optionId}-text`);
            if (!optionTitle) {
                break;
            }
            const optionAttributes = Components.mappedAttributes(this, optionId, {
                defaultClass: defaultDropdownOptionClass
            });
            optionItems.push(`<li ${optionAttributes}">${optionTitle}</li>`);
        }

        const optionsHTML = optionItems.join("\n");

        //TODO: what classes are really needed?
        this.innerHTML = `
        <div class="relative ${defaultContainerClass}">
            <div>${title}</div>
            <ul class="${hiddenClass} whitespace-nowrap absolute ${defaultDropdownOptionsClass}">
                ${optionsHTML}
            </ul>
        </div>
        `;

        const options = this.querySelector("ul");

        const container = this.querySelector("div");
        container.onclick = (e) => {
            options.classList.remove(hiddenClass);
        };

        this.hideOptions = (e) => {
            options.classList.add(hiddenClass);
        };

        this.querySelectorAll("li").forEach(li => {
            li.onclick = (e) => {
                // For controlled hide to work
                e.stopPropagation();

                if (this._hideOptionsOnSelected == true) {
                    options.classList.add(hiddenClass);
                }

                console.log("Option chosen!", li);
                this.dispatchEvent(new CustomEvent("drop-down-option-chosen", {
                    detail: { text: li.textContent, dataId: li.getAttribute("data-id") }
                }));
            };
        });
    }
}

customElements.define("drop-down", DropDown);