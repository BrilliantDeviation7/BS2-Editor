import { Buffer } from 'buffer';

export default class Flasher {
	constructor(port) {
		this.in = new Uint8Array();

		this.reading = true;

		this.writer = port.writable.getWriter();
		this.reader = port.readable.getReader();
		this.port = port;

		// revisions
		this.revision = {
			name: 'BS2',
			challenge: new Uint8Array([0x42, 0x53, 0x32]),
			response: [190, 173, 206]
		};
	}
	async flush() {
		if (this.writer) {
			await this.writer.ready;
			await this.writer.close();
			this.writer = await this.port.writable.getWriter();
		}
		if (this.reader) {
			await this.reader.ready;
			await this.reader.cancel();
			await this.reader.releaseLock();
			this.reader = await this.port.readable.getReader();
		}
	}

	async identifyBoard() {
		let data = this.revision.challenge;
		for (var i = 0; i < data.length; i++) {
			await this.flush();
			await this.writer.write(new Uint8Array(data.slice(i, i + 1)));
			let bytesRead = 0;
			let bytes = [];
			while (bytesRead < 2) {
				const val = await this.reader.read();
				if (val) {
					for (var j = 0; j < val.value.length; j++) {
						if (val.value[j]) {
							bytes.push(val.value[j]);
							bytesRead++;
						}
					}
				}
			}
			// if(bytes[1] === this.revision.response[i]){
			//     console.log("valid")
			// }
			// else {
			//     console.log("invalid")
			//     console.log(bytes)
			// }
		}
		await this.writer.write(new Uint8Array([0x00]));
		let bytesRead = 0;
		let bytes = [];
		while (bytesRead < 1) {
			const val = await this.reader.read();
			if (val) {
				for (j = 0; j < val.value.length; j++) {
					if (val.value[j]) {
						bytes.push(val.value[j]);
						bytesRead++;
					}
				}
			}
		}
		return;
	}

	async resetBoard() {
		await this.port.setSignals({ break: true });
		await this.port.setSignals({ dataTerminalReady: false });
		await this.port.setSignals({ dataTerminalReady: true });
		await new Promise((r) => setTimeout(r, 50));
		await this.port.setSignals({ break: false });
		await this.flush();
		return;
	}

	async cancel() {
		await this.reader.cancel();
		await this.reader.releaseLock();
		await this.writer.close();
		await this.writer.releaseLock();
	}

	async upload() {
		for (let i = 0; i < this.pb.PacketCount; i++) {
			let packet = this.pb.PacketBuffer.slice(i * 18, i * 18 + 18);
			await this.writer.write(Buffer.from(packet));
			let bytesRead = 0;
			let bytes = [];
			while (bytesRead < 19) {
				const val = await this.reader.read();
				if (val) {
					for (var j = 0; j < val.value.length; j++) {
						bytes.push(val.value[j]);
						bytesRead++;
					}
				}
			}
		}
	}

	async flash(pb) {
		this.pb = pb;
		await this.resetBoard();
		await this.identifyBoard();
		await this.upload();
		await this.writer.write(new Uint8Array([0x00]));
		await this.writer.releaseLock();
		await this.reader.releaseLock();
		return;
	}
}
