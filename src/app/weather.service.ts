import { Injectable, OnDestroy, Signal, signal } from "@angular/core";
import { Observable, Subscription } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { LOCATIONS_STORAGE_KEY } from "./location.service";
import { ListStorageEventType } from "./storage/list/list-storage-event.type";
import { ListStorageService } from "./storage/list/list-storage.service";

@Injectable()
export class WeatherService implements OnDestroy {
  static URL_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
  static URL_DAILY_FORECAST =
    "https://api.openweathermap.org/data/2.5/forecast/daily";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";

  private currentConditions = signal<ConditionsAndZip[]>([]);
  private listStorageEventSubscribtion: Subscription;

  constructor(
    private http: HttpClient,
    private listStorage: ListStorageService
  ) {
    // Subscribe to changes in the location list
    this.listStorageEventSubscribtion = this.listStorage
      .getListStorageEvents(LOCATIONS_STORAGE_KEY)
      .subscribe((event) => {
        switch (event.type) {
          case ListStorageEventType.ADD:
            event.values.forEach((value) => this.addCurrentConditions(value));
            break;
          case ListStorageEventType.REMOVE:
            event.values.forEach((value) =>
              this.removeCurrentConditions(value)
            );
            break;
        }
      });

    // Initialize the current conditions for each location in the list
    this.listStorage.getValues(LOCATIONS_STORAGE_KEY).forEach((zipcode) => {
      this.addCurrentConditions(zipcode);
    });
  }

  private addCurrentConditions(zipcode: string): void {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http
      .get<CurrentConditions>(
        `${WeatherService.URL_WEATHER}?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
      )
      .subscribe((data) =>
        this.currentConditions.update((conditions) => [
          ...conditions,
          { zip: zipcode, data },
        ])
      );
  }

  private removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(
      `${WeatherService.URL_DAILY_FORECAST}?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }

  ngOnDestroy(): void {
    this.listStorageEventSubscribtion.unsubscribe();
  }
}
