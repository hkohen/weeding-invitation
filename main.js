/* ELEMENTS */
const hero = document.getElementById("hero");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("music");


let _wasPlayingBeforeHide = false;

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        _wasPlayingBeforeHide = !!(music && !music.paused && !music.ended);
        music && music.pause();
    } else {
        if (_wasPlayingBeforeHide && music) {
            music.play().catch(() => {});
        }
        _wasPlayingBeforeHide = false;
    }
});

window.addEventListener("beforeunload", () => {
    if (music) {
        music.pause();
        music.currentTime = 0;
    }
});

/* OUVERTURE RIDEAU */

if (openBtn) {
    openBtn.addEventListener("click", () => {
        music && music.play();
        hero && hero.classList.add("open");
        openBtn.style.opacity = "0";
        setTimeout(() => {
            openBtn.style.display = "none";
            document.body.style.overflowY = "auto";
        }, 2200);
    });
}

/* COUNTDOWN */

const targetDate =
new Date(
"June 12, 2026 15:45:00"
).getTime();

function updateCountdown(){

    const now =
    new Date().getTime();

    const distance =
    targetDate - now;

    const days =
    Math.floor(
        distance /
        (1000 * 60 * 60 * 24)
    );

    const hours =
    Math.floor(
        (
            distance %
            (1000 * 60 * 60 * 24)
        )
        /
        (1000 * 60 * 60)
    );

    const minutes =
    Math.floor(
        (
            distance %
            (1000 * 60 * 60)
        )
        /
        (1000 * 60)
    );

    const seconds =
    Math.floor(
        (
            distance %
            (1000 * 60)
        )
        / 
        1000
    );

    document.getElementById(
    "days").innerHTML = days;

    document.getElementById(
    "hours").innerHTML = hours;

    document.getElementById(
    "minutes").innerHTML = minutes;

    document.getElementById(
    "seconds").innerHTML = seconds;

}

setInterval(
    updateCountdown,
    1000
);

updateCountdown();

/* SCRATCH */

const scratches =
document.querySelectorAll(".scratch");

let finishedScratch = 0;

scratches.forEach((scratch)=>{

    const canvas =
    scratch.querySelector("canvas");

    const ctx =
    canvas.getContext("2d");

    // match canvas pixel size to element size while accounting for devicePixelRatio
    const ratio = window.devicePixelRatio || 1;
    const cssWidth = scratch.offsetWidth;
    const cssHeight = scratch.offsetHeight;
    canvas.width = Math.round(cssWidth * ratio);
    canvas.height = Math.round(cssHeight * ratio);
    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";
    // prevent default touch behaviors via CSS and JS
    canvas.style.touchAction = 'none';

    ctx.fillStyle = "#d4a041";

    // Fill using device pixels (canvas.width/height are in device pixels)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let drawing = false;
    let completed = false;

    function erase(x,y){

        ctx.globalCompositeOperation = "destination-out";

        ctx.beginPath();

        // Account for devicePixelRatio: canvas coordinates are in device pixels
        const r = window.devicePixelRatio || 1;
        const rx = Math.round(x * r);
        const ry = Math.round(y * r);
        const radius = Math.max(10, Math.round(22 * r));

        ctx.arc(rx, ry, radius, 0, Math.PI * 2);
        ctx.fill();

        checkScratch();

    }

    function checkScratch(){

        if(completed) return;

        // Read device pixel data (canvas.width/height in device pixels)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let transparent = 0;

        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) {
                transparent++;
            }
        }

        const totalPixels = canvas.width * canvas.height;
        const percent = transparent / totalPixels;

        // When more than ~55% of the area is scratched, mark completed
        if (percent > 0.55) {
            completed = true;
            finishedScratch++;
            canvas.style.opacity = "0";
            if (finishedScratch === 3) {
                launchConfetti();
            }
        }

    }

    // Use Pointer Events for unified mouse/pen/touch handling
    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        drawing = true;
        canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
        const rect = canvas.getBoundingClientRect();
        erase(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        erase(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('pointerup', (e) => {
        drawing = false;
        try { canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId); } catch (err) {}
    });

    // Fallback for older touch-only browsers: ensure listeners are non-passive
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        erase(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        erase(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        drawing = false;
    });

});

/* CONFETTI */

function launchConfetti(){

    for(let i=0; i<220; i++){

        const confetti =
        document.createElement("div");

        confetti.classList.add("confetti");

        const size =
        Math.random() * 12 + 8;

        confetti.style.width =
        size + "px";

        confetti.style.height =
        size + "px";

        confetti.style.borderRadius =
        Math.random() > 0.5
        ? "50%"
        : "3px";

        confetti.style.left =
        Math.random() * 100 + "vw";

        confetti.style.background =
        [
            "#7d0d0d",
            "#ffffff",
            "#d4a041",
            "#5d1b1b"
        ][
            Math.floor(
                Math.random() * 4
            )
        ];

        confetti.style.animationDuration =
        (Math.random() * 3 + 3)
        + "s";

        document.body.appendChild(
            confetti
        );

        setTimeout(()=>{

            confetti.remove();

        },7000);

    }

}

