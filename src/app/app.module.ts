import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./zipcode-entry/zipcode-entry.component";
import { LocationService } from "./location.service";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { WeatherService } from "./weather.service";
import { CurrentConditionsComponent } from "./current-conditions/current-conditions.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { ListStorageService } from "./storage/list/list-storage.service";
import { CacheHttpInterceptor } from "./cache/http/cache-http-interceptor";
import { CacheService } from "./cache/cache.service";
import { LocalStorageService } from "./storage/local-storage.service";
import { LOG_LEVEL, LogLevel, LoggingService } from "./logging.service";
import { StorageService } from "./storage/storage.service";
import { TabModule } from "./tab/tab.module";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register("/ngsw-worker.js", {
      enabled: environment.production,
    }),
    TabModule,
  ],
  providers: [
    {
      provide: LOG_LEVEL,
      useValue: environment.logLevel ?? LogLevel.DEBUG,
    },
    LocationService,
    WeatherService,
    { provide: StorageService, useClass: LocalStorageService },
    ListStorageService,
    CacheService,
    environment.cacheHttpInterceptorConfigs,
    { provide: HTTP_INTERCEPTORS, useClass: CacheHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
