<h1 align="center">
  <img src="images/readme-header.png" alt="Motion Studio" />
</h1>

Streamline your animation development process with Motion Studio. Edit CSS and Motion code directly in-editor with Motion Studio's visual and AI editing tools.

-   **Documentation**: Update your LLM with the latest Motion docs.
-   **Curve visualisation**: Enable your LLM to visually understand spring and easing functions.

[Motion+](https://motion.dev/plus) members also gain access to:

-   **Bezier curve editor**: Real-time editing and preview of Motion and CSS bezier curves.
-   **CSS springs**: Generate CSS springs - no animation library needed.
-   **Custom ruleset**: Turn your LLM into a Motion expert.

![Bezier curve editing](images/bezier-editing.gif)

## Install

Install the [extension](https://motion.dev/docs/studio-install#extension) to add visual editing tools, and add the [MCP](https://motion.dev/docs/studio-install#mcp) to add documentation and other AI editing features.

### Enable Motion+ features

Generate a [personal access token](https://plus.motion.dev), then click "Authenticate" in the Motion panel to open an input dialog for your token.

![Screenshot of the unauthenticated Motion panel](images/auth.png)

## Features

### Documentation

LLMs are trained on data that is often out of date, leading to incorrect answers or inaccurate code. Motion Studio provides the latest documentation to your LLM so it's always up to speed.

![Screenshot of the Copilot chat window](images/readme-add-context.png)

[Learn more about documentation for LLMs](https://motion.dev/docs/studio-llm-documentation)

### Bezier curve editing

Motion Studio enables real-time editing and preview of bezier curves, without having to leave your editor.

![Bezier curve editing](images/bezier-editing.gif)

### CSS springs

Motion Studio gives your AI editor the ability to generate CSS linear() easing curves to create springs or other custom easing curves, using real Motion code.

> Generate a CSS spring that's quite bouncy

```js
600ms linear(0, 0.0121 /* ... */)
```

[Learn more about CSS generation](https://motion.dev/docs/studio-generate-css)

### Visualise springs and easing curves

Motion Studio enables your LLM to visualise springs and easing curves. Just select a spring or easing definition in your code and ask your LLM to "visualise" it - or prompt it to "visualise a stiff spring" or "visualise the CSS ease-out curve".

[Learn more about visualisation](https://motion.dev/docs/studio-visualise-curves)

### Rules

Turn your LLM into an animation expert with the Motion+ LLM rules.

-   Best practices for when and how to add will-change.
-   Coding styles to improve per-frame performance.
-   When to animate transform vs independent transforms.

[Learn more about rules](https://motion.dev/docs/studio-llm-rules)

## Issues & feature requests

Found a bug or have a feature request? Open an issue on the [Motion repo](https://github.com/motiondivision/motion).
