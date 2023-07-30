import { Parser } from "./src/parser";

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
            console.log(JSON.stringify(ast, null, 4));
        } catch (e) {
            console.log(e);
        }
    }
}

main();