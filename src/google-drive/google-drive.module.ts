import { DynamicModule, Module } from '@nestjs/common';
import { GOOGLE_DRIVE_CONFIG } from './google-drive.constant';
import { GoogleDriveService } from './google-drive.service';
import { GoogleDriveConfigType } from './types';

@Module({})
export class GoogleDriveModule {
  static register(googleDriveConfig: GoogleDriveConfigType): DynamicModule {
    return {
      module: GoogleDriveModule,
      global: true,
      providers: [
        {
          provide: GOOGLE_DRIVE_CONFIG,
          useValue: googleDriveConfig,
        },
        GoogleDriveService,
      ],
      exports: [
        GoogleDriveService, 
        {
          provide: GOOGLE_DRIVE_CONFIG,
          useValue: googleDriveConfig,
        }],
    };
  }
}
