import { Value } from "./values";

export default class Environment {
    private parent?: Environment;
    private values: Map<string, Value> = new Map();
    private constants: Set<string>;

    constructor (parent?: Environment) {
        this.parent = parent;
        this.values = new Map();
        this.constants = new Set();
    }

    public define (name: string, value: Value, constant: boolean): Value {
        if (this.values.has(name)) {
            throw new Error(`Variable ${name} already defined!`);
        }

        this.values.set(name, value);

        if (constant) {
            this.constants.add(name);
        }
        return value;
    }

    public assign (name: string, value: Value): Value {
        const env = this.resolve(name);
        if (env.constants.has(name)) {
            throw new Error(`Cannot assign to constant ${name}!`);
        } else {
            env.values.set(name, value);
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