export function isDifferenceInRange(str1, str2) {
    // Convert strings to numbers
    const num1 = Number(str1);
    const num2 = parseInt(str2);
    
    // Calculate the absolute difference between the two numbers
    const difference = Math.abs(num1 - num2);
    
    // Check if the difference is 15 or less

    console.log(difference)
    const result = difference <= 15;
    
    return result;
}

export function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month; // Add leading zero if month < 10
    let day = today.getDate();
    day = day < 10 ? '0' + day : day; // Add leading zero if day < 10
    return `${year}-${month}-${day}`;
 }

