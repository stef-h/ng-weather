// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { CACHE_HTTP_INTERCEPTOR_CONFIGS } from "app/cache/http/cache-http-interceptor";
import { LogLevel } from "app/logging.service";
import { WeatherService } from "app/weather.service";

const TWENTY_SECONDS_IN_MILLISECONDS: number = 20 * 1000;

export const environment = {
  production: false,
  logLevel: LogLevel.DEBUG,
  cacheHttpInterceptorConfigs: {
    provide: CACHE_HTTP_INTERCEPTOR_CONFIGS,
    useValue: [
      {
        urlPrefix: WeatherService.URL_WEATHER,
        maxAgeInMilliseconds: TWENTY_SECONDS_IN_MILLISECONDS,
      },
      {
        urlPrefix: WeatherService.URL_DAILY_FORECAST,
        maxAgeInMilliseconds: TWENTY_SECONDS_IN_MILLISECONDS,
      },
    ],
  },
};
