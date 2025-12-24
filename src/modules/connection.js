export class P2PConnection {
    constructor(onStatusChange, onMessage) {
        this.peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Public STUN server
        });
        this.dataChannel = null;
        this.onStatusChange = onStatusChange;
        this.onMessage = onMessage;
        this.role = null; // 'host' or 'client'

        this.peer.onicecandidate = (e) => {
            if (e.candidate) {
                console.log('[WebRTC] New ICE candidate');
                // We wait for gathering to complete for the "offline" simple SDP blob
            }
        };

        this.peer.onconnectionstatechange = () => {
            console.log(`[WebRTC] Connection state: ${this.peer.connectionState}`);
            this.onStatusChange(this.peer.connectionState);
        };
    }

    // Generate Offer (Client)
    async createOffer() {
        this.role = 'client';
        this.dataChannel = this.peer.createDataChannel("proxy");
        this.setupDataChannel();

        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);

        // Wait for ICE gathering to complete so we have a single self-contained SDP to share
        await new Promise(resolve => {
            if (this.peer.iceGatheringState === 'complete') {
                resolve();
            } else {
                const check = () => {
                    if (this.peer.iceGatheringState === 'complete') {
                        this.peer.removeEventListener('icegatheringstatechange', check);
                        resolve();
                    }
                };
                this.peer.addEventListener('icegatheringstatechange', check);
            }
        });

        return JSON.stringify(this.peer.localDescription);
    }

    // Receive Offer, Generate Answer (Host)
    async handleOffer(offerStr) {
        this.role = 'host';
        const offer = JSON.parse(offerStr);

        this.peer.ondatachannel = (e) => {
            this.dataChannel = e.channel;
            this.setupDataChannel();
        };

        await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);

        // Wait for ICE gathering
        await new Promise(resolve => {
            if (this.peer.iceGatheringState === 'complete') {
                resolve();
            } else {
                const check = () => {
                    if (this.peer.iceGatheringState === 'complete') {
                        this.peer.removeEventListener('icegatheringstatechange', check);
                        resolve();
                    }
                };
                this.peer.addEventListener('icegatheringstatechange', check);
            }
        });

        return JSON.stringify(this.peer.localDescription);
    }

    // Receive Answer (Client)
    async handleAnswer(answerStr) {
        const answer = JSON.parse(answerStr);
        await this.peer.setRemoteDescription(answer);
    }

    setupDataChannel() {
        this.dataChannel.onopen = () => {
            console.log('[DataChannel] Open');
            this.onStatusChange('connected');
        };
        this.dataChannel.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.onMessage(data);
        };
    }

    send(data) {
        if (this.dataChannel && this.dataChannel.readyState === 'open') {
            this.dataChannel.send(JSON.stringify(data));
        } else {
            console.error('[WebRTC] Channel not open');
        }
    }
}
