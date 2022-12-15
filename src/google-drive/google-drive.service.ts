import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import { GOOGLE_DRIVE_CONFIG } from './google-drive.constant';
import { GoogleDriveConfigType } from './types';

@Injectable()
export class GoogleDriveService {
  constructor(
    @Inject(GOOGLE_DRIVE_CONFIG)
    private readonly googleDriveConfig: GoogleDriveConfigType,
  ) {}

  /**
   * Upload file to Google Drive
   * @param file File
   * @param folder folder name
   * @returns
   */
  async uploadFile(file: Express.Multer.File, folderId?: string) {
    try {
      const fileMetadata = {
        name: file.filename,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimetype,
        body: this.bufferToStream(file),
      };

      const driveService = this.getDriveService();

      const response = await driveService.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id',
      });

      const { id: fileId } = response.data;

      return await this.getFileURL(fileId);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete file on google drive
   * @param fileId file id to delete
   */
  async deleteFile(fileId: string) {
    try {
      const drive = this.getDriveService();

      await drive.files.delete({
        fileId,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get file URL from and existing file in google drive with the file id
   * @param fileId file id
   * @returns
   */
  async getFileURL(fileId: string) {
    const drive = this.getDriveService();

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const result = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    const fileUrl = result.data.webContentLink;

    return fileUrl;
  }

  /**
   * Ask for permission to access to Goofle Drive
   * @returns
   */
  private getAuth() {
    try {
      const { clientId, clientSecret, redirectUrl, refreshToken } =
        this.googleDriveConfig;

      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

      auth.setCredentials({ refresh_token: refreshToken });

      return auth;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get access to Google Drive
   * @returns
   */
  private getDriveService = () => {
    const auth = this.getAuth();

    const DRIVE_VERSION = 'v3';

    return google.drive({ version: DRIVE_VERSION, auth });
  };

  /**
   * Get stream from buffer
   * @param file File
   * @returns
   */
  private bufferToStream(file: Express.Multer.File) {
    const stream = fs.createReadStream(file.path);

    return stream;
  }
}
