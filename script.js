const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const audioContext = new AudioContext();

const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

document.getElementById("file").addEventListener("change", async e => {

    const file = e.target.files[0];
    if(!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    source.start();

    animate();
});

function animate(){

    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = 180;

for (let i = 0; i < bufferLength; i++) {

    const angle = (i / bufferLength) * Math.PI * 2;
    const value = dataArray[i];

    const x1 = cx + Math.cos(angle) * radius;
    const y1 = cy + Math.sin(angle) * radius;

    const x2 = cx + Math.cos(angle) * (radius + value);
    const y2 = cy + Math.sin(angle) * (radius + value);

    ctx.strokeStyle = `hsl(${i * 4},100%,50%)`;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

}