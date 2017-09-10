/// <reference path="../eventing/Event.ts" />

namespace jpvCommon.timing {
	
	export class Interval {
		tickEvent = new eventing.Event<void>();
		
		duration: number;
		
		private id: number = null;
		
		constructor(duration: number) {
			this.duration = duration;
		}
		
		start() {
			this.stop();
			this.id = window.setInterval(() => this.onTick(), this.duration);
		}
		
		stop() {
			if (this.id != null) {
				window.clearInterval(this.id);
			}
		}
		
		protected onTick() {
			this.tickEvent.trigger(this, null);	
		}
	}
}
