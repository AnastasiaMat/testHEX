
var size = 0;
var sideLength = 60;
var results = [];
var lineWidth = 3;
var Xcenter = 390;
var Ycenter = 390;
let serverURL; //'http://localhost:13337/';


let bt2 = document.getElementById('bt2');
let bt3 = document.getElementById('bt3');
let bt4 = document.getElementById('bt4');
bt2.addEventListener('click', beginGame, true);
bt3.addEventListener('click', beginGame, true);
bt4.addEventListener('click', beginGame, true);
function beginGame(event){
    serverURL = document.getElementById('url-server').value;
    let strSize = this.innerHTML;
    size = Number(strSize);
    ctxClear();
    results = [];
    createGrid();
    postReqest([]);
    setStatus("playing");
    event.stopPropagation();
}




document.addEventListener('keyup', keyPressHandler, false);
function keyPressHandler(event){
    let keyCode = event.code;
    if(keyCode === 'KeyQ'){
        roundGrid1('z', 'x', 'y', -1, 1);
    } else if(keyCode === 'KeyW'){
        roundGrid2('x', 'y', 'z', -1, -1);
    } else if(keyCode === 'KeyE'){
        roundGrid1('y', 'z', 'x', -1, 1);
    } else if(keyCode === 'KeyA'){
        roundGrid2('y', 'z', 'x', -1, -1);
    } else if(keyCode === 'KeyS'){
        roundGrid1('x', 'y', 'z', -1, 1);
    } else if(keyCode === 'KeyD'){
        roundGrid2('z', 'x', 'y', -1, -1);    
    }

}

function roundGrid1(Xdirection, Ydirection, Zdirection, Xratio, Zratio){ //S    
    for (let x = Xratio * (size - 1); x <= (size - 1); x = x - 1 * Xratio){
    
        let cellsArr = new Array;
        let prevValue = 0;
        let prevCell = {};
        for (let z = Zratio * (size - 1); -1 * (size - 1) <= z; z = z - 1 * Zratio){
            let y = 0 - x - z;
            if (Math.abs(y) >= size){
                continue;
            }
            
            let res = results.find((item) => {return (item[Xdirection] === x && item[Ydirection] === y && item[Zdirection] === z)});
                
            if(res.value !== 0){
                if(res.value === prevValue && prevValue > 0){
                    prevCell.value = prevCell.value * 2;    
                    res.value = 0;
                    prevValue = 0;
                } else {
                    prevValue = res.value;
                    prevCell = res;
                }   
            }
            cellsArr.push(res);
        }
        
        for (let i = 0; i < cellsArr.length; i++){
            if(cellsArr[i].value === 0){
                for (let j = i + 1; j < cellsArr.length; j++){
                    if(cellsArr[j].value !== 0){
                        cellsArr[i].value = cellsArr[j].value;
                        cellsArr[j].value = 0;
                        drawCell(cellsArr[j].centerCoords.x, cellsArr[j].centerCoords.y, '' + cellsArr[j].value);
                        break;
                    }
                }
            }
            drawCell(cellsArr[i].centerCoords.x, cellsArr[i].centerCoords.y, '' + cellsArr[i].value);
        }
    }
    
    postReqest(getValueCells());
}


function roundGrid2(Xdirection, Ydirection, Zdirection, Xratio, Zratio){ //W    
    for (let x = Xratio * (size - 1); x <= (size - 1); x = x - 1 * Xratio){
    
        let cellsArr = new Array;
        let prevValue = 0;
        let prevCell = {};
        for (let z = Zratio * (size - 1); z <= (size - 1); z = z - 1 * Zratio){
            let y = 0 - x - z;
            if (Math.abs(y) >= size){
                continue;
            }
            
            let res = results.find((item) => {return (item[Xdirection] === x && item[Ydirection] === y && item[Zdirection] === z)});
                
            if(res.value !== 0){
                if(res.value === prevValue && prevValue > 0){
                    prevCell.value = prevCell.value * 2;    
                    res.value = 0;
                    prevValue = 0;
                } else {
                    prevValue = res.value;
                    prevCell = res;
                }   
            }
            cellsArr.push(res);
        }
        
        for (let i = 0; i < cellsArr.length; i++){
            if(cellsArr[i].value === 0){
                for (let j = i + 1; j < cellsArr.length; j++){
                    if(cellsArr[j].value !== 0){
                        cellsArr[i].value = cellsArr[j].value;
                        cellsArr[j].value = 0;
                        drawCell(cellsArr[j].centerCoords.x, cellsArr[j].centerCoords.y, '' + cellsArr[j].value);
                        break;
                    }
                }
            }
            drawCell(cellsArr[i].centerCoords.x, cellsArr[i].centerCoords.y, '' + cellsArr[i].value);
        }
    }
    
    postReqest(getValueCells());
}



