class CustomMessage extends HTMLElement {

    static observedAttributes = ["category", "message"];

    static cssClass(className) {
        return `__custom_message_component__${className}`;
    }

    static {
        const scopedStyle = document.createElement("style");
        scopedStyle.innerHTML = `
        .${CustomMessage.cssClass("text-red")} {
            color: red
        }
        .${CustomMessage.cssClass("text-2xl")} {
            font-size: 2rem;
        }
        `;
        document.querySelector("head").appendChild(scopedStyle);
    }

    constructor() {
        super();
        const category = this.getAttribute("category");
        const message = this.getAttribute("message");
        this.innerHTML = `
        <div class="${CustomMessage.cssClass("text-2xl")}">You've got an interesting message, from ${category} category:</div>
        <div>${message}</div>
        <span class="${CustomMessage.cssClass('text-red')}">Spam footer</span>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`${name} attribute was changed from ${oldValue} to ${newValue}!`);
    }

    connectedCallback() {
        console.log("Element was added to the DOM!");
    }

    disconnectedCallback() {
        console.log("Element was removed from the DOM!");
    }
}

customElements.define('custom-message', CustomMessage);