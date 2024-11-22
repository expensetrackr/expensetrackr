import {
    INVALID,
    type ParseContext,
    type ParseInput,
    type ParseReturnType,
    ParseStatus,
    type RawCreateParams,
    ZodIssueCode,
    ZodParsedType,
    ZodType,
    type ZodTypeDef,
    addIssueToContext,
} from "zod";

export type ZodDecimalCheck =
    | { kind: "precision"; value: number; message?: string }
    | { kind: "wholeNumber"; value: number; message?: string }
    | { kind: "min"; value: number; inclusive: boolean; message?: string }
    | { kind: "max"; value: number; inclusive: boolean; message?: string }
    | { kind: "finite"; message?: string };

const zodDecimalKind = "ZodDecimal";

export interface ZodDecimalDef extends ZodTypeDef {
    checks: ZodDecimalCheck[];
    typeName: typeof zodDecimalKind;
    coerce: boolean;
}

const precisionRegex = /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/;

export class ZodDecimal extends ZodType<number, ZodDecimalDef, any> {
    _parse(input: ParseInput): ParseReturnType<number> {
        // detect decimal js object
        if (input.data !== null && typeof input.data === "object" && "toNumber" in input.data) {
            input.data = input.data.toNumber();
        }
        if (this._def.coerce) {
            input.data = Number(input.data);
        }

        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.number,
                received: ctx.parsedType,
            });
            return INVALID;
        }

        let ctx: undefined | ParseContext = undefined;
        const status = new ParseStatus();

        for (const check of this._def.checks) {
            if (check.kind === "precision") {
                const parts = input.data.toString().match(precisionRegex);
                const decimals = Math.max(
                    (parts[1] ? parts[1].length : 0) - (parts[2] ? parseInt(parts[2], 10) : 0),
                    0,
                );
                if (decimals > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.custom,
                        message: check.message,
                        params: {
                            precision: check.value,
                        },
                    });
                    status.dirty();
                }
            } else if (check.kind === "wholeNumber") {
                const wholeNumber = input.data.toString().split(".")[0];
                const tooLong = wholeNumber.length > check.value;

                if (tooLong) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.custom,
                        message: check.message,
                        params: {
                            wholeNumber: check.value,
                        },
                    });
                    status.dirty();
                }
            } else if (check.kind === "min") {
                const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            } else if (check.kind === "max") {
                const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            } else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
        }

        return { status: status.value, value: input.data };
    }

    static create = (params?: RawCreateParams & { coerce?: true }): ZodDecimal => {
        return new ZodDecimal({
            checks: [],
            typeName: zodDecimalKind,
            coerce: params?.coerce ?? false,
        });
    };

    protected setLimit(kind: "min" | "max", value: number, inclusive: boolean, message?: string): ZodDecimal {
        return new ZodDecimal({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message,
                },
            ],
        });
    }

    _addCheck(check: ZodDecimalCheck): ZodDecimal {
        return new ZodDecimal({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }

    lte(value: number, message?: string): ZodDecimal {
        return this.setLimit("max", value, true, message);
    }

    lt(value: number, message?: string): ZodDecimal {
        return this.setLimit("max", value, false, message);
    }
    max = this.lte;

    gt(value: number, message?: string): ZodDecimal {
        return this.setLimit("min", value, false, message);
    }
    gte(value: number, message?: string): ZodDecimal {
        return this.setLimit("min", value, true, message);
    }

    min = this.gte;

    precision(value: number, message?: string): ZodDecimal {
        return this._addCheck({
            kind: "precision",
            value,
            message,
        });
    }
    wholeNumber(value: number, message?: string): ZodDecimal {
        return this._addCheck({
            kind: "wholeNumber",
            value,
            message,
        });
    }

    get minValue() {
        let min: number | null = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            }
        }
        return min;
    }

    get maxValue() {
        let max: number | null = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return max;
    }

    positive(message?: string) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message,
        });
    }

    negative(message?: string) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message,
        });
    }

    nonpositive(message?: string) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message,
        });
    }

    nonnegative(message?: string) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message,
        });
    }

    finite(message?: string) {
        return this._addCheck({
            kind: "finite",
            message,
        });
    }

    safe(message?: string) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message,
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message,
        });
    }

    get isFinite() {
        let max: number | null = null,
            min: number | null = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite") {
                return true;
            } else if (ch.kind === "min") {
                if (min === null || ch.value > min) min = ch.value;
            } else if (ch.kind === "max") {
                if (max === null || ch.value < max) max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}

export const zodDecimal = ZodDecimal.create;
