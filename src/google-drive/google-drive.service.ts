import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private static GOODRIVE_KEYFILE =
    'src/google-drive/utils/service-account.json';

  private static SCOPES = 'https://www.googleapis.com/auth/drive';

  /**
   * Upload file to Google Drive
   * @param file File
   * @param folder folder name
   * @returns
   */
  async uploadFile(file: any, folderId: string) {
    try {
      const fileMetadata = {
        name: file.filename,
        parents: [folderId],
      };

      const media = {
        mimeType: file.mimeType,
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
  private async getFileURL(fileId: string) {
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
      return new google.auth.GoogleAuth({
        keyFile: GoogleDriveService.GOODRIVE_KEYFILE,
        scopes: GoogleDriveService.SCOPES,
      });
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
