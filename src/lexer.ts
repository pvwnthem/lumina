import { KEYWORDS } from "../lib/keywords";
import Environment from "../lib/runtime/environment";
import { TokenT } from "./types/Token.type";
import { TokenE } from "./types/TokenE.enum";

export function token (value: string, type: TokenE) {
    return {
        value,
        type
    }
}

export function isAlpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
  }
  

export function isSkippable(str: string) {
    return str == " " || str == "\n" || str == "\t";
  }

export function isInt(str: string) {
    const c = str.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
  }

  
export function tokenize (input: string, env: Environment): TokenT[] {
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
            case "%":
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
                        
                        if (typeof reserved === "number") {
                            tokens.push(token(identifier, reserved));
                        } else if (env.lookup(identifier) != undefined) {
                            tokens.push(token(identifier, TokenE.Identifier));
                        } else {
                            throw new Error(`Unexpected identifier: ${identifier}`);
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
/*
for (const token of tokenize("int x = 2 + 2;")) {
    console.log(token);
}
*/