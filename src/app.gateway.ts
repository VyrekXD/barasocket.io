import { config } from 'dotenv'
import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage
} from '@nestjs/websockets'

config()

@WebSocketGateway()
export class ImagesGateway {
	@WebSocketServer()
	server

	handleConnection(client) {
		const tokens = process.env.TOKENS.split(',')
		const token = client?.handshake?.auth?.token

		if (!tokens.includes(token)) {
			client.emit('unauthorized')
			client.disconnect()
		}
	}

	@SubscribeMessage('forceAdd')
	async forceAdd(client, data) {
		this.server.emit('forceAdd', data)
	}

	@SubscribeMessage('sendGroups')
	async getGroups() {
		this.server.emit('sendGroups')
	}

	@SubscribeMessage('getGroups')
	async groups(client, data) {
		this.server.emit('getGroups', data)
	}

	@SubscribeMessage('addImage')
	async addImage(client, data) {
		this.server.emit('addImage', data)
	}

	@SubscribeMessage('ping')
	async onPing(client) {
		client.emit('pong', 'hello')
	}
}
