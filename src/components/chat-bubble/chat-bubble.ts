import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent {

  @Input() text: string;
  @Input() timestamp: string;
  @Input() from: 'me' | 'other' = 'me';

  constructor() {
  }

  fromMe(): boolean {
    return this.from.toLocaleLowerCase() === 'me';
  }

}
