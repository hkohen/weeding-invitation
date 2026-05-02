/* ELEMENTS */

const seal =
document.getElementById("seal");

const hero =
document.getElementById("hero");

const music =
document.getElementById("music");

let _wasPlayingBeforeHide = false;

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
        // remember whether music was playing, then pause (don't reset time)
        _wasPlayingBeforeHide = !!(music && !music.paused && !music.ended);
        music.pause();
    } else {
        // page became visible — resume if it was playing before
        if (_wasPlayingBeforeHide) {
            music.play().catch(() => {
                // autoplay might be blocked by browser; ignore errors
            });
        }
        _wasPlayingBeforeHide = false;
    }

});

window.addEventListener(
"beforeunload",
()=>{

music.pause();
music.currentTime = 0;

});
/* OPEN */

seal.addEventListener(
"click",
()=>{

music.play();

hero.classList.add("open");

document.body.style.overflowY =
"auto";

});

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

    canvas.width =
    scratch.offsetWidth;

    canvas.height =
    scratch.offsetHeight;

    ctx.fillStyle =
    "#d4a041";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let drawing = false;
    let completed = false;

    function erase(x,y){

        ctx.globalCompositeOperation =
        "destination-out";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            22,
            0,
            Math.PI * 2
        );

        ctx.fill();

        checkScratch();

    }

    function checkScratch(){

        if(completed) return;

        const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        let transparent = 0;

        for(
            let i = 3;
            i < imageData.data.length;
            i += 4
        ){

            if(imageData.data[i] < 50){

                transparent++;

            }

        }

        const percent =
        transparent /
        (canvas.width * canvas.height);

        if(percent > 0.55){

            completed = true;

            finishedScratch++;

            canvas.style.opacity = "0";

            if(finishedScratch === 3){

                launchConfetti();

            }

        }

    }

    canvas.addEventListener(
        "mousedown",
        ()=>{
            drawing = true;
        }
    );

    canvas.addEventListener(
        "mouseup",
        ()=>{
            drawing = false;
        }
    );

    canvas.addEventListener(
        "mousemove",
        (e)=>{

            if(!drawing) return;

            const rect =
            canvas.getBoundingClientRect();

            erase(
                e.clientX - rect.left,
                e.clientY - rect.top
            );

        }
    );

    canvas.addEventListener(
        "touchmove",
        (e)=>{

            e.preventDefault();

            const rect =
            canvas.getBoundingClientRect();

            const touch =
            e.touches[0];

            erase(
                touch.clientX - rect.left,
                touch.clientY - rect.top
            );

        }
    );

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

