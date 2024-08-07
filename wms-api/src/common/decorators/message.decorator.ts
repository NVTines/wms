import { SetMetadata } from '@nestjs/common';

export interface IMessage {
  message: string;
  status: number;
}
export namespace Message {
  export const Success = (message: IMessage) =>
    SetMetadata('message_success', message);
  export const Error = (message: IMessage) =>
    SetMetadata('message_error', message);
}
