export const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function timeSince (date) {
    const now = new Date()

    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (isLeapYear(now) && seconds < 31622400 + 31536000 ) {
        interval = Math.floor(seconds / 31622400)
    }

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return "A few seconds ago..."
}

export const isLeapYear = (date) => {
    const year = date.getFullYear();
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

/**
 * Helper function to determine whether two date objects have a diffrent day, month, or year are different, ignoring any associated time stamp
 * @param date1 A Date object
 * @param date2 A Date object
 * @returns {boolean} true if date1 has the same day, month and year as date2.
 */
export const dayIsDifferent = (date1, date2) => {
    return (
        date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth() ||
        date1.getDate() !== date2.getDate()
    )
}

export const getDateParams = (fromDate, toDate) => {
    let params = ''
    if (fromDate) {
        params = `?from=${fromDate.toISOString()}`
    }
    if (toDate) {
        const symbol = fromDate ? '&' : '?'
        params += `${symbol}to=${toDate.toISOString()}`
    }
    return params
}

/**
 * Turns the utc short date into a local short date MMM dd (e.g. "Jun 2")
 *
 * This comes about because, although we save assessment dates as utc, when we retrieve the assessment date for the heat map,
 * it is truncated by virtue of the 'group by' query we use to coallate the observation data.
 * On the client side, the full utc dates are normally simply converted back by javascript to the browser local time.
 * But, the short date has no time zone information associated, so we have to massage that information back into it
 * using javascript built in date functions. (mmmm massage)
 *
 * So if a user marks an assessment at 10 PM Pacific time, giving it a date of Jun 2 (PDT), it will be saved in the db as
 * June 3 5AM UTC, which is June 2 10 pm PDT + 7 hours, the time zone difference.
 * When retrieving the heat map data, the query shortens it to the string "Jun 3".  We bring it back to the local machine,
 * turn that June 3 into a UTC date, then convert it to the short version of a local time string.
 *
 * @param utcDateString - the UTC short date string eg "Jun 3"
 * @returns {string} - the local short date
 */
export const UTCToLocalMonthDayString = (utcDateString) => {
    const year = new Date().getFullYear()
    const date = new Date(`${utcDateString} ${year} UTC`)
    return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`
}
