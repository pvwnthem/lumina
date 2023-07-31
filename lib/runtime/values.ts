export type ValueT = "null" | "number" | "boolean";

export interface Value {
    type: ValueT;
}

export interface NullValue extends Value {
    type: "null";
    value: null;
}

export interface NumberValue extends Value {
    type: "number";
    value: number;
}

export interface BooleanValue extends Value {
    type: "boolean";
    value: boolean;
}