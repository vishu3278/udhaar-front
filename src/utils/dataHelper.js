import { parseISO, getYear } from 'date-fns'

/**
 * Supports both "YYYY-MM-DD" and "DD-MM-YYYY"
 */
export function parseDate(date) {
    if (!date) return new Date();
    if (date.includes("-")) {
        const parts = date.split("-");
        if (parts[0].length === 4) return parseISO(date); // YYYY-MM-DD
        return parseISO(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD-MM-YYYY
    }
    return parseISO(date);
}

/**
 * Groups udhaar records by year for a list of payees
 */
export function groupAllUdhaar(data) {
    const yearGroups = {};
    data.forEach(person => {
        if (!person.udhaar) return;
        person.udhaar.forEach(u => {
            const date = parseDate(u.date);
            const year = getYear(date);

            if (!yearGroups[year]) yearGroups[year] = [];

            yearGroups[year].push({
                name: person.name,
                total: u.amount
            });
        });
    });

    return Object.keys(yearGroups).map(year => ({
        year,
        data: yearGroups[year]
    })).sort((a, b) => b.year - a.year);
}
