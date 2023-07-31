import Environment from "../lib/runtime/environment";
import { NumberValue, Value } from "../lib/runtime/values";
import { AssignmentT, BinaryExpressionT, DeclarationT, ExpressionT, IdentifierT, NumberLiteralT, ProgramT, StatementT } from "./ast";
import { MAKE_NULL } from "./macros";

export function evaluateProgram (program: ProgramT, env: Environment): Value {
    let result: Value = MAKE_NULL();

    for (const statement of program.body) {
        result = evaluate(statement, env);
    }

    return result;
}

export function evaluateAssignment (assignment: AssignmentT, env: Environment): Value {
    if (assignment.assignee.type !== "Identifier") {
        throw new Error("Invalid assignment!");
    }
    const value = evaluate(assignment.value, env);
    const assignee = assignment.assignee as IdentifierT;

    // type check
    if (value.type !== env.lookup(assignee.symbol)?.type) {
        throw new Error("Type mismatch!");
    }

    env.assign(assignee.symbol, value);

    return value;
}

export function evaluateBinaryExpressionNumber (operator: string, left: NumberValue, right: NumberValue): Value {
    switch (operator) {
        case "+":
            return { type: "number", value: left.value + right.value } as NumberValue;
        case "-":
            return { type: "number", value: left.value - right.value } as NumberValue;
        case "*":
            return { type: "number", value: left.value * right.value } as NumberValue;
        case "/":
            return { type: "number", value: left.value / right.value } as NumberValue;
        case "%":
            return { type: "number", value: left.value % right.value } as NumberValue;
        default:
            throw new Error("Not implemented yet!");
    }
}

export function evaluateVariableDeclaration (declaration: DeclarationT, env: Environment): Value {
    const value = declaration.value 
        ? evaluate(declaration.value as ExpressionT, env)
        : MAKE_NULL();

    return env.define(declaration.identifier, value, declaration.constant);
}

export function evaluateIdentifier (identifier: IdentifierT, env: Environment): Value {
    const value = env.lookup(identifier.symbol);
    if (!value) {
        throw new Error("Variable not found!");
    }

    return value;
}

export function evaluateBinaryExpression (binop: BinaryExpressionT, env: Environment): Value {
    const left = evaluate(binop.left, env);
    const right = evaluate(binop.right, env);

    if (left.type !== right.type) {
        throw new Error("Type mismatch!");
    }

    if (left.type === "number" && right.type === "number") {
        return evaluateBinaryExpressionNumber(binop.operator, left as NumberValue, right as NumberValue);
    }

    return MAKE_NULL();
}

export function evaluate (ast: StatementT, env: Environment): Value {
    switch (ast.type) {
        case "NumberLiteral":
            return { value : ((ast as NumberLiteralT).value), type: "number" } as NumberValue;
        case "BinaryExpression":
            return evaluateBinaryExpression(ast as BinaryExpressionT, env);
        case "Program":
            return evaluateProgram(ast as ProgramT, env);
        case "Identifier":
            return evaluateIdentifier(ast as IdentifierT, env);
        case "Declaration":
            return evaluateVariableDeclaration(ast as DeclarationT, env);
        case "Assignment":
            return evaluateAssignment(ast as AssignmentT, env);
        default:
            throw new Error("Not implemented yet!");
    }
}