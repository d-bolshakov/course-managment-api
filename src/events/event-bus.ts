import EventEmitter from "events";
import type TypedEmitter from "typed-emitter";
import type { Events } from "./events.type";

export const EventBus = new EventEmitter() as TypedEmitter<Events>;
