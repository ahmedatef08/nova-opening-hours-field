<template>
    <table class="openingHours weekTable table-default w-full">
        <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                <table-header :colspan="editable ? 3 : 2">
                    {{ __("Week") }}
                </table-header>
            </tr>
        </thead>
        <tbody>
            <tr v-for="day in week" :key="day.day" class="group">
                <table-column>
                    {{ __(capitalizeFirstLetter(day.day)) }}
                </table-column>
                <table-column>
                    <div v-if="Object.values(day.intervals).length">
                        <div
                            v-for="(interval, index) in day.intervals"
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
                                            'week',
                                            day.day,
                                            index,
                                            $event,
                                        )
                                    "
                                    @removeInterval="
                                        $emit(
                                            'removeInterval',
                                            'week',
                                            day.day,
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
                    <div v-else :class="{ closed: editable }">
                        {{ __("Closed") }}
                    </div>
                </table-column>
                <table-column v-if="editable" class="text-right">
                    <div class="actionButtons">
                        <add-button
                            @click.prevent="$emit('addInterval', 'week', day.day)"
                        />
                        <span v-if="Object.values(day.intervals).length">
                            <remove-button
                                @click.prevent="
                                    $emit('removeAllIntervals', 'week', day.day)
                                "
                            />
                        </span>
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
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import {
    doctorOptionsProp,
    editableProp,
    useTextInputsProp,
    weekProp,
} from "../src/props";
import { capitalizeFirstLetter } from "../src/func";

export default {
    components: {
        AddButton,
        RemoveButton,
        IntervalInput,
        TableColumn,
        TableHeader,
    },

    props: {
        ...weekProp,
        ...editableProp,
        ...useTextInputsProp,
        ...doctorOptionsProp,
    },

    emits: [
        "updateInterval",
        "removeInterval",
        "addInterval",
        "removeAllIntervals",
    ],

    methods: {
        capitalizeFirstLetter,
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
