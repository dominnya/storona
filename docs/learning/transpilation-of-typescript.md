# Transpilation Of TypeScript

## Overview

Under the hood Storona uses [jiti](https://github.com/unjs/jiti) to transpile TypeScript/JSX files on-the-fly. This allows developers to write code in TypeScript and use the latest ECMAScript features without worrying about bundler configuration or how to transpile the code.

> [!IMPORTANT]
> Storona will not transpile the code if given runtime is [Bun](https://bun.sh/docs/runtime/typescript). This guide is only applicable for the [Node.js](https://nodejs.org/en) runtime.

## Configuration

Storona does not provide any configuration for the transpilation process. However, some `package.json` or `tsconfig.json` fields can be used to configure the transpilation process.

### CJS/ESM Output

Jiti automatically detects the module format based on the `type` field in your `package.json` file. The `type` field can be set to `module` or `commonjs` to specify the output.

Storona, similar to Node.js, defaults to `commonjs` if the `type` field is not set.

::: code-group

```json [package.json]
{
  "type": "module"
}
```

:::

### JSX Support

To configure JSX transpilation process, you can use the [`jsx` field in the `tsconfig.json`](https://www.typescriptlang.org/tsconfig/#jsx) file to specify the output.

Storona defaults to `react` if the `jsx` field is not set.

::: code-group

```json [tsconfig.json]
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

:::
