import { Parser } from "./src/parser";
import { evaluate } from "./src/interpreter";

async function main () {
    const parser = new Parser();
    
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
            const ast = parser.produceAST(input);

            const result = evaluate(ast);
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    }
}

main();