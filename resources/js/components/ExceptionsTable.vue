<template>
    <table class="openingHours exceptionsTable table-default mt-6 w-full">
        <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                <table-header colspan="2">
                    {{ __("Exceptions") }}
                </table-header>
                <table-header v-if="editable" class="text-right">
                    <add-button @click.prevent="$emit('addException')" />
                </table-header>
            </tr>
        </thead>
        <tbody>
            <tr v-for="exception in exceptions" class="group">
                <table-column>
                    <div v-if="editable">
                        <date-input
                            :date-prop="exception.date"
                            :use-text-inputs="useTextInputs"
                            @updateDate="
                                $emit('renameException', exception.date, $event)
                            "
                        />
                    </div>
                    <div v-else>{{ exception.date }}</div>
                </table-column>
                <table-column>
                    <div v-if="Object.values(exception.intervals).length">
                        <div
                            v-for="(interval, index) in exception.intervals"
                            :key="interval.key"
                        >
                            <div v-if="editable">
                                <interval-input
                                    :interval-prop="interval.interval"
                                    :doctor-options="doctorOptions"
                                    :use-text-inputs="useTextInputs"
                                    @updateInterval="
                                        $emit(
                                            'updateInterval',
                                            'exceptions',
                                            exception.date,
                                            index,
                                            $event,
                                        )
                                    "
                                    @removeInterval="
                                        $emit(
                                            'removeInterval',
                                            'exceptions',
                                            exception.date,
                                            index,
                                        )
                                    "
                                />
                            </div>
                            <div v-else>
                                <div>{{ interval.interval.time }}</div>
                                <div
                                    v-if="getDoctorLabels(interval.interval.doctor_ids).length"
                                    class="doctorList"
                                >
                                    {{ getDoctorLabels(interval.interval.doctor_ids).join(', ') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>{{ __("Closed") }}</div>
                </table-column>
                <table-column v-if="editable" class="text-right">
                    <div class="actionButtons">
                        <add-button
                            @click.prevent="
                                $emit('addInterval', 'exceptions', exception.date)
                            "
                        />
                        <remove-button
                            @click.prevent="
                                $emit('removeException', exception.date)
                            "
                        />
                    </div>
                </table-column>
            </tr>
        </tbody>
    </table>
</template>

<script>
import AddButton from "./AddButton";
import RemoveButton from "./RemoveButton";
import IntervalInput from "./IntervalInput";
import DateInput from "./DateInput";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import {
    doctorOptionsProp,
    editableProp,
    exceptionsProp,
    useTextInputsProp,
} from "../src/props";

export default {
    components: {
        AddButton,
        RemoveButton,
        IntervalInput,
        DateInput,
        TableColumn,
        TableHeader,
    },

    props: {
        ...exceptionsProp,
        ...editableProp,
        ...useTextInputsProp,
        ...doctorOptionsProp,
    },

    emits: [
        "updateInterval",
        "removeInterval",
        "addInterval",
        "removeException",
        "addException",
        "renameException",
    ],

    methods: {
        getDoctorLabels(doctorIds) {
            if (!Array.isArray(doctorIds) || !doctorIds.length) {
                return [];
            }

            const optionsMap = new Map(
                (this.doctorOptions || []).map((option) => [
                    String(option.value),
                    option.label,
                ]),
            );

            return doctorIds
                .map((doctorId) => optionsMap.get(String(doctorId)))
                .filter((label) => Boolean(label));
        },
    },
};
</script>

<style scoped>
.actionButtons {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.doctorList {
    color: rgba(var(--colors-gray-500), 1);
    font-size: 0.75rem;
    line-height: 1rem;
    margin-top: 0.25rem;
}
</style>
