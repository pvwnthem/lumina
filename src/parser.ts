import * as AST from './ast';
import { tokenize } from './lexer';
import { TokenT } from './types/Token.type';
import { TokenE } from './types/TokenE.enum';

export class Parser {   
    private tokens: TokenT[] = [];

    private notEOF (): boolean {
        return this.tokens[0].type != TokenE.EOF;
    }

    private at (): TokenT {
        return this.tokens[0] as TokenT;
    }

    private consume (): TokenT {
        return this.tokens.shift() as TokenT;
    }

    public produceAST (input: string): AST.ProgramT {

        this.tokens = tokenize(input);

        const program: AST.ProgramT = {
            type: "Program",
            body: []
        }

        while (this.notEOF()) {
            program.body.push(this.parseStatement());
        }

        return program;
    }

    private parseStatement (): AST.StatementT {
        return this.parseExpression();
    }

    private parseExpression (): AST.ExpressionT {
        return this.parsePrimary();
    }

    private parsePrimary (): AST.ExpressionT {
        switch (this.at().type) {
            case TokenE.Identifier:
                return { type: "Identifier", symbol: this.consume().value } as AST.IdentifierT;
            case TokenE.Number:
                return { type: "NumberLiteral", value: parseFloat(this.consume().value) } as AST.NumberLiteralT;
            default:
                throw new Error(`Unexpected token: ${this.at().value}`);
        }
    }
}