export type NodeT = "Program" | "NumberLiteral" | "Identifier" | "BinaryExpression" | "Declaration" | "Assignment";

export interface StatementT {
    type: NodeT;    
}

export interface ProgramT extends StatementT {
    type: "Program";
    body: StatementT[];
}

export interface ExpressionT extends StatementT {}

export interface BinaryExpressionT extends ExpressionT {
    type: "BinaryExpression";
    left: ExpressionT;
    operator: string;
    right: ExpressionT;
}

export interface IdentifierT extends ExpressionT {
    type: "Identifier";
    symbol: string;
}

export interface NumberLiteralT extends ExpressionT {
    type: "NumberLiteral";
    value: number;
}

export interface DeclarationT extends StatementT {
    type: "Declaration";
    constant: boolean;
    identifier: string;
    value?: ExpressionT;
}

export interface AssignmentT extends StatementT {
    type: "Assignment";
    assignee: ExpressionT;
    value: ExpressionT;
}