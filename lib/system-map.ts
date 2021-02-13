import { ICanFind, IHaveName } from "./interfaces";
import { Ref } from "./references";
import { ActorSystemName } from "./system";


export const systemMap = new Map<ActorSystemName, ICanFind>();

export function add(system: ICanFind & IHaveName) {
  return systemMap.set(system.name, system);
};

export function find<T>(systemName: ActorSystemName | undefined, reference: Ref<any>): T | undefined {
  if (systemName === undefined) {
    return undefined;
  }
  const system = systemMap.get(systemName);
  if (reference === undefined || system === undefined) {
    return undefined;
  }
  return system.find(reference);
};

export function remove(systemName: ActorSystemName) {
  systemMap.delete(systemName);
};


export type ApplyF<ActorOrSystem, Res> = (actor: undefined | ActorOrSystem) => Res;
export type InferReturnValueFromFunc<T extends ApplyF<any, any>> = T extends ApplyF<any, infer Res> ? Res : never;

export function applyOrThrowIfStopped<F extends ApplyF<any, any>>(reference: Ref<any>, f: (actorOrSystem: any) => any): InferReturnValueFromFunc<F> {
  let concrete = find(reference.system.name, reference);
  if (concrete) {
    return f(concrete);
  } else {
    throw new Error('Actor has stopped or never even existed');
  }
};
