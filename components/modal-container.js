import { Components } from "./base.js";

const defaultContainerZIndex = "10";
const defaultContainerClass = "bg-black/70";
const defaultContentClass = "max-w-lg w-11/12 rounded top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2 bg-white";
const defaultTitleClass = "text-xl font-bold p-4";
const defaultCloseClass = "cursor-pointer text-4xl px-2";
const defaultCloseIcon = "&times;";
const defaultLeftRightButtonClass = "cursor-pointer text-lg p-4";

const attributes = {
    containerZIndex: "container-z-index",
    title: "title",
    withClose: "with-close",
    closeIcon: "close-icon",
    withLeftRightButtons: "with-left-right-buttons",
    withLeftButton: "with-left-button",
    withRightButton: "with-right-button",
    leftButtonText: "left-button-text",
    rightButtonText: "right-button-text",
    hideOnOutsideClick: "hide-on-outside-click"
};

const elements = {
    container: "container",
    content: "content",
    title: "title",
    close: "close",
    leftRightButtonsContainer: "left-right-buttons-container",
    leftButton: "left-button",
    rightButton: "right-button"
};

class ModalContainer extends HTMLElement {

    static observedAttributes = [attributes.title];

    connectedCallback() {
        this._render();
        this._initProperties();

        const hideOnOutsideClick = Components.attributeBooleanValueOrDefault(this, attributes.hideOnOutsideClick, false);
        if (hideOnOutsideClick) {
            this._container.addEventListener("click", this.hide);
        }
    }

    _render() {
        const title = Components.attributeValueOrDefault(this, attributes.title, "Modal Container");

        const containerAttributes = Components.mappedAttributesAsObject(this, elements.container, {
            defaultClass: defaultContainerClass
        });
        const contentAttributes = Components.mappedAttributesAsObject(this, elements.content, {
            defaultClass: defaultContentClass
        });

        const titleAttributes = Components.mappedAttributesAsObject(this, elements.title, {
            defaultClass: defaultTitleClass
        });

        const withclose = Components.attributeBooleanValueOrDefault(this, attributes.withClose, true);
        let close = null;
        if (withclose) {
            const closeIcon = Components.attributeValueOrDefault(this, attributes.closeIcon, defaultCloseIcon);
            const closeAttributes = Components.mappedAttributesAsObject(this, elements.close, { defaultClass: defaultCloseClass });
            close = Components.createElementWithAttributes("span", closeAttributes);
            close.style = "position: absolute; top: 0; right: 0;";
            close.innerHTML = closeIcon;
        }

        const containerZIndex = Components.attributeValueOrDefault(this, attributes.containerZIndex, defaultContainerZIndex);
        const container = Components.createElementWithAttributes("div", containerAttributes);
        container.style = `position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index: ${containerZIndex}`;
        container.style.display = "none";

        const content = Components.createElementWithAttributes("div", contentAttributes);

        const titleElement = Components.createElementWithAttributes("div", titleAttributes);
        titleElement.textContent = title;

        if (close) {
            content.append(close);
        }
        content.append(titleElement);
        content.append(...this.children);

        const withLeftRightButtons = Components.attributeBooleanValueOrDefault(this, attributes.withLeftRightButtons, true);
        if (withLeftRightButtons) {
            content.append(this._leftRightButtons());
        }

        this._container = container;
        this._content = content;
        this._title = titleElement;

        container.append(content);
        this.append(container);

        this.show = () => this._container.style.display = "block";

        this.hide = e => {
            if (e == undefined || e.target == this._container) {
                this.beforeHideListener();
                if (this.hideDelay > 0) {
                    setTimeout(() => this._doHide(), this.hideDelay);
                } else {
                    this._doHide();
                }
            }
        };

        if (close) {
            close.onclick = () => this.hide();
        }
    }

    _initProperties() {
        if (!this.hideDelay) {
            this.hideDelay = 0;
        }
        if (!this.onLeft) {
            this.onLeft = () => this.hide();
        }
        if (!this.onRight) {
            this.onRight = () => { };
        }
        if (!this.beforeHideListener) {
            this.beforeHideListener = () => { };
        }
        if (!this.afterHideListener) {
            this.afterHideListener = () => { };
        }
    }

    _doHide() {
        this._container.style.display = "none";
        this.afterHideListener();
    }

    _leftRightButtons() {
        const leftRightButtonsContainerAttributes = Components.mappedAttributesAsObject(this, elements.leftRightButtonsContainer);
        const buttonsContainer = Components.createElementWithAttributes("div", leftRightButtonsContainerAttributes);
        
        const withLeftButton = Components.attributeBooleanValueOrDefault(this, attributes.withLeftButton, true);
        const withRightButton = Components.attributeBooleanValueOrDefault(this, attributes.withRightButton, true);

        let justifyContent;
        if (withLeftButton && withRightButton) {
            justifyContent = "space-between";
        } else if (withLeftButton) {
            justifyContent = "left";
        } else {
            justifyContent = "right";
        }
        buttonsContainer.style = `display: flex; justify-content: ${justifyContent}`;

        const leftButtonText = Components.attributeValueOrDefault(this, attributes.leftButtonText, "Cancel");
        const leftButtonAttributes = Components.mappedAttributesAsObject(this, elements.leftButton, {
            defaultClass: defaultLeftRightButtonClass
        });

        const rightButtonText = Components.attributeValueOrDefault(this, attributes.rightButtonText, "Ok");
        const rightButtonAttributes = Components.mappedAttributesAsObject(this, elements.rightButton, {
            defaultClass: defaultLeftRightButtonClass
        });

        if (withLeftButton) {
            const leftButton = Components.createElementWithAttributes("div", leftButtonAttributes);
            leftButton.textContent = leftButtonText;
            buttonsContainer.append(leftButton);
            leftButton.onclick = () => this.onLeft();
        }

        if (withRightButton) {
            const rightButton = Components.createElementWithAttributes("div", rightButtonAttributes);
            rightButton.textContent = rightButtonText;
            buttonsContainer.append(rightButton);
            rightButton.onclick = () => this.onRight();
        }

        return buttonsContainer;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._container) {
            return;
        }
        if (name == attributes.title) {
            this._title.textContent = newValue;
        }
    }
}

customElements.define("modal-container", ModalContainer);