export type ValueT = "null" | "number";

export interface Value {
    type: ValueT;
}

export interface NullValue extends Value {
    type: "null";
    value: "null";
}

export interface NumberValue extends Value {
    type: "number";
    value: number;
}