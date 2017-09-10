/// <reference path="../eventing/Event.ts" />

namespace jpvCommon.timing {
	
	export class Timeout {
		expiredEvent = new eventing.Event<void>();
		
		duration: number;
		
		private id: number = null;
		
		constructor(duration: number) {
			this.duration = duration;
		}
		
		start() {
			this.stop();
			this.id = window.setTimeout(() => this.onExpired(), this.duration);
		}
		
		stop() {
			if (this.id != null) {
				window.clearTimeout(this.id);
			}
		}
		
		protected onExpired() {
			this.expiredEvent.trigger(this, null);	
		}
	}
}
