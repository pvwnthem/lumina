import { NullValue, NumberValue, Value } from "../lib/runtime/values";
import { BinaryExpressionT, NumberLiteralT, ProgramT, StatementT } from "./ast";

export function evaluateProgram (program: ProgramT): Value {
    let result: Value = { type: "null", value: "null" } as NullValue;

    for (const statement of program.body) {
        result = evaluate(statement);
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

export function evaluateBinaryExpression (binop: BinaryExpressionT): Value {
    const left = evaluate(binop.left);
    const right = evaluate(binop.right);

    if (left.type !== right.type) {
        throw new Error("Type mismatch!");
    }

    if (left.type === "number" && right.type === "number") {
        return evaluateBinaryExpressionNumber(binop.operator, left as NumberValue, right as NumberValue);
    }

    return { type: "null", value: "null" } as NullValue;
}

export function evaluate (ast: StatementT): Value {
    switch (ast.type) {
        case "NumberLiteral":
            return { value : ((ast as NumberLiteralT).value), type: "number" } as NumberValue;
        case "BinaryExpression":
            return evaluateBinaryExpression(ast as BinaryExpressionT);
        case "Program":
            return evaluateProgram(ast as ProgramT);
        case "NullLiteral":
            return { value: "null", type: "null" } as NullValue;
        default:
            throw new Error("Not implemented yet!");
    }
}