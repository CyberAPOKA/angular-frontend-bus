import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
  ],
};

bootstrapApplication(AppComponent, updatedAppConfig).catch((err) =>
  console.error(err)
);
