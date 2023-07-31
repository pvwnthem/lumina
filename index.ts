import { Parser } from "./src/parser";
import { evaluate } from "./src/interpreter";
import Environment from "./lib/runtime/environment";
import { NumberValue } from "./lib/runtime/values";

async function main () {
    const parser = new Parser();
    const env = new Environment();
    env.define("x", { type: "number", value: 10 } as NumberValue);
    
    while (true) {
        const input = await new Promise<string>(resolve => {
            process.stdout.write("> ");
            process.stdin.once("data", (data: Buffer) => {
                resolve(data.toString().trim());
            });
        });

        if (input === "exit") {
            break;
        }

        try {
            const ast = parser.produceAST(input, env);
            const result = evaluate(ast, env);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    }
}

main();