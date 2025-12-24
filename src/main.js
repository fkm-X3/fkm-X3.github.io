import './style.css';
import { P2PConnection } from './modules/connection.js';
import { generateQR, startScanner } from './modules/signaling.js';
import { requestToJSON, handleRequest, renderResponse } from './modules/proxy.js';

const app = document.querySelector('#app');

// State Manager
let connection = null;
let role = null; // 'host' | 'client'

function init() {
  renderLanding();
}

function renderLanding() {
  app.innerHTML = `
    <h1>NetBridge</h1>
    <p>Offline Peer-to-Peer Web Proxy</p>
    
    <div class="card flex-col gap-4">
      <button id="btn-host" class="btn">Start as Host (Gateway)</button>
      <button id="btn-client" class="btn btn-secondary">Start as Client (Browser)</button>
    </div>

    <div class="card">
      <h3>How it works</h3>
      <ol style="padding-left: 20px; line-height: 1.6; color: #a1a1aa;">
        <li><strong>Host</strong> connects to the internet (or has cached data).</li>
        <li><strong>Client</strong> connects to Host via WebRTC (no internet needed for link).</li>
        <li>Client browses web, Host fetches pages and sends them back.</li>
      </ol>
    </div>
  `;

  document.getElementById('btn-host').onclick = startHost;
  document.getElementById('btn-client').onclick = startClient;
}

function createConnectionUI(title) {
  app.innerHTML = `
    <h2>${title}</h2>
    <div id="status-bar" class="status-badge">
      <div class="status-dot"></div> <span id="status-text">Disconnected</span>
    </div>

    <!-- Signaling Steps -->
    <div id="signaling-ui" class="card">
      <h3 id="step-title">Initializing...</h3>
      <p id="step-desc">Please wait.</p>
      
      <div id="qr-container"></div>
      <video id="qr-video" muted playsinline style="display:none"></video>
      
      <div class="flex-col gap-4" style="margin-top: 15px;">
        <textarea id="manual-signal" class="input" rows="3" placeholder="Paste connection string here if QR fails..."></textarea>
        <button id="btn-manual-submit" class="btn hidden">Submit Code</button>
      </div>
    </div>

    <!-- Connected UI -->
    <div id="connected-ui" class="hidden">
      <!-- Host View -->
      <div id="host-view" class="hidden">
        <div class="card">
          <h3>Proxy Logs</h3>
          <div id="logs"></div>
        </div>
      </div>

      <!-- Client View -->
      <div id="client-view" class="hidden">
        <div class="browser-bar">
          <input type="text" id="url-input" class="input" placeholder="https://example.com">
          <button id="btn-go" class="btn">Go</button>
        </div>
        <div id="browser-content" class="browser-content"></div>
      </div>
    </div>
  `;

  // Bind manual submit
  const btnSubmit = document.getElementById('btn-manual-submit');
  const manualInput = document.getElementById('manual-signal');

  if (btnSubmit) {
    btnSubmit.onclick = () => {
      const code = manualInput.value.trim();
      if (code) handleManualCode(code);
    };
    // Show button when typing
    manualInput.oninput = () => btnSubmit.classList.remove('hidden');
  }
}

function updateStatus(state) {
  const text = document.getElementById('status-text');
  const dot = document.querySelector('.status-dot');
  if (!text) return;

  text.innerText = state;
  if (state === 'connected') {
    dot.classList.add('connected');
    document.getElementById('signaling-ui').classList.add('hidden');
    document.getElementById('connected-ui').classList.remove('hidden');

    if (role === 'host') {
      document.getElementById('host-view').classList.remove('hidden');
      log("Client connected. Ready to proxy requests.");
    } else {
      document.getElementById('client-view').classList.remove('hidden');
    }
  }
}

function log(msg) {
  const logs = document.getElementById('logs');
  if (logs) {
    const entry = document.createElement('div');
    entry.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
  }
}

