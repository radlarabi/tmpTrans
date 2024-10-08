export const animatedBackground = () => {
    if (document.getElementById('canvasBg')) {
        return
    }
    const canvas = document.createElement('canvas');
    
    canvas.id = 'canvasBg';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.filter = 'blur(1px)';
    canvas.style.zIndex = '-1';
    canvas.style.height = "100vh";
    canvas.style.width = "100vw";

    document.body.appendChild(canvas);
    document.body.style.background = "url('./assets/images/jungle-background.webp') no-repeat center center/cover fixed";
   

    let c = init("canvasBg"),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight);


    class firefly{
        constructor(){
            this.x = Math.random()*w;
            this.y = Math.random()*h;
            this.s = Math.random()*2;
            this.ang = Math.random()*2*Math.PI;
            this.v = this.s*this.s/4;
        }
        move(){
            this.x += this.v*Math.cos(this.ang);
            this.y += this.v*Math.sin(this.ang);
            this.ang += Math.random()*20*Math.PI/180-10*Math.PI/180;
        }
        show(){
            c.beginPath();
            c.arc(this.x,this.y,this.s,0,2*Math.PI);
            c.fillStyle="#fddba3";
            c.fill();
        }
    }

    let f = [];

    function draw() {
        if(f.length < 200){
            for(let j = 0; j < 10; j++){
                f.push(new firefly());
            }
        }
        
        for(let i = 0; i < f.length; i++){
            f[i].move();
            f[i].show();
            if(f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h){
                f.splice(i,1);
            }
        }
    }

    let mouse = {};
    let last_mouse = {};

    canvas.addEventListener(
        "mousemove",
        function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        },
        false
    );
    function init(elemid) {
    let canvas = document.getElementById(elemid),
        c = canvas.getContext("2d"),
        w = (canvas.width = window.innerWidth),
        h = (canvas.height = window.innerHeight);
        c.fillStyle = "rgba(30,30,30,1)";
        c.fillRect(0, 0, w, h);
        return c;
    }
    
    
    window.requestAnimFrame = (function() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback);
            }
        );
    });

    function loop() {
        window.requestAnimFrame(loop);
        c.clearRect(0, 0, w, h);
        draw();
    }

    window.addEventListener("resize", function() {
        (w = canvas.width = window.innerWidth),
        (h = canvas.height = window.innerHeight);
        loop();
    });

    loop();
    setInterval(loop, 1000 / 60);

}