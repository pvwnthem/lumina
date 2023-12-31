import { Parser } from "./src/parser";
import { evaluate } from "./src/interpreter";
import Environment from "./lib/runtime/environment";
import { MAKE_BOOLEAN, MAKE_NULL, MAKE_NUMBER } from "./src/macros";

async function main () {
    const parser = new Parser();
    const env = new Environment();
    env.define("true", MAKE_BOOLEAN(true), true);
    env.define("false", MAKE_BOOLEAN(false), true);
    env.define("null", MAKE_NULL(), true)
    
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
            console.log(ast)
            const result = evaluate(ast, env);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    }
}

main();