import type { PlopTypes } from "@turbo/gen";
import { name } from "../../package.json";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

// eslint-disable-next-line import/no-default-export -- Turbo generators require default export
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator("react-component", {
    description: "Adds a new react component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "components/{{kebabCase name}}/index.tsx",
        templateFile: "templates/component.hbs",
      },
      {
        type: "append",
        path: "index.tsx",
        pattern: /(?<insertion>\/\/ component exports)/g,
        template: 'export * from "./components/{{kebabCase name}}/{{pascalCase name}}";',
      },
    ],
  });
}
