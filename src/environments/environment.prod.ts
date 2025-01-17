import { CACHE_HTTP_INTERCEPTOR_CONFIGS } from "app/cache/http/cache-http-interceptor";
import { LogLevel } from "app/logging.service";
import { WeatherService } from "app/weather.service";

const TWO_HOURS_IN_MILLISECONDS: number = 2 * 60 * 60 * 1000;

export const environment = {
  production: true,
  logLevel: LogLevel.WARN,
  cacheHttpInterceptorConfigs: {
    provide: CACHE_HTTP_INTERCEPTOR_CONFIGS,
    useValue: [
      {
        urlPrefix: WeatherService.URL_WEATHER,
        ttlInMilliseconds: TWO_HOURS_IN_MILLISECONDS,
      },
      {
        urlPrefix: WeatherService.URL_DAILY_FORECAST,
        ttlInMilliseconds: TWO_HOURS_IN_MILLISECONDS,
      },
    ],
  },
};
