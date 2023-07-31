import { Value } from "./values";

export default class Environment {
    private parent?: Environment;
    private values: Map<string, Value> = new Map();

    constructor (parent?: Environment) {
        this.parent = parent;
        this.values = new Map();
    }

    public define (name: string, value: Value): Value {
        if (this.values.has(name)) {
            throw new Error(`Variable ${name} already defined!`);
        }

        this.values.set(name, value);
        return value;
    }

    public assign (name: string, value: Value): Value {
        if (this.values.has(name)) {
            this.values.set(name, value);
            return value;
        }

        if (this.parent) {
            return this.parent.assign(name, value);
        }

        throw new Error(`Variable ${name} not defined!`);
    }

    public lookup (name: string): Value {
        const env = this.resolve(name);
        return env.values.get(name) as Value;
    }

    public resolve (name: string): Environment {
        if (this.values?.has(name)) {
            return this;
        }

        if (this.parent) {
            return this.parent.resolve(name);
        }

        throw new Error(`Variable ${name} not defined!`);
    }
}