# nestjs-google-drive

Upload files on google drive for nestjs applications

## Installation

```bash
$ npm install nestjs-google-drive
```

or

```bash
$ yarn add nestjs-google-drive
```

## Requirements

- Create a google cloud project
- Create a google account with Google Drive enabled.
- Get the credentials of the google cloud project `client id`, `client secret`, `redirect url` and `refresh token`

To archive this, I invite you to watch this [video](https://www.youtube.com/watch?v=1y0-IfRW114&t=43s) or read the [developper google drive documentation](https://developers.google.com/drive/api/guides/about-sdk)

## usage

First, import and configure the `GoogleDriveModule` in the appModule or elsewhere.

```typescript
import { Module } from '@nestjs/common';
import { GoogleDriveModule } from 'nestjs-google-drive';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GoogleDriveModule.register({
      clientId: 'your_google_client_id',
      clientSecret: 'your_google_client_secret',
      redirectUrl: 'redirection_url',
      refreshToken: 'your_refresh_token',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Once the `GoogleDriveModule` imported, you can inject the `GoogleDriveService` and use it to upload files on google drive.

```typescript
import { Injectable } from '@nestjs/common';
import { GoogleDriveService } from 'nestjs-google-drive';

@Injectable()
export class UsersService {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  async updateAvatar(userId: number, file: Express.Multer.File) {
    const GOOGLE_DRIVE_FOLDER_ID = '1nrvE1mTi-35NsrswB2dfKjrPpj4SZiDg';

    const avatarUrl = await this.googleDriveService.uploadFile(
      file,
      GOOGLE_DRIVE_FOLDER_ID,
    );

    return { avatarUrl };
  }
}
```

The file is upload in a folder, make sure you have created a google drive folder, browse inside and get it `id`.

After browsing in the created google drive folder, the `folder id` is the last string of the browser search bar.

The `ID` of the folder `nestjs-upload`
![](https://i.ibb.co/G7s08s5/Frame-1.png)

Now you can go to the google drive folder to see your file that has been uploaded ✨✨.
