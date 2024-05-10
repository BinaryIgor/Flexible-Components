export const Components = {
    mappedAttributesAsObject(element, elementId,
        { defaultAttributes = {},
            defaultClass = "",
            toAddAttributes = {},
            toAddClass = "",
            toSkipAttributes = [] } = {}) {

        let baseAttributes = baseAtrributesFromDefaults(defaultAttributes, defaultClass);

        let mappedAttributes = mappedAttributesWithDefaults(element, elementId, baseAttributes, toSkipAttributes);

        return mappedAttributesWithToAddValues(mappedAttributes, toAddAttributes, toAddClass);
    },

    mappedAttributes(element, elementId,
        { defaultAttributes = {},
            defaultClass = "",
            toAddAttributes = {},
            toAddClass = "",
            toSkipAttributes = [] } = {}) {
        const attributes = this.mappedAttributesAsObject(element, elementId,
            { defaultAttributes, defaultClass, toAddAttributes, toAddClass, toSkipAttributes })

        return Object.entries(attributes).map(e => `${e[0]}="${e[1]}"`).join("\n");
    },

    setAttributes(element, attributes) {
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
    },

    createElementWithAttributes(elementType, attributes) {
        const element = document.createElement(elementType);
        this.setAttributes(element, attributes);
        return element;
    },

    attributeValueOrDefault(element, attribute, defaultValue = "") {
        const value = element.getAttribute(attribute);
        return value ? value : defaultValue;
    },

    attributeBooleanValueOrDefault(element, attribute, defaultValue = false) {
        const value = this.attributeValueOrDefault(element, attribute, defaultValue);
        return value.toString() == 'true';
    },

    queryByCustomId(element, value) {
        return element.querySelector(`[data-custom-id="${value}"]`);
    },

    renderedCustomIdAttribute(value) {
        return `data-custom-id="${value}"`;
    },

    setCustomIdAttribute(element, value) {
        element.setAttribute('data-custom-id', value);
    }
};

function baseAtrributesFromDefaults(defaultAttributes, defaultClass) {
    if (defaultClass) {
        defaultAttributes["class"] = defaultClass;
    }

    return defaultAttributes;
}

function mappedAttributesWithDefaults(element, elementId, defaultAttributes, toSkipAttributes) {
    const overridePrefix = `${elementId}:`;
    const addPrefix = `${elementId}:add:`;
    const replacePrefix = `${elementId}:replace:`;

    const toMapAttributes = element.getAttributeNames()
        .filter(a => a.startsWith(overridePrefix) || a.startsWith(addPrefix) || a.startsWith(replacePrefix));

    const mappedAttributes = { ...defaultAttributes };

    toMapAttributes.forEach(a => {
        let targetKey;
        let add = false;
        let replace = false;
        if (a.startsWith(addPrefix)) {
            add = true;
            targetKey = a.replace(addPrefix, "");
        } else if (a.startsWith(replacePrefix)) {
            replace = true;
            targetKey = a.replace(replacePrefix, "");
        } else {
            add = false;
            targetKey = a.replace(overridePrefix, "");
        }

        if (toSkipAttributes.includes(targetKey)) {
            return "";
        }

        if (add) {
            const prevValue = mappedAttributes[targetKey];
            const newValue = element.getAttribute(a);
            if (prevValue) {
                mappedAttributes[targetKey] = `${prevValue} ${newValue}`;
            } else {
                mappedAttributes[targetKey] = newValue;
            }
        } else if (replace && mappedAttributes[targetKey]) {
            const patterns = element.getAttribute(a).split(" ");
            patterns.forEach(p => {
                const pattern = p.split("=");
                const old = pattern[0];
                const replacement = pattern.length > 1 ? pattern[1] : "";
                const prevValue = mappedAttributes[targetKey];
                mappedAttributes[targetKey] = prevValue.replace(old, replacement);
            });
        } else {
            mappedAttributes[targetKey] = element.getAttribute(a);
        }
    });

    return mappedAttributes;
}

function mappedAttributesWithToAddValues(mappedAttributes, toAddAttributes, toAddClass) {
    if (toAddClass) {
        toAddAttributes["class"] = toAddClass;
    }

    for (const [key, value] of Object.entries(toAddAttributes)) {
        const prevValue = mappedAttributes[key];

        let newValue;
        if (prevValue) {
            newValue = `${value} ${prevValue}`;
        } else {
            newValue = value;
        }

        mappedAttributes[key] = newValue;
    }

    return mappedAttributes;
}