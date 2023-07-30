import { Token } from "./types/Token.type";
import { TokenE } from "./types/TokenE.enum";

export function token (value: string, type: TokenE) {
    return {
        value,
        type
    }
}

export function tokenize (input: string) {
    const tokens = new Array<Token>();
    const source = input.split("");

    while ( source.length > 0 ) {
        switch ( source[0] ) {
            
        }
    }
}