export default class Snowflake {
    private readonly value: bigint;

    constructor(value: bigint) {
        this.value = value;
    }

    get timestamp(): Date {
        console.log("funny asf")
        console.log(this.value);
        console.log(this.value >> Snowflake.TIMESTAMP_SHIFT);
        return new Date(Number(
            ((this.value >> Snowflake.TIMESTAMP_SHIFT) +
            Snowflake.VIBRA_EPOCH) * BigInt(1000)
        ));
    }

    static VIBRA_EPOCH = BigInt(164038400);

    static NODE_ID_BITS = BigInt(5);
    static CLUSTER_ID_BITS = BigInt(5);
    static SEQUENCE_BITS = BigInt(12);

    static TIMESTAMP_SHIFT = BigInt(Snowflake.NODE_ID_BITS + Snowflake.CLUSTER_ID_BITS + Snowflake.SEQUENCE_BITS);
    static NODE_SHIFT = BigInt(Snowflake.CLUSTER_ID_BITS + Snowflake.SEQUENCE_BITS);

    static MASK_NODE_ID = (BigInt(1) << Snowflake.NODE_ID_BITS) - BigInt(1) << Snowflake.NODE_SHIFT;
    static MASK_CLUSTER_ID = (BigInt(1) << Snowflake.CLUSTER_ID_BITS) - BigInt(1) << Snowflake.SEQUENCE_BITS;
    static MASK_SEQUENCE = (BigInt(1) << Snowflake.SEQUENCE_BITS) - BigInt(1);
}
