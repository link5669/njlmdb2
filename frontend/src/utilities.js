function formatDate(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Define an array of month names
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    // Get the day, month, and year from the Date object
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Return the formatted date string
    return `${month} ${day}, ${year}`;
}

export {formatDate}