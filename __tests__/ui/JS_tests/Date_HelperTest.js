import expect from "expect";
import timeSince, {
    dayIsDifferent,
    getDateParams,
    SHORT_MONTHS,
    UTCToLocalMonthDayString
} from '../../../app/javascript/helpers/date_helper'

const SECONDS_IN_LEAP_YEAR = 31622400

describe('Date helper provides the right string', () => {
    let back_then
    beforeEach(() => back_then = new Date())

    it ('should show the time since in years', () => {
        back_then.setYear(back_then.getFullYear() - 2)
        let since = timeSince(back_then)

        expect(since).toEqual("2 years ago")
    })

    it ('should show the time since in months', () => {
        back_then.setMonth(back_then.getMonth() - 2)
        let since = timeSince(back_then)

        expect(since).toEqual(expect.stringMatching(/5[9,8] days ago|2 months ago/))
    })

    it ('should show the time since in months when greater than one year but less than two', () => {
        back_then.setYear(back_then.getFullYear() - 1)
        let since = timeSince(back_then)

        expect(since).toEqual("12 months ago")
    })

    it ('should show the time since in days', () => {
        back_then.setDate(back_then.getDate() - 5)
        let since = timeSince(back_then)

        expect(since).toEqual(expect.stringMatching(/[45] days ago/))
    })

    it ('should show the time since in days up to 2 months', () => {
        let now = new Date(back_then)
        back_then.setMonth(now.getMonth() - 1)
        let since = timeSince(back_then)

        if (now.getMonth() === 2) {
            expect(since).toEqual(expect.stringMatching(/2[89] days ago/))
        } else {
            expect(since).toEqual(expect.stringMatching(/3[01] days ago/))
        }
    })

    it ('should show the time since in hours', () => {
        back_then.setHours(back_then.getHours() - 9)
        let since = timeSince(back_then)

        // time change breaks tests
        expect(since).toEqual(expect.stringMatching(/[789] hours ago/))
    })

    it ('should show the time since in hours up to 2 days', () => {
        // handle time change
        back_then.setDate(back_then.getDate() - 1)
        let since = timeSince(back_then)

        // time change breaks tests
        expect(since).toEqual(expect.stringMatching(/2[345] hours ago/))
    })


    it ('should show the time since in minutes', () => {
        back_then.setMinutes(back_then.getMinutes() - 12)
        let since = timeSince(back_then)

        expect(since).toEqual("12 minutes ago")
    })

    it ('should show the time since in minutes up to 2 hours ago', () => {
        back_then.setHours(back_then.getHours() - 1)
        let since = timeSince(back_then)

        expect(since).toEqual("60 minutes ago")
    })

    it ('should show the time since in seconds', () => {
        back_then.setSeconds(back_then.getSeconds() - 65)
        let since = timeSince(back_then)

        expect(since).toEqual("A few seconds ago...")
    })

})

describe('Comparison of two dates returns true when they are the same', () => {
    let date1, date2
    beforeEach(() => date1 = new Date('March 1 2021 13:30:45'))

    it ('should be false if the dates are exactly the same', () => {
        let date2 = new Date(date1.getTime())

        expect(dayIsDifferent(date1, date2)).toBe(false)
    })

    it ('should be true if the days are different but all else is the same', () => {
        let date2 = new Date(date1.getTime())
        date2.setDate(date1.getDate() + 1)
        expect(dayIsDifferent(date1, date2)).toBe(true)
    })


    it ('should be true if the months are different but all else is the same', () => {
        let date2 = new Date(date1.getTime())
        date2.setMonth(date1.getMonth() + 1)
        expect(dayIsDifferent(date1, date2)).toBe(true)
    })

    it ('should be true if the years are different but all else is the same', () => {
        let date2 = new Date(date1.getTime())
        date2.setYear(date1.getYear() + 1)
        expect(dayIsDifferent(date1, date2)).toBe(true)
    })

    it ('should be false if the times are different but all else is the same', () => {
        let date2 = new Date(date1.getTime())
        date2.setMinutes(date1.getMinutes() + 20)
        expect(dayIsDifferent(date1, date2)).toBe(false)
    })

})

describe('Date parameters returns the right parameter string', () => {
    const from = new Date()
    from.setMonth(8)
    const to = new Date()
    to.setMonth(11)

    it ('should return empty string if no parameters provided', () => {
        let params = getDateParams(null, null)
        expect(params).toBeFalsy()
    })

    it('should return with just the from date if no to date provided', () => {
        let params = getDateParams(from, null)
        expect(params).toEqual(`?from=${from.toISOString()}`)
    })

    it('should return with just the to date if no to date provided', () => {
        let params = getDateParams(null, to)
        expect(params).toEqual(`?to=${to.toISOString()}`)
    })

    it('should return with both dates when provided', () => {
        let params = getDateParams(from, to)
        expect(params).toEqual(`?from=${from.toISOString()}&to=${to.toISOString()}`)
    })
})

describe('Short dates UTC can be converted to short dates local time', () => {

    // close to midnight, so we will expect a difference between local day and utc day when running on the server:
    const date = new Date()
    date.setUTCHours(1, 0, 0)
    // eg Mon, 25 Jan 2021 1:00:00 GMT:
    const utcDateString = date.toUTCString()
    // eg Sun Jan 24 2021
    const localdateString = date.toDateString()

    const utc_parsed = utcDateString.split(' ')
    const local_parsed = localdateString.split(' ')
    // Jan 25:
    const utcShortDate = `${utc_parsed[2]} ${utc_parsed[1]}`
    // Jan 24:
    const expected = `${local_parsed[1]} ${local_parsed[2]}`

    // this all depends on when the tests are run and where.  If it's run in Greenwich then there's no difference!
    it('short date corrects for time zone differences', () => {
        let localShortDate = UTCToLocalMonthDayString(utcShortDate)
        expect(localShortDate).toEqual(expected)
    })

})
