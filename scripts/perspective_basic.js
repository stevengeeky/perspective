/*
    Perspective.js, a library for presentations
    By Steven Geeky
*/
/*
    Pre-set Slide Types:
        basic: slides in from right to left
        zcardstack: a slide will stack itself on top of the current slide
*/

// Global Flags

var INFINITE_SCROLLING = true;

// ///////////////////////

var Slide, Slides;
(function(){
//
var wrapper, container;

window.addEventListener("load", function(){
    wrapper = document.createElement("div");
    container = document.createElement("div");
    
    wrapper.appendChild(container)
    document.body.appendChild(wrapper);
});

window.addEventListener("keydown", function(e){
    if (!e.ctrlKey)
        e.preventDefault();
    
    if (e.keyCode == 39 || e.keyCode == 32) {
        Slides.next();
    }
    else if (e.keyCode == 37 || e.keyCode == 8) {
        Slides.previous();
    }
})

function __slides() {
    this.list = [];
    this.current = 0;
    this.add = function(slide) {
        this.list.push(slide);
        container.appendChild(slide.el);
    };
    this.remove = function(slide) {
        if (this.list.indexOf(slide) != -1)
        {
            container.removeChild(slide.el);
            this.list.splice(this.list.indexOf(slide), 1);
        }
    };
    
    this.previous = function(){
        if (this.current <= 0)
        {
            if (INFINITE_SCROLLING)
                this.current = this.list.length;
            else
                return;
        }
        this.current--;
        if (this.current + 1 >= this.list.length)
        {
            this.list[0].initFrom();
            this.list[this.current].initTo();
        }
        else
        {
            this.list[this.current + 1].initFrom();
            this.list[this.current].initTo();
        }
    };
    this.next = function(){
        if (this.current >= this.list.length - 1)
        {
            if (INFINITE_SCROLLING)
                this.current = -1;
            else
                return;
        }
        this.current++;
        
        if (this.current - 1 < 0)
        {
            this.list[this.list.length - 1].initFrom();
            this.list[this.current].initTo();
        }
        else
        {
            this.list[this.current - 1].initFrom(true);
            this.list[this.current].initTo(true);
        }
    };
    
    this.focusOn = function(n) {
        if (n < 0 || n >= this.list.length)
            return;
        
        if (this.current == n)
            this.list[this.current].initTo(true);
        else
        {
            while (this.current < n) this.next();
            while (this.current > n) this.previous();
        }
    };
}
Slides = new __slides();

Slide = function(html, op, className) {
    if (typeof op == "string") {
        className = className || "";
        switch (op.toLowerCase()) {
            case "basic":
                return new Slide(html, {
                    initialTransform:"translate(100%, 0)",
                    toTransform:"",
                    fromTransform:"translate(-100%, 0)"
                }, className);
            case "zcardstack":
                return new Slide(html, {
                    initialTransform:"scale(5) translateY(100%)",
                    toTransform:"",
                    fromTransform:"translateY(-100%) scale(.1)"
                }, className);
            case "rotate":
                return new Slide(html, {
                    initialTransform:"rotate(360deg) scale(0)",
                    toTransform:"",
                    fromTransform:"rotate(-360deg) translateX(-100%)"
                }, className + " rotate_slide_find_origin");
            case "scale":
                return new Slide(html, {
                    initialTransform:"scale(0)",
                    toTransform:"",
                    fromTransform:"scale(0)"
                }, className);
            case "flip":
                return new Slide(html, {
                    initialTransform:"rotateY(360deg) scale(0)",
                    toTransform:"",
                    fromTransform:"translateX(-100%)"
                }, className);
            default:
                return null;
        }
    }
    op = op || {};
    
    var el = document.createElement("div");
    el.className = "slide";
    el.innerHTML = html || "";
    
    this.el = el;
    if (op.initialTransform)
        this.el.style.transform = op.initialTransform;
    if (className)
        this.el.className += " " + className;
    
    this.getOp = function(){
        return op;
    };
    this.initTo = function(fromright, cb) {
        cb = cb || function(){};
        if (op.background)
            document.body.style.background = op.background;
        
        if (op.toTransform)
        {
            if (this.el.style.transform != op.toTransform)
            {
                var rt = this.el.style.transition;
                this.el.style.transition = "none";
                if (fromright)
                    this.el.style.transform = op.initialTransform;
                else
                    this.el.style.transform = op.fromTransform;
                
                setTimeout(function(){
                    el.style.transition = rt;
                    
                    el.style.transform = op.toTransform;
                    el.addEventListener("transitionend", cb);
                }, 1);
            }
            else
                cb();
        }
        else
        {
            this.el.style.transform = "";
            cb();
        }
    }
    this.initFrom = function(toleft, cb) {
        cb = cb || function(){};
        if (op.fromTransform)
        {
            if (this.el.style.transform != op.fromTransform)
            {
                var rt = this.el.style.transition;
                this.el.style.transition = "none";
                this.el.style.transform = op.toTransform;
                
                setTimeout(function(){
                    el.style.transition = rt;
                    
                    if (toleft)
                        el.style.transform = op.fromTransform;
                    else
                        el.style.transform = op.initialTransform;
                    el.addEventListener("transitionend", cb);
                }, 1);
            }
            else
                cb();
        }
        else
        {
            this.el.style.transform = "";
            cb();
        }
    }
}
//
}).call(window);
