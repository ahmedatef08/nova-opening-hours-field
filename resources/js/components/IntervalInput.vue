<template>
    <div class="interval">
        <time-input
            :time-prop="from"
            :use-text-inputs="useTextInputs"
            @blur="syncTime"
            v-model="from"
        />
        -
        <time-input
            :time-prop="to"
            :use-text-inputs="useTextInputs"
            @blur="syncTime"
            v-model="to"
        />
        <select
            v-if="doctorOptions.length"
            v-model="slot.doctor_ids"
            multiple
            class="doctorIds ml-2"
        >
            <option
                v-for="doctorOption in doctorOptions"
                :key="doctorOption.value"
                :value="doctorOption.value"
            >
                {{ doctorOption.label }}
            </option>
        </select>
        <span class="ml-2">
            <remove-button @click.prevent="$emit('removeInterval')" />
        </span>
    </div>
</template>

<script>
import { doctorOptionsProp, useTextInputsProp } from "../src/props";
import { normalizeSlot } from "../src/func";
import RemoveButton from "./RemoveButton";
import TimeInput from "./TimeInput";

export default {
    components: { RemoveButton, TimeInput },

    props: {
        intervalProp: [String, Object],
        ...useTextInputsProp,
        ...doctorOptionsProp,
    },

    emits: ["updateInterval", "removeInterval"],

    data: function () {
        let slot = normalizeSlot(this.intervalProp);
        let [from, to] = this.getFromTo(slot.time);

        return {
            slot,
            from,
            to,
        };
    },

    methods: {
        syncTime() {
            this.slot = {
                ...this.slot,
                time: [this.from, this.to].join("-"),
            };
        },

        getFromTo(time) {
            if (!time || typeof time !== "string") {
                return ["", ""];
            }

            let [from, to] = time.split("-");

            return [from || "", to || ""];
        },
    },

    watch: {
        intervalProp(value) {
            let slot = normalizeSlot(value);
            let [from, to] = this.getFromTo(slot.time);
            this.slot = slot;
            this.from = from;
            this.to = to;
        },

        slot: {
            handler(value) {
                this.$emit("updateInterval", value);
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.interval {
    margin: 10px 0;
}

.doctorIds {
    min-width: 10rem;
}
</style>
