<template>
    <div class="interval">
        <time-input
            :time-prop="from"
            :use-text-inputs="useTextInputs"
            @blur="syncTime"
            v-model="from"
        />
        <span class="intervalSeparator">-</span>
        <time-input
            :time-prop="to"
            :use-text-inputs="useTextInputs"
            @blur="syncTime"
            v-model="to"
        />
        <div v-if="doctorOptions.length" class="doctorPicker">
            <div class="doctorPickerTitle">Doctors</div>
            <div class="doctorIds">
                <label
                    v-for="doctorOption in doctorOptions"
                    :key="doctorOption.value"
                    class="doctorOption"
                >
                    <input
                        v-model="slot.doctor_ids"
                        type="checkbox"
                        :value="doctorOption.value"
                    />
                    <span>{{ doctorOption.label }}</span>
                </label>
            </div>
        </div>
        <span class="intervalRemove">
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.intervalSeparator {
    line-height: 1;
}

.doctorPicker {
    min-width: 12rem;
}

.doctorPickerTitle {
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #374151;
}

.doctorIds {
    min-width: 11rem;
    max-height: 7rem;
    overflow-y: auto;
    padding: 0.375rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.dark .doctorIds {
    border-color: #4b5563;
    background-color: #111827;
}

.doctorOption {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.8125rem;
    color: #111827;
    cursor: pointer;
}

.dark .doctorPickerTitle,
.dark .doctorOption {
    color: #e5e7eb;
}

.intervalRemove {
    display: inline-flex;
    align-items: center;
}
</style>
