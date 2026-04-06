import { EMPTY_WEEK } from "./const";
import pick from 'lodash/pick';

export function getWeekData(openingHoursData) {
    let week = {
        ...EMPTY_WEEK,
        ...pick(openingHoursData, Object.keys(EMPTY_WEEK)),
    }

    for (let day of Object.keys(EMPTY_WEEK)) {
        week[day] = normalizeSlots(week[day])
    }

    return week
}

export function getExceptionsData(openingHoursData) {
    let exceptions = openingHoursData && openingHoursData['exceptions']
        ? Object.keys(openingHoursData['exceptions']).length ? openingHoursData['exceptions'] : {}
        : {}

    let normalizedExceptions = {}
    for (let [date, intervals] of Object.entries(exceptions)) {
        normalizedExceptions[date] = normalizeSlots(intervals)
    }

    return normalizedExceptions
}

export function normalizeSlot(slot) {
    if (typeof slot === 'string') {
        return {
            time: slot,
            doctor_ids: [],
        }
    }

    if (slot && typeof slot === 'object') {
        return {
            time: typeof slot.time === 'string' ? slot.time : '',
            doctor_ids: normalizeDoctorIds(slot.doctor_ids),
        }
    }

    return {
        time: '',
        doctor_ids: [],
    }
}

export function normalizeSlots(slots) {
    if (!Array.isArray(slots)) return []

    return slots.map((slot) => normalizeSlot(slot))
}

export function getRandomTimeSlot() {
    return {
        time: getRandomTimeInterval(),
        doctor_ids: [],
    }
}

export function normalizeDoctorOptions(options) {
    if (Array.isArray(options)) {
        return options
            .map((option) => {
                if (option && typeof option === 'object') {
                    if (Object.prototype.hasOwnProperty.call(option, 'value') && Object.prototype.hasOwnProperty.call(option, 'label')) {
                        return {
                            value: option.value,
                            label: option.label,
                        }
                    }

                    if (Object.prototype.hasOwnProperty.call(option, 'id') && Object.prototype.hasOwnProperty.call(option, 'name')) {
                        return {
                            value: option.id,
                            label: option.name,
                        }
                    }
                }

                return null
            })
            .filter((option) => option !== null)
    }

    if (options && typeof options === 'object') {
        return Object.entries(options).map(([value, label]) => ({ value, label }))
    }

    return []
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase()
}

export function getTodayDate() {
    return sliceDate(new Date())
}

function sliceDate(date) {
    return date.toISOString().slice(0, 10)
}

export function getRandomDate() {
    let date = new Date()
    date.setDate(date.getDate() + Math.floor(Math.random() * 365))

    return sliceDate(date)
}

// function getRandomTime() {
//     let hour = Math.floor(Math.random() * 24)
//     let min = 0
//
//     return padStartZero(hour) + ':' + padStartZero(min)
// }

function padStartZero(value) {
    return value.toString().padStart(2, '0')
}

export function getRandomTimeInterval() {
    let fromHour = Math.floor(Math.random() * 24)   // 0-23
    let toHour = fromHour + Math.floor(Math.random() * (24 - fromHour))

    return padStartZero(fromHour) + ':00-' + padStartZero(toHour) + ':00'
}

export function randomString() {
    return Math.random().toString(36).substr(2, 5)
}

function normalizeDoctorIds(doctorIds) {
    if (!Array.isArray(doctorIds)) return []

    return doctorIds.filter((doctorId) => doctorId !== null && doctorId !== undefined && doctorId !== '')
}
