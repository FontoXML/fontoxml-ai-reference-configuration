# Fonto Editor AI reference configuration

This is a reference configuration for integrating an AI chatbot in your editor.

## How to integrate

Follow the following steps to integrate this package in your Fonto Editor instance:

1. Add this package to the `packages` directory of your editor. You can do that by copying it there or by adding this repository as a Git submodule.
1. Add this package to the list of dependencies in your editor's `config/fonto-manifest.json` file by adding this line to it: `"fontoxml-ai-reference-configuration": "packages/fontoxml-ai-reference-configuration",`
1. Add the stubbed CMS endpoint to your dev-cms by adding it to your editor's `dev-cms/configureDevCms.js` file. [Read more on how to do that here](https://documentation.fontoxml.com/latest/development-server-4fe6e4d66c2a#id-d888176e-fe63-0887-b0cb-be25beea416d).

## CMS endpoints

This reference configuration uses only one custom CMS endpoint: `/ai-assistant/generate`.

The endpoint expects the following parameters:

| Parameter type | Content type     |
| -------------- | ---------------- |
| body           | application/json |

### Body

| parameter      | required | type        | description                                                                                                                   |
| -------------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| context        | yes      | Context     | The context of this call.                                                                                                     |
| prompt         | yes      | string      | The prompt sent to the AI.                                                                                                    |
| contextContent | yes      | string      | The content, as a string, to serve as context for the prompt.                                                                 |
| history        | yes      | AiHistory[] | The history of previously sent prompts. Refer to the types.ts file in this repository for more information on this data type. |
