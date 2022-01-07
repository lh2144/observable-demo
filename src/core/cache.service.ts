import { map, of } from 'rxjs';

interface Options {
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

  public Cacheble(cacheOptions: Options = {}): MethodDecorator {
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
    return function (...args: any[]) {
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

  public makeApiCall(
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
        })
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
}
