import { KEYWORDS } from "./keywords";
import { TokenT } from "./types/Token.type";
import { TokenE } from "./types/TokenE.enum";

export function token (value: string, type: TokenE) {
    return {
        value,
        type
    }
}

export function isAlpha (char: string) {
    return char.length > 0 &&  char.toUpperCase() !== char.toLowerCase();
}

function isInt(char: string) {
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return char && char.length > 0 && char[0].length > 0 && char[0].charCodeAt(0) >= bounds[0] && char[0].charCodeAt(0) <= bounds[1];
}
function isSkippable (char: string) {
    return char.length > 0 &&  char === " " || char === "\t" || char === "\n";
}

export function tokenize (input: string): TokenT[] {
    const tokens = new Array<TokenT>();
    const source = input.split("");

    while ( source.length > 0 ) {
        switch ( source[0] ) {
            case "(":
                tokens.push(token(source.shift()!, TokenE.OpenParenthesis));
                break;
            case ")":
                tokens.push(token(source.shift()!, TokenE.CloseParenthesis));
                break;
            case "=":
                tokens.push(token(source.shift()!, TokenE.Equals));
                break;
            case "+":
            case "-":
            case "*":
            case "/":
                tokens.push(token(source.shift()!, TokenE.BinaryOperator));
                break;
            case ";":
                tokens.push(token(source.shift()!, TokenE.Semicolon));
                break;
            default:
                if (source[0]) {
                    if (isInt(source[0])) {
                        let number = "";
    
                        while (isInt(source[0])) {
                            number += source.shift();
                        }
    
                        tokens.push(token(number, TokenE.Number));
                    } else if (isAlpha(source[0])) {
                        let identifier = "";
    
                        while (source.length > 0 && isAlpha(source[0])) {
                            identifier += source.shift();
                        }
    
                        const reserved = KEYWORDS[identifier];
    
                        if (reserved === undefined) {
                            tokens.push(token(identifier, TokenE.Identifier));
                        } else {
                            tokens.push(token(identifier, reserved));
                        }
                    } else if (isSkippable(source[0])) {
                        source.shift();
                    } else {
                        throw new Error(`Unexpected character: ${source[0]}`);
                    }
                    break;
                }
        }
    }

    tokens.push({type: TokenE.EOF, value: "EOF"});

    return tokens;
}

for (const token of tokenize("int x = 2 + 2;")) {
    console.log(token);
}