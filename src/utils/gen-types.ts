import { readFileSync, writeFileSync } from "fs";
import { load } from "js-yaml";
import openapiTS, { SchemaObject } from "openapi-typescript";

const generateTypes = async () => {
  try {
    const yaml = readFileSync("openapi.yaml", "utf8");
    const input = load(yaml);
    console.log("woooo");
    const output = openapiTS(input as any, {

      formatter: (node: SchemaObject) => {
        // if (node.format === "date-time") {
        //   return "Date | string"; // return the TypeScript “Date” type, as a string
        // }
        if (node.format === "ObjectId") {
          console.log("awoooooo");
          return "string";
        }
      },
    });

    writeFileSync("./src/types/gen.ts", output);
    console.log("Types generated successfully");
  } catch (error) {
    console.error("Error generating types", error);
  }
};

generateTypes();
