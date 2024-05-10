# Flexible Components

Configurable, framework agnostic (Web Components!), copy-pasteable components with full CSS control, perfectly suited for the HTMX (and other) usage.

The only dependency:
* Tailwind CSS

Inspired by:
* https://github.com/AleksanderTech/snaplo
* https://github.com/bigskysoftware/htmx

To preview and work, go to server/ and run:
```
npm ci
npm run build:run
```
Output logs will guide you:
```
Available components: 
* http://localhost:8080/input-with-error
* http://localhost:8080/form-container
* http://localhost:8080/modal-container
* http://localhost:8080/drop-down
* http://localhost:8080/experiments

Server has started on port 8080!
```

\
For the local development, you should prefer:
```
npm ci
node .
```
and in the separate terminal:
```
bash start_tailwind_watch.bash 

Rebuilding...

Done in 334ms.
```
To have live-generated CSS by Tailwind - useful as you develop the Components.

## Conventions

In `components` dir there is a collection of components. `base.js` is the dependency for all the other components to make them easier to maintain and implement new ones, according to the conventions and requirements outlined below.

Every component has its own playground in the `server/components` directory. You can for example go to `http://localhost:8080/input-with-error`, to experiment and test out `InputWithError` component. When adding a new component, remember to also add its playground in the `server/components` and register it in `server.js` file, so that it is easy to test, understand and experiment with your component.

When it comes to the design and general approach, the most important principles are as follows:
* All components are implemented as Web Components - no dependencies on frameworks and libraries
* The only external dependency used is *Tailwind CSS*; it makes default styling significantly easier to implement
* Don't use *Shadow DOM* - it's complicated and doesn't work with *HTMX* and we are keen on supporting it
* Every component should allow to override `class` attribute of any of its elements - there is a specific naming convention for it
* Every component should allow to add arbitrary class to `class` attribute to any of its elements - there is also a specific naming convention for it
* Every component should allow to set arbitrary attributes on any of its elements - there is also a specific naming convention for it
* Reusable functions are all defined in the `base.js` file on which every component can depend

It's extremely versatile and flexible approach; it allows to create reusable components that can be styled and configured from the outside almost without any limits. If you are interested in more details about this approach and how it plays nicely with HTMX, read this blog post: https://binaryigor.com/htmx-and-web-components-a-perfect-match.html

Some examples of naming conventions:
```
<input-with-error 
    input:type="text"
    input:name="message"
    input:placeholder="Input something..."
    input:hx-post="some-path/validate"
    input:hx-trigger="input changed delay:500ms"
    input:hx-swap="outerHTML"
    input:hx-target="next input-error">
</input-with-error>

<input-with-error id="js-input"
    input:class="w-full focus:border-indigo-400 rounded-xl border-[4px] border-indigo-500 bg-indigo-800 p-4 text-slate-100 outline-none"
    input:placeholder="Input some name between 2 and 10 characters..."
    error:class="italic text-lg text-red-600">
</input-with-error>

<modal-container 
    id="error-modal" 
    title:add:class="text-red-500"
    with-left-right-buttons="false">
    <div class="px-4 pb-16">Some error information...</div>
</modal-container>
```
Basically:
* `{element}:{attribute}` will set *attribute* on *element* inside Web Component
* `{element}:add:class` will add a *class* to *class* attribute of *element* inside Web Component

It's straightforward to support these conventions, thanks to reusable functions from `base.js`:
```
import { Components } from "./base.js";

...

connectedCallback() {
    const containerAttributes = Components.mappedAttributes(this, "container");
    const inputAttributes = Components.mappedAttributes(this, "input", {
        defaultClass: inputClassDefault
    });
    const inputErrorAttributes = Components.mappedAttributes(this, "input-error");
    const errorAttributes = Components.mappedAttributes(this, "error");

    this.innerHTML = `
    <div ${containerAttributes}>
    <input ${inputAttributes}></input>
    <input-error ${inputErrorAttributes} ${errorAttributes}></input-error>
    </div>`;
}

...
```

\
Have fun using and developing!

