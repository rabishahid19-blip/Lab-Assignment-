// lab task 2

let numbers = [1, 2, 3, 4, 5]

// sum using reduce
let sum = numbers.reduce(function(total, num) {
    return total + num
}, 0)

console.log("Sum of the numbers:", sum)


// add new number
numbers.push(6)
console.log("Array after adding a new number:", numbers)


// remove first number
numbers.shift()
console.log("Array after removing the first number:", numbers)


// reverse array
numbers.reverse()
console.log("Reversed array:", numbers)


// check if 5 exist
let check = numbers.includes(5)
console.log("Does the array contain 5?", check)


// multiply by 2
let newArr = numbers.map(function(n){
    return n * 2
})
console.log("New array with numbers multiplied by 2:", newArr)


// filter > 3
let greater = numbers.filter(function(n){
    return n > 3
})
console.log("Numbers greater than 3:", greater)


// find first divisible by 2
let firstEven = numbers.find(function(n){
    return n % 2 == 0
})
console.log("First number divisible by 2:", firstEven)