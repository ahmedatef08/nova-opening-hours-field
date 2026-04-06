<template>
    <panel-item :field="field">
        <template #value>
            <week-table :week="normalizedWeek" :doctor-options="doctorOptions"/>
            <exceptions-table
                v-if="showExceptionsTable"
                :exceptions="normalizedExceptions"
                :doctor-options="doctorOptions"
            />
        </template>
    </panel-item>
</template>

<script>
import WeekTable from "../WeekTable";
import ExceptionsTable from "../ExceptionsTable";
import {ExceptionsMixin, WeekMixin} from "../../src/mixins";
import { normalizeDoctorOptions } from "../../src/func";

export default {
    components: {WeekTable, ExceptionsTable},

    mixins: [WeekMixin, ExceptionsMixin],

    props: ['resource', 'resourceName', 'resourceId', 'field'],

    computed: {
        doctorOptions() {
            return normalizeDoctorOptions(this.field.doctorOptions)
        },

        showExceptionsTable() {
            return this.field.allowExceptions
                && Object.keys(this.normalizedExceptions).length
        },
    },
}
</script>
