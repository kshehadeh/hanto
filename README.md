# scribbler

Scribbler is a toy I created to see if I could create a pluggable static analysis tool that had awareness of groups of files (or projects) to help identify systemic issues and be able to be more selective about the issues that it identified at a file level.


## Organization

This a monorepo organized into the core library, a cli and several plugins

1. core - The scribbler core which houses the majority of the functionality
2. cli - The scribbler cli for accessing the functionality in the core.
3. loaders/npm - The NPM plugin
4. loaders/typescript - The Typescript plugin

## Getting Started

This uses `bun` for a more streamlines developer experience with typescript.  To install, visit https://bun.sh/. 

To install dependencies 

```bash
bun install
```

To run:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.0.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
