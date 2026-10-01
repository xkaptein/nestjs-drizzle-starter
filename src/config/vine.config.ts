import vine, { SimpleMessagesProvider } from '@vinejs/vine';
export function vineConfig() {
  vine.messagesProvider = new SimpleMessagesProvider({
    enum: 'The {{ field }} value should be one of: {{ choices }}',
  });
}
