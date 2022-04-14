import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage
} from '@nestjs/websockets'

@WebSocketGateway()
export class ImagesGateway {
	@WebSocketServer()
	server

	@SubscribeMessage('addImage')
	async addImage(client, data) {
		this.server.emit('addImage', data)
	}

	@SubscribeMessage('ping')
	async onPing(client) {
		client.emit('pong', 'hello')
	}
}