function getCenterCoords(cell){
    var x = Xcenter + sideLength * (3/2 * cell.x);
    var y = Ycenter + sideLength * (Math.sqrt(3)/2 * cell.x + Math.sqrt(3) * cell.z);
    return {x: x, y: y};
}

function createGrid(){
    for (var x = -1 * (size - 1); x <= (size - 1); x++){
        for (var y = -1 * (size - 1); y <= (size - 1); y++){
            for (var z = -1 * (size - 1); z <= (size - 1); z++){
                if(x + y + z === 0){
                    var cell = new Object();
                    cell.x = x;
                    cell.y = y;
                    cell.z = z;
                    cell.value = 0;
                    cell.centerCoords = getCenterCoords(cell);

                    results.push(cell);

                    drawCell(cell.centerCoords.x, cell.centerCoords.y, '' + cell.value);
                }
            }
        }
    }
}



function ctxClear(){
    var ctx = document.getElementById('gameArea').getContext('2d');
    ctx.clearRect(0, 0, 780, 780);
}

function drawCell(Xcoordinate, Ycoordinate, t){
    if (t === '0'){
        t = '';
    }
    
    var ctx = document.getElementById('gameArea').getContext('2d');
    ctx.clearRect(Xcoordinate - sideLength, Ycoordinate - 24/2, 2 * sideLength, 24);
    var numberOfSides = 6;
    ctx.beginPath();
    ctx.moveTo(Xcoordinate + sideLength * Math.cos(0), Ycoordinate + sideLength * Math.sin(0));          
    for (var i = 1; i <= numberOfSides; i++) {
      ctx.lineTo(Xcoordinate + sideLength * Math.cos(i * 2 * Math.PI / numberOfSides), Ycoordinate + sideLength * Math.sin(i * 2 * Math.PI / numberOfSides));
    }

    ctx.strokeStyle = "#787878";
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = "#5e5e5e";
    ctx.font = "bold 16px Arial";
    ctx.fillText(t, Xcoordinate - (t.length * 16/2), Ycoordinate);
    ctx.stroke();
}
                 
let sentData;



function postReqest(arrValueCells){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", serverURL + size, true);

    
    xhr.onload = function() {
        
        let responseStr = xhr.response;
        responseStr = responseStr.slice(1, responseStr.length - 1);
        let arrOfStrings = responseStr.split('}');
        let arrOfObjs = new Array;
        
        for(let i = 0; i < arrOfStrings.length; i++){
            if(arrOfStrings[i].length > 0){
                arrOfObjs.push(JSON.parse(arrOfStrings[i].replace(',{', '{') + '}'));
            }
        }
        
        for (let i = 0; i < arrOfObjs.length; i++){
            let res = results.find((item) => {return (item.x === arrOfObjs[i].x && item.y === arrOfObjs[i].y && item.z === arrOfObjs[i].z)});    
            if (res !== undefined) {
                res.value = arrOfObjs[i].value;
                drawCell(res.centerCoords.x, res.centerCoords.y, '' + res.value);
            }
        } 
    }

    
    
    let body = new Array;
    for (let i = 0; i < arrValueCells.length; i++){
        body.push({"x": arrValueCells[i].x, "y": arrValueCells[i].y, "z": arrValueCells[i].z, "value": arrValueCells[i].value});
    }
    xhr.send(JSON.stringify(body));
    
}


function getValueCells(){
    let ValueCells = new Array;
    
    for(let i = 0; i < results.length; i++){
        if(results[i].value !== 0){
            ValueCells.push(results[i]);
        }
    }
    
    return ValueCells;
}

function setStatus(status){
    let statusElement = document.getElementById('status');
    statusElement.innerHTML = status;
}