// --- Host Logic ---
async function startHost() {
  role = 'host';
  createConnectionUI("Host Mode");

  connection = new P2PConnection(updateStatus, onHostMessage);

  // Host Step 1: Scan Client's Offer
  setStep("Step 1: Scan Client QR", "Scan the QR code displayed on the Client device.");
  const video = document.getElementById('qr-video');
  video.style.display = 'block';
  startScanner(video, async (data) => {
    video.style.display = 'none';
    setStep("Step 2: Generating Answer...", "Processing connection...");
    const answer = await connection.handleOffer(data);

    setStep("Step 2: Show Answer", "Show this QR code to the Client.");
    generateQR(document.getElementById('qr-container'), answer);
  });
}

async function onHostMessage(data) {
  if (data.type === 'request') {
    log(`Request: ${data.method} ${data.url}`);
    const response = await handleRequest(data);
    connection.send(response);
    log(`Response sent: ${response.data.status}`);
  }
}

// --- Client Logic ---
async function startClient() {
  role = 'client';
  createConnectionUI("Client Mode");

  connection = new P2PConnection(updateStatus, onClientMessage);

  // Client Step 1: Generate Offer
  setStep("Step 1: Generating Offer...", "Creating connection offer...");
  const offer = await connection.createOffer();

  setStep("Step 1: Show Offer", "Show this QR code to the Host device.");
  generateQR(document.getElementById('qr-container'), offer);

  // Client Step 2: Scan Host Answer (After user indicates they are ready? Or just show a button to scan?)
  // Better UX: Show QR, and have a button "I have scanned it" -> No, Connection works by exchange.
  // We need to show QR, and THEN scan the answer. 
  // We can add a "Scan Host Answer" button below the QR.

  const btnScan = document.createElement('button');
  btnScan.className = 'btn';
  btnScan.innerText = "Scan Host Answer";
  btnScan.style.marginTop = '20px';
  btnScan.onclick = () => {
    document.getElementById('qr-container').innerHTML = ''; // clear QR
    btnScan.remove();

    setStep("Step 3: Scan Host QR", "Scan the QR code displayed on the Host device.");
    const video = document.getElementById('qr-video');
    video.style.display = 'block';
    startScanner(video, async (data) => {
      video.style.display = 'none';
      setStep("Connecting...", "Finalizing handshake...");
      await connection.handleAnswer(data);
    });
  };
  document.getElementById('signaling-ui').appendChild(btnScan);

  // Setup Browser UI events
  setTimeout(() => {
    const btnGo = document.getElementById('btn-go');
    const input = document.getElementById('url-input');
    if (btnGo && input) {
      btnGo.onclick = () => {
        const url = input.value;
        if (url) {
          document.getElementById('browser-content').innerHTML = '<p>Loading...</p>';
          requestToJSON(url).then(req => connection.send(req));
        }
      };
    }
  }, 100);
}

function onClientMessage(data) {
  if (data.type === 'response') {
    const container = document.getElementById('browser-content');
    renderResponse(container, data.data);
  }
}

// --- Shared Helpers ---
function setStep(title, desc) {
  const t = document.getElementById('step-title');
  const d = document.getElementById('step-desc');
  if (t) t.innerText = title;
  if (d) d.innerText = desc;
}

// Handle Manual Paste
async function handleManualCode(code) {
  // Try to detect if it's an offer or answer based on role
  try {
    if (role === 'host') {
      // Host expects offer
      const answer = await connection.handleOffer(code);
      setStep("Step 2: Show Answer", "Copy this code to the Client.");
      // We can show it as text too
      document.getElementById('qr-container').innerText = answer;
      document.getElementById('qr-container').style.wordBreak = 'break-all';
      document.getElementById('qr-video').style.display = 'none';
    } else if (role === 'client') {
      // Client expects answer
      await connection.handleAnswer(code);
    }
  } catch (e) {
    alert("Invalid code: " + e.message);
  }
}

init();
