import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer() server!: Server;
  emitConverted(data: {
    sessionId: string;
    url: string;
    originalName: string;
    type: string;
    size: number;
  }) {
    this.server.emit('converted', data);
  }
}
