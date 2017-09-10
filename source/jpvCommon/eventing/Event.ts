namespace jpvCommon.eventing {
	
	class EventListener<Sender, EventData> {
		context: Object;
		handler: EventHandler<Sender, EventData>;
		
		constructor(context: Object, handler: EventHandler<Sender, EventData>)
		{
			this.context = context;
			this.handler = handler;
		}
	}
	
	export interface EventHandler<Sender, EventData> {
		(sender: Sender, data: EventData): void;
	}
	
	export class Event<EventData> {
		private listeners: EventListener<any, EventData>[] = [];
		private disposed = false;

		dispose() {
			this.listeners.length = 0;	
			this.disposed = true;
		}
		
		add(context: Object, handler: EventHandler<any, EventData>) {
			if (this.disposed) {
				throw new Error("Trying to access a disposed object.");	
			}
			this.listeners.push(new EventListener<any, EventData>(context, handler));
		}
		
		trigger(sender: Object, data: EventData) {
			if (this.disposed) {
				throw new Error("Trying to access a disposed object.");	
			}
			var listeners = this.listeners;
			for (var listener of this.listeners) {
				listener.handler.call(listener.context, sender, data);
			}
		}
		
		remove(context: Object, handler: EventHandler<any, EventData>) {
			var listeners = this.listeners;
			for (var i = 0; i < listeners.length; i++) {
				if (listeners[i].context == context && listeners[i].handler == handler) {
					this.listeners.slice(i, 1);	
					return true;
				}
			}
			return false;
		}
	}
}
