import { Components } from "./base.js";

class ModalContainer extends HTMLElement {

    static defaultContainerZIndex = "10";
    static defaultContainerClass = "bg-black/70";
    static defaultContentClass = "max-w-lg w-11/12 rounded top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2 bg-white";
    static defaultTitleClass = "text-xl font-bold p-4";
    static defaultCloseClass = "cursor-pointer text-4xl px-2";
    static defaultCloseIcon = "&times;";
    static defaultLeftRightButtonClass = "cursor-pointer text-lg p-4";

    static attributes = {
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

    static elements = {
        container: "container",
        content: "content",
        title: "title",
        close: "close",
        leftRightButtonsContainer: "left-right-buttons-container",
        leftButton: "left-button",
        rightButton: "right-button"
    };

    static observedAttributes = [ModalContainer.attributes.title];

    connectedCallback() {
        this._render();
        this._initProperties();

        const hideOnOutsideClick = Components.attributeBooleanValueOrDefault(this, ModalContainer.attributes.hideOnOutsideClick, false);
        if (hideOnOutsideClick) {
            this._container.addEventListener("click", this.hide);
        }
    }

    _render() {
        const title = Components.attributeValueOrDefault(this, ModalContainer.attributes.title, "Modal Container");

        const containerAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.container, {
            defaultClass: ModalContainer.defaultContainerClass
        });
        const contentAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.content, {
            defaultClass: ModalContainer.defaultContentClass
        });

        const titleAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.title, {
            defaultClass: ModalContainer.defaultTitleClass
        });

        const withclose = Components.attributeBooleanValueOrDefault(this, ModalContainer.attributes.withClose, true);
        let close = null;
        if (withclose) {
            const closeIcon = Components.attributeValueOrDefault(this, ModalContainer.attributes.closeIcon, ModalContainer.defaultCloseIcon);
            const closeAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.close, { defaultClass: ModalContainer.defaultCloseClass });
            close = Components.createElementWithAttributes("span", closeAttributes);
            close.style = "position: absolute; top: 0; right: 0;";
            close.innerHTML = closeIcon;
        }

        const containerZIndex = Components.attributeValueOrDefault(this, ModalContainer.attributes.containerZIndex, ModalContainer.defaultContainerZIndex);
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

        const withLeftRightButtons = Components.attributeBooleanValueOrDefault(this, ModalContainer.attributes.withLeftRightButtons, true);
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
        const leftRightButtonsContainerAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.leftRightButtonsContainer);
        const buttonsContainer = Components.createElementWithAttributes("div", leftRightButtonsContainerAttributes);

        const withLeftButton = Components.attributeBooleanValueOrDefault(this, ModalContainer.attributes.withLeftButton, true);
        const withRightButton = Components.attributeBooleanValueOrDefault(this, ModalContainer.attributes.withRightButton, true);

        let justifyContent;
        if (withLeftButton && withRightButton) {
            justifyContent = "space-between";
        } else if (withLeftButton) {
            justifyContent = "left";
        } else {
            justifyContent = "right";
        }
        buttonsContainer.style = `display: flex; justify-content: ${justifyContent}`;

        const leftButtonText = Components.attributeValueOrDefault(this, ModalContainer.attributes.leftButtonText, "Cancel");
        const leftButtonAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.leftButton, {
            defaultClass: ModalContainer.defaultLeftRightButtonClass
        });

        const rightButtonText = Components.attributeValueOrDefault(this, ModalContainer.attributes.rightButtonText, "Ok");
        const rightButtonAttributes = Components.mappedAttributesAsObject(this, ModalContainer.elements.rightButton, {
            defaultClass: ModalContainer.defaultLeftRightButtonClass
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
        if (name == ModalContainer.attributes.title) {
            this._title.textContent = newValue;
        }
    }
}

customElements.define("modal-container", ModalContainer);