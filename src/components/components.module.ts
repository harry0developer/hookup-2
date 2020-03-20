import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';
import { LocationStatusComponent } from './location-status/location-status';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
@NgModule({
	declarations: [SkeletonItemComponent,
    LocationStatusComponent,
    ChatBubbleComponent],
	imports: [IonicModule],
	exports: [SkeletonItemComponent,
    LocationStatusComponent,
    ChatBubbleComponent]
})
export class ComponentsModule {}
