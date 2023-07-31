import { BooleanValue, NullValue, NumberValue } from "../lib/runtime/values";

export function MAKE_NUMBER(value = 0): NumberValue {
    return { type: "number", value };
}

export function MAKE_NULL(): NullValue {
    return { type: "null", value: null} as NullValue;
}

export function MAKE_BOOLEAN(value: boolean): BooleanValue {
    return { type: "boolean", value } as BooleanValue;
}
