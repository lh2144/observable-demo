import { finalize, map, of, share } from 'rxjs';

export interface Options {
  maxAge?: number;
  clearOn?: string[];
  cachecForEver?: boolean;
}
class CacheService {
  private cachedModels: { [id: string]: { [arg: string]: any } } = {};
  private pendingRequest: { [id: string]: { [arg: string]: any } } = {};
  private lastCalledTime: { [id: string]: { [arg: string]: number } } = {};
  private cachesToBust: { [id: string]: string[] } = {};
  constructor() {}

  public Cachable(cacheOptions: Options = {}): MethodDecorator {
    return (
      target: Object,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<any>
    ) => {
      const methodName = this.getSignature(
        target.constructor.name,
        propertyKey
      );
      this.resetCache(methodName);
      cacheOptions.clearOn?.forEach((event) => {
        if (!this.cachesToBust[event]) {
          this.cachesToBust[event] = [methodName];
        } else {
          this.cachesToBust[event].push(methodName);
        }
      });
      const originalMethod = descriptor.value;
      descriptor.value = this.modifiedFunc(
        originalMethod,
        methodName,
        cacheOptions
      );
      return descriptor;
    };
  }

  public modifiedFunc(originalMethod: Function, id: string, optinons: Options) {
    const CacheService = this;
    return (...args: any[]) => {
      console.log('this', this);
      const argsSignature = JSON.stringify(args);
      const cachedModels = CacheService.cachedModels[id][argsSignature];
      const pendingRequest = CacheService.pendingRequest[id][argsSignature];
      const lastCalledTime = CacheService.lastCalledTime[id][argsSignature];
      if (
        optinons.cachecForEver ||
        (lastCalledTime && Date.now() - lastCalledTime < optinons.maxAge!)
      ) {
        if (pendingRequest) {
          return pendingRequest;
        } else if (cachedModels) {
          return of(cachedModels);
        }
      } else {
        this.makeApiCall(originalMethod, args, this, id, optinons);
      }
    };
  }

  private makeApiCall(
    originMethod: Function,
    args: any[],
    bind: any,
    id: string,
    options: Options
  ) {
    const argsSignature = JSON.stringify(args);
    this.lastCalledTime[id][argsSignature] = Date.now();
    return (this.pendingRequest[id][argsSignature] = originMethod
      .apply(bind, args)
      .pipe(
        map((res) => {
          this.cachedModels[id][argsSignature] = res;

          return res;
        }),finalize(() => {
          this.pendingRequest[id][argsSignature] = null
        }), share()
      ));
  }

  public getSignature(objName: string, methodName: string) {
    return `${objName}-${methodName}`;
  }

  public resetCache(id: string) {
    this.cachedModels[id] = {};
    this.pendingRequest[id] = {};
    this.lastCalledTime[id] = {};
  }

  public clearCachesForEvent(event: string) {
    this.cachesToBust[event].forEach((cachedId) => {
        this.resetCache(cachedId)
    })
    this.cachesToBust[event] = []
  }
}

const cacheService = new CacheService()
export const Cachable = cacheService.Cachable.bind(cacheService) as (cacheOptions: Options) => MethodDecorator
export const clearCachesForEvent= cacheService.clearCachesForEvent.bind(cacheService) as (event: string) => void