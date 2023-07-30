import * as AST from './ast';
import { tokenize } from './lexer';
import { TokenT } from './types/Token.type';
import { TokenE } from './types/TokenE.enum';

export class Parser {   
    private tokens: TokenT[] = [];

    private notEOF (): boolean {
        return this.tokens[0].type != TokenE.EOF;
    }

    public produceAST (input: string): AST.ProgramT {

        this.tokens = tokenize(input);

        const program: AST.ProgramT = {
            type: "Program",
            body: []
        }

        while (this.notEOF()) {}

        return program;
    }
}