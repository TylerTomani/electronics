const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const CW = 50 // Component Width
canvas.width = 1000;
canvas.height = 700;
canvas.style.border = "2px solid black"
c.translate(0.5, 0.5);

class VoltageSource {
    constructor({position},name,isClicked){
        this.position = position;
        this.name = name;
        this.isClicked = isClicked

    }
    draw(){
        
        c.fillStyle = 'white';
        c.beginPath();
        //Top line 
        c.lineWidth = 2;
        c.font = "25px Arial"
        c.fillStyle = "blue"
        c.fillText("+",this.position.x - 15,this.position.y - 5)
        c.moveTo(this.position.x + (CW / 2), this.position.y )
        c.lineTo(this.position.x + (CW / 2), this.position.y - 25)
        // Positive Terminal +
        c.moveTo(this.position.x,this.position.y);
        c.lineTo(this.position.x + CW,this.position.y)
        //Ground Terminal - 
        c.font = "25px Arial"
        c.fillStyle = "red"
        c.fillText("-",this.position.x - 15,this.position.y + 15)
        c.moveTo(this.position.x + 10,this.position.y + 7)
        c.lineTo(this.position.x + 40,this.position.y + 7)
        //Bottom line
        c.moveTo(this.position.x + (CW / 2), this.position.y + 7)
        c.lineTo(this.position.x + (CW / 2),this.position.y + 25)
        
        c.stroke()
    }
    update(){
        this.draw();

    }
}
class Resistor {
    constructor({position},name,isClicked){
        this.position = position;
        this.name = name;
        this.isClicked = isClicked;
    }
    draw(){
        c.beginPath();
        c.moveTo(this.position.x, this.position.y)
        c.lineTo(this.position.x + 10, this.position.y)
        c.lineTo(this.position.x + 16, this.position.y - 10)
        c.lineTo(this.position.x + 22, this.position.y + 10)
        c.lineTo(this.position.x + 28, this.position.y - 10)
        c.lineTo(this.position.x + 34, this.position.y + 10)
        c.lineTo(this.position.x + 40, this.position.y - 2)
        c.lineTo(this.position.x + CW, this.position.y - 2)

        c.stroke()
    }
    update(){
        this.draw()
    }
}
class Wire  {
    constructor({position}){
        this.position = position
    }
    draw(){
        c.beginPath();
        c.moveTo(this.position.x,this.position.y)
        c.lineTo(this.position.x2,this.position.y2)
        c.stroke()

    }
    update(){
        this.draw();
    }
}
// let wire = new Wire({
//     position:{
//         x: 100,
//         y: 100,
//         x2: 400,
//         y2: 400
//     }
// })

// const voltageSource = new VoltageSource({
//     position: {
//         x: 50,
//         y: 250 
//     }
// })
// const resistor = new Resistor({
//     position: {
//         x: 50,
//         y: 100
//     }
// })
const components = [new VoltageSource({
        position:{
            x: 50,
            y: 250
        },
    },
    name = "vc" + 0
)];

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0,0,canvas.width,canvas.height)
    // voltageSource.update()
    // resistor.update()
    components.forEach(component => {
        component.update()
    })
    
}
animate()
let vcNumber = 0
let resisterNumber = 0;
// Add components window Event listeners
addEventListener("keydown", e => {
    let key = e.key;
    switch(key){
        case ("v" || "V"):
            
            components.push(new VoltageSource({
                    position:{
                        x: components[components.length -1].position.x,
                        y: components[components.length -1].position.y + CW
                    }
                },
                name = "vc" + vcNumber
            ))
            vcNumber++;
            break;
        case ("r" || "R"):
            components.push(new Resistor({
                    position:{
                        x: components[components.length -1].position.x2 + (CW * .5),
                        y: components[components.length -1].position.y2 - CW
                    }
                },
                name = "r" + resisterNumber
                ))
            resisterNumber++;
            components.push(new Wire({
                position:{
                    x: components[components.length - 2].position.x,
                    x: components[components.length - 2].position.y,
                    x2: components[components.length - 1].position.x,
                    y2: components[components.length - 1].position.y
                }
            }))
            console.log("wrokd")
            break;
    }
})

// Mouse Movement of Components

let mouseDown = false;
let lastComponent = ""
let currentComponentIndex;
let hoveringOver = ''


// https://stackoverflow.com/questions/55712136/how-to-stop-a-mousemove-event-after-a-mouse-up
function mouseMove(){
    canvas.addEventListener("mousemove",e => {
        // console.log("mouse Moving")
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        
        components.forEach(component => {
            if((x > component.position.x  && x < component.position.x + CW) && (y > component.position.y - 25 && y < component.position.y + (CW * .5))){
                console.log("Hover over", component.name)
                // console.log("x: ", x," y: ", y)
                hoveringOver = component.name
            }
            if(mouseDown){
                // console.log("Clicked",hoveringOver)
                component.isClicked = true;
                currentComponentIndex = components.indexOf(component)
                getCursorPosition(rect,x,y,canvas, e)
                console.log(component.name + " isClicked: " + component.isClicked)
            } else {
                component.isClicked = false;
                console.log(component.name + " isClicked: " + component.isClicked)
            }
            // console.log(component.isClicked)
        })

    })
}
 mouseMove()

// https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
function getCursorPosition(rect,x,y,canvas, event,component) {
     
    console.log("in" , component)

    console.log(currentComponentIndex)
    console.log(components[currentComponentIndex].isClicked)
    if(components[currentComponentIndex].isClicked && (hoveringOver === components[currentComponentIndex].name)){
        components[currentComponentIndex].position.x = x;
        components[currentComponentIndex].position.y = y;
    }
  
    
}
canvas.addEventListener('mousedown',e => {
    mouseDown = true;
    if(mouseDown){
         mouseMove() 
    }

})
canvas.addEventListener('mouseup', function(e) {
    mouseDown = false;     
  
})


addEventListener("keydown",e => {
    let key = e.key;
    if(key === "Backspace" && components.length > 1){
        components.pop()
    }
    
})

