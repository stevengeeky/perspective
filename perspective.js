//

var transforms = [], c = 0, board;

window.addEventListener("load", function(){
    board = document.getElementById("display_board");
    setTransform(transforms[0]);
    
    for (var i = 0; i < board.children.length; i++) {
        var c = board.children[i];
        if (c && typeof c.style != "undefined" && c.className == "item") {
            if (typeof c.dataset.focused != "undefined")
                focusOn(i);
            else
                focusOff(i);
            
            var ctransform = "";
            
            var x = c.dataset.x || 0;
            var y = c.dataset.y || 0;
            var z = c.dataset.z || 0;
            
            ctransform += " translate(-50%, -50%) translate(" + x + "px, " + y + "px)";
            
            // //
            var s = c.dataset.scale || 1;
            ctransform += "scale(" + s + ")";
            
            //
            var rx = c.dataset.rx || 0;
            var ry = c.dataset.ry || 0;
            var rz = c.dataset.rz || 0;
            ctransform += " rotateZ(" + rz + "deg) rotateY(" + ry + "deg) rotateX(" + rx + "deg)";
            
            var untrans = "";
            
            untrans += " rotateX(" + -rx + "deg) rotateY(" + -ry + "deg) rotateZ(" + -rz + "deg)";
            untrans += " scale(" + (1 / s) + ")";
            untrans += " translate(" + (-x) + "px, " + (-y) + "px)";
            
            //untrans += " perspective(" + p + "px)";
            
            transforms.push(untrans);
            
            c.style.transform = ctransform;
        }
    }
    
    
});

window.addEventListener("keydown", function(e){
    if (e.keyCode == 32 || e.keyCode == 39) {
        e.preventDefault();
        next();
    }
    else if (e.keyCode == 8 || e.keyCode == 37) {
        e.preventDefault();
        previous();
    }
})

function setTransform(t) {
    board.style.transform = t;
}

function next() {
    if (transforms.length == 0)
        return;
    if (c >= transforms.length - 1)
        return;
    focusOff(c);
    c++;
    focusOn(c);
    setTransform(transforms[c]);
}
function previous() {
    if (transforms.length == 0)
        return;
    if (c <= 0)
        return;
    focusOff(c);
    c--;
    focusOn(c);
    setTransform(transforms[c]);
}

function focusOff(ind) {
    var child = board.children[ind];
    child.className = child.className.replace(/ ?focused/g, "");
}
function focusOn(ind) {
    var child = board.children[ind];
    child.className += " focused";
}