// lab task 3

// 1. switch for day name
function getDayName(day) {

    switch(day) {
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
        case 7:
            return "Sunday"
        default:
            return "Invalid day number"
    }

}

console.log(getDayName(3))   // Wednesday
console.log(getDayName(8))   // Invalid


// 2. while loop 1 to 10
function print1to10() {
    let i = 1

    while(i <= 10) {
        console.log(i)
        i++
    }
}

print1to10()


// 3. do while 10 to 1
function print10to1() {
    let i = 10

    do {
        console.log(i)
        i--
    } while(i >= 1)
}

print10to1()