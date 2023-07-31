import Environment from "../lib/runtime/environment";
import { NullValue, NumberValue, Value } from "../lib/runtime/values";
import { BinaryExpressionT, IdentifierT, NumberLiteralT, ProgramT, StatementT } from "./ast";
import { TokenE } from "./types/TokenE.enum";

export function evaluateProgram (program: ProgramT, env: Environment): Value {
    let result: Value = { type: "null", value: "null" } as NullValue;

    for (const statement of program.body) {
        result = evaluate(statement, env);
    }

    return result;
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

function evaluateIdentifier (identifier: IdentifierT, env: Environment): Value {
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

    return { type: "null", value: "null" } as NullValue;
}

export function evaluate (ast: StatementT, env: Environment): Value {
    switch (ast.type) {
        case "NumberLiteral":
            return { value : ((ast as NumberLiteralT).value), type: "number" } as NumberValue;
        case "BinaryExpression":
            return evaluateBinaryExpression(ast as BinaryExpressionT, env);
        case "Program":
            return evaluateProgram(ast as ProgramT, env);
        case "NullLiteral":
            return { value: "null", type: "null" } as NullValue;
        case "Identifier":
            return evaluateIdentifier(ast as IdentifierT, env);
        default:
            throw new Error("Not implemented yet!");
    }
}