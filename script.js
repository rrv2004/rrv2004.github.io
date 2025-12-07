// Author: Hoang Tran (https://www.facebook.com/profile.php?id=100004848287494)
// Github: https://github.com/HoangTran0410/3DCarousel/blob/master/index.html

// You can change global variables here:
var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// Link of background music - set 'null' if you dont want to play background music
var bgMusic = 'null';
var bgMusicControls = false; // Show UI music control

/*
     NOTE:
       + imgWidth, imgHeight will work for video
       + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
       + Music link are taken from: https://soundcloud.com/
       + Custom from code in tiktok video  https://www.tiktok.com/@lun_dev/video/7210810077395258626
*/

// ===================== start =======================
setTimeout(init, 100);

var obox = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
// var aEle = [...aImg, ...aVid]; // combine 2 arrays
var aEle = ospin.getElementsByClassName('card'); // Target card containers

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Ground size
// Ground size
var ground = document.getElementById('ground');

function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
    }
    // Update ground size dynamically
    ground.style.width = radius * 3 + "px";
    ground.style.height = radius * 3 + "px";
}

function applyTranform(obj) {
    // Constrain the angle of camera (between 0 and 180)
    if (tY > 60) tY = 60;
    if (tY < 0) tY = 0;

    // Apply the angle
    obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
    ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
    var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// add background music
// add background music
if (bgMusic && bgMusic !== 'null') {
    document.getElementById('music-container').innerHTML += `
<audio src="${bgMusic}" ${bgMusicControls ? 'controls' : ''} autoplay loop>    
<p>If you are reading this, it is because your browser does not support the audio element.</p>
</audio>
`;
}

// setup events
document.onpointerdown = function (e) {
    clearInterval(obox.timer);
    e = e || window.event;
    var sX = e.clientX,
        sY = e.clientY;

    this.onpointermove = function (e) {
        e = e || window.event;
        var nX = e.clientX,
            nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(obox);
        sX = nX;
        sY = nY;
    };

    this.onpointerup = function (e) {
        obox.timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform(obox);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(obox.timer);
                playSpin(true);
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };

    return false;
};

// Use wheel event for zooming
window.addEventListener('wheel', function (e) {
    // Zoom in/out
    var d = e.deltaY > 0 ? -20 : 20;
    radius += d;

    // Bounds
    if (radius < 100) radius = 100;
    if (radius > 800) radius = 800;

    init("0s"); // Update with 0s delay for immediate response
});

// Theme toggle logic
var themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
});
