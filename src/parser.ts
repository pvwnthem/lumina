import Environment from '../lib/runtime/environment';
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

    private expect (type: TokenE, message: string): TokenT {
        const prev = this.tokens.shift() as TokenT;
        if (!prev || prev.type != type) {
            throw new Error(message);
        }

        return prev;
    }

    public produceAST (input: string, env: Environment): AST.ProgramT {

        this.tokens = tokenize(input, env);

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

        switch (this.at().type) {
            case TokenE.Const:
            case TokenE.Int:
                return this.parseDeclaration();
            default:
                return this.parseExpression();
        }
    }

    private parseDeclaration (): AST.DeclarationT {
    const token = this.at();
    if (token.type !== TokenE.Int && token.type !== TokenE.Const) {
        throw new Error("Expected type keyword");
    }

    const constant = token.type === TokenE.Const;
    if (constant) {
        this.consume();
    }

    this.expect(TokenE.Int, "Expected type keyword");

    const identifier = this.expect(TokenE.Identifier, "Expected identifier").value;

    let value: AST.ExpressionT | undefined = undefined;

    if (this.at().type === TokenE.Equals) {
        this.consume();
        value = this.parseExpression();
    }

    this.expect(TokenE.Semicolon, "Expected semicolon");
    return {
        type: "Declaration",
        constant,
        identifier,
        value
    } as AST.DeclarationT;
}

    private parseExpression (): AST.ExpressionT {
        return this.parseAdditiveExpression();
    }

    private parseAdditiveExpression (): AST.ExpressionT {
        let expression = this.parseMultiplicativeExpression();

        while (this.at().type === TokenE.BinaryOperator && (this.at().value === "+" || this.at().value === "-")) {
            const operator = this.consume().value;
            const right = this.parseMultiplicativeExpression();

            expression = {
                type: "BinaryExpression",
                operator,
                left: expression,
                right
            } as AST.BinaryExpressionT;
        }

        return expression;
    }

    private parseMultiplicativeExpression (): AST.ExpressionT {
        let expression = this.parsePrimary();

        while (this.at().type === TokenE.BinaryOperator && (this.at().value === "*" || this.at().value === "/" || this.at().value === "%")) {
            const operator = this.consume().value;
            const right = this.parsePrimary();

            expression = {
                type: "BinaryExpression",
                operator,
                left: expression,
                right
            } as AST.BinaryExpressionT;
        }

        return expression;
    }

    private parsePrimary (): AST.ExpressionT {
        switch (this.at().type) {
            case TokenE.Identifier:
                return { type: "Identifier", symbol: this.consume().value } as AST.IdentifierT;
            case TokenE.Number:
                return { type: "NumberLiteral", value: parseFloat(this.consume().value) } as AST.NumberLiteralT;
            case TokenE.OpenParenthesis:
                this.consume();
                const expression = this.parseExpression();
                this.expect(
                    TokenE.CloseParenthesis,
                    `Expected closing parenthesis, got ${this.at().value}`
                )
                return expression;
            
            default:
                throw new Error(`Unexpected token: ${this.at().value}`);
        }
    }
}