/// <reference path="../timing/Timeout.ts" />

namespace jpvCommon.async {
    
    export interface Action<Data> {
        start(): Promise<Data>;
        abort(): void;
    }

    export enum TaskStatus { PENDING, SUCCESS, ERROR, ABORTED }

    export interface TaskCallbacks<Data> {
        success?(data: Data): void;
        error?(error: any): void;
        aborted?(): void;
        completed?(status: TaskStatus): void;
    }

    export class Task<Data> {
        private callbacks: TaskCallbacks<Data> = null;
        private callbackInvokationTimeout = new timing.Timeout(1);
        private action: Action<Data>;
        private actionPromise: Promise<Data>;
        private status = TaskStatus.PENDING;
        private data: Data = null;
        private error: any = null;

        constructor(action: Action<Data>) {
            this.action = action;
            this.actionPromise = action.start();
            this.actionPromise.then(
                (data: Data) => {
                    if (this.status == TaskStatus.PENDING) {
                        this.status = TaskStatus.SUCCESS;
                        this.data = data;
                        this.invokeCallbacksAfterTimeout();
                    }
                },
                (error: any) => {
                    if (this.status == TaskStatus.PENDING) {
                        this.status = TaskStatus.ERROR;
                        this.error = error;
                        this.invokeCallbacksAfterTimeout();
                    }
                }
            );
            this.callbackInvokationTimeout.expiredEvent.add(this, this.invokeCallbacks);
        }

        on(callbacks: TaskCallbacks<Data>) {
            if (this.callbacks != null) {
                throw new Error("Can not register task callbacks. Callbacks were already registered.");
            }
            if (callbacks == null) {
                throw new Error("Can not register task callbacks. Parameter 'callbacks' can not be null.");
            }
            this.callbacks = callbacks;
            if (this.status != TaskStatus.PENDING) {
                this.invokeCallbacksAfterTimeout();
            }
        }

        abort() {
            if (this.status != TaskStatus.PENDING) {
                return;
            }
            this.status = TaskStatus.ABORTED;
            this.action.abort();
            this.invokeCallbacksAfterTimeout();
        }

        private invokeCallbacksAfterTimeout() {
            this.callbackInvokationTimeout.start();
        }

        private invokeCallbacks() {
            if (this.callbacks == null) {
                return;
            }
            switch (this.status) {
                case TaskStatus.SUCCESS:
                    if (this.callbacks.success) {
                        this.callbacks.success(this.data);
                    }
                    break;
                case TaskStatus.ERROR:
                    if (this.callbacks.error) {
                        this.callbacks.error(this.error);
                    }
                break;
                case TaskStatus.ABORTED:
                    if (this.callbacks.aborted) {
                        this.callbacks.aborted();
                    }
                    break;
                default:
                    throw new Error("Can not invoke task callbacks. Invalid task status '" + this.status + "' for invokation.");
            }
            if (this.callbacks.completed) {
                this.callbacks.completed(this.status);
            }
        }
    }
}
    