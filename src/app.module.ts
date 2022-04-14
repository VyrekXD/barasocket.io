import { Module } from '@nestjs/common'

import { AppController } from './app.controller'

import { ImagesGateway } from './app.gateway'

@Module({
	imports: [],
	controllers: [AppController],
	providers: [ImagesGateway]
})
export class AppModule {}

