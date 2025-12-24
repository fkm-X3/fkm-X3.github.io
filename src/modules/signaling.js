import QRCode from 'qrcode';
import jsQR from 'jsqr';

export async function generateQR(container, text) {
    try {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        await QRCode.toCanvas(canvas, text, {
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'L' // Lower error correction to fit more data
        });
    } catch (err) {
        console.error('QR Gen Error:', err);
        container.innerHTML = `<p style="color:red">Error generating QR. Data might be too long.</p>`;
    }
}

export function startScanner(videoElem, onScan) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            videoElem.srcObject = stream;
            videoElem.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            videoElem.play();
            requestAnimationFrame(() => tick(videoElem, onScan));
        })
        .catch(err => {
            console.error("Camera error", err);
            alert("Camera permission denied or not available.");
        });
}

function tick(video, onScan) {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            console.log("QR Found", code.data);
            onScan(code.data);
            // Stop stream
            video.srcObject.getTracks().forEach(track => track.stop());
            return;
        }
    }
    requestAnimationFrame(() => tick(video, onScan));
}
