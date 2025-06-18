<h1 align="center">
  <img src="images/readme-header.png" alt="Motion for VS Code" />
</h1>

Supercharge your animation development process with Motion for VS Code.

-   **Copilot docs:** Turn Copilot into a Motion expert with the latest docs.
-   **Copilot CSS generation:** Enhance Copilot's CSS generation with real Motion springs.

Additionally, [Motion+](https://motion.dev/plus) users gain access to:

-   **Bezier curve editor**: Edit and preview CSS and Motion easing curves.
-   More features coming soon

![Bezier curve editing](images/bezier-editing.gif)

<!---
-   **AI+ docs:** Latest docs for Motion+ features like `Cursor` and `Ticker`
-   **Curve visualisation:** Lets Copilot visually see springs and easing curves
-   **Spring editor:** Edit Motion springs inline, in real-time
-->

## Install

Install via the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Motion.motion-vscode-extension)

### Enable Motion+ features

Generate a [personal access token](https://plus.motion.dev/profile), then click "Authenticate" in the Motion panel to open an input dialog for your token.

![Screenshot of the unauthenticated Motion panel](images/auth.png)

## Features

### Copilot docs

Load the latest Motion documentation directly into Copilot. Add docs to a chat by clicking on "Add Context":

![Screenshot of the Copilot chat window](images/readme-add-context.png)

Navigating to "MCP Resources..."

![Screenshot of the resources list](images/readme-add-context-2.png)

Search for the docs you're looking for:

![Screenshot of the search box](images/readme-add-context-3.png)

[Learn more about Copilot docs](https://motion.dev/docs/ai-llm-documentation)

### CSS generation

With Motion for Visual Code Studio, Copilot gains the ability to generate CSS `linear()` easing curves to create springs or other custom easing curves.

> Generate a CSS spring that's quite bouncy

```js
600ms linear(0, 0.0121 /* ... */)
```

[Learn more about CSS generation](https://motion.dev/docs/ai-generate-css-springs-and-easings-llm)

### Bezier curve editing

When editing a CSS or Motion bezier easing curve while the Motion panel's open, a bezier curve editor will appear. Changes will be immediately reflected in your code.

![Bezier curve editing](images/bezier-editing.gif)

<!--

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

-   `myExtension.enable`: Enable/disable this extension.
-   `myExtension.thing`: Set to `blah` to do something.

## Motion+ authentication

To enable Motion+

-->

## Issues & feature requests

Found a bug or have a feature request? Open an issue on the [Motion repo](https://github.com/motiondivision/motion).
