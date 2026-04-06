import { getExceptionsData, getWeekData, normalizeSlot, randomString } from "./func";

export var WeekMixin = {
    data: function () {
        return {
            week: getWeekData(this.field.value),
        }
    },
    computed: {
        normalizedWeek() {
            let res = []
            for (let [day, intervals] of Object.entries(this.week)) {
                res.push({
                    day: day,
                    intervals: normalizeIntervals(intervals),
                })
            }

            return res
        },
    },
}

export var ExceptionsMixin = {
    data: function () {
        return {
            exceptions: getExceptionsData(this.field.value),
        }
    },
    computed: {
        normalizedExceptions() {
            let res = []
            for (let [date, intervals] of Object.entries(this.exceptions)) {
                res.push({
                    date: date,
                    intervals: normalizeIntervals(intervals),
                })
            }

            return res
        },
    },
}

function normalizeIntervals(intervals) {
    let res = []

    for (let interval of intervals || []) {
        res.push({
            key: randomString(),
            interval: normalizeSlot(interval),
        })
    }

    return res
}
