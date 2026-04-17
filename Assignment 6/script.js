
let img = document.getElementById("myImage")
let showBtn = document.getElementById("showBtn")
let hideBtn = document.getElementById("hideBtn")

showBtn.onclick = function() {
    img.style.display = "block"
    showBtn.style.display = "none"
    hideBtn.style.display = "inline-block"
}


hideBtn.onclick = function() {
    img.style.display = "none"
    showBtn.style.display = "inline-block"
    hideBtn.style.display = "none"
}