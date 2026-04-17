// simple JS practice file

// student intro
let name = "Hassan";
let age = 20;
let isStudent = true;

console.log("My name is " + name + ". I am " + age + " years old. Student: " + isStudent);


// checking data types
let text = "Hello world";
let number = 42;
let status = false;
let nothing;
let empty = null;

console.log(typeof text);
console.log(typeof number);
console.log(typeof status);
console.log(typeof nothing);
console.log(typeof empty);


// simple calculator
let a = 10;
let b = 5;

console.log("add:", a + b);
console.log("sub:", a - b);
console.log("mul:", a * b);
console.log("div:", a / b);


// temperature convert
let c = 30;
let f = (c * 9/5) + 32;

console.log("C:", c);
console.log("F:", f);


// even or odd
let numCheck = 7;

if (numCheck % 2 === 0) {
    console.log("Even");
} else {
    console.log("Odd");
}


// grade system
let marks = 75;

if (marks >= 90) {
    console.log("A");
} else if (marks >= 80) {
    console.log("B");
} else if (marks >= 70) {
    console.log("C");
} else if (marks >= 60) {
    console.log("D");
} else {
    console.log("Fail");
}


// age check
let userAge = 18;

if (userAge >= 18) {
    console.log("You can vote");
} else {
    console.log("You cannot vote");
}


// print 1 to 10
for (let i = 1; i <= 10; i++) {
    console.log(i);
}


// table
let t = 5;

for (let i = 1; i <= 10; i++) {
    console.log(t + " x " + i + " = " + (t * i));
}