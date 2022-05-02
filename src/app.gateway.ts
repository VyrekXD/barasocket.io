import { config } from 'dotenv'
import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets'

config()

@WebSocketGateway({})
export class ImagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server
	users = 0

	async handleDisconnect() {
		this.users--

		console.log(`Sockets: ${this.users}`)
	}

	handleConnection(@ConnectedSocket() client) {
		const tokens = process.env.TOKENS.split(',')
		const token = client?.handshake?.auth?.token

		if (!tokens.includes(token)) {
			client.emit('unauthorized')
			console.warn('Socket tried to connect with invalid token')
			return client.disconnect()
		}

		this.users++

		console.log(`Sockets: ${this.users}`)
	}

	@SubscribeMessage('forceAdd')
	async forceAdd(@ConnectedSocket() client, @MessageBody() data) {
		this.server.emit('forceAdd', data)
	}

	@SubscribeMessage('sendGroups')
	async getGroups() {
		this.server.emit('sendGroups')
	}

	@SubscribeMessage('getGroups')
	async groups(@ConnectedSocket() client, @MessageBody() data) {
		this.server.emit('getGroups', data)
	}

	@SubscribeMessage('addImage')
	async addImage(@ConnectedSocket() client, @MessageBody() data) {
		this.server.emit('addImage', data)
	}

	@SubscribeMessage('ping')
	async onPing(@ConnectedSocket() client) {
		client.emit('pong', 'hello')
	}
}
