import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseSQLiteService {

  private db!: SQLiteObject;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.platform.ready().then(() => {
      this.createDatabase();

      
    });
  }

  
  private async createDatabase(): Promise<void> {
    try {
      this.db = await this.sqlite.create({
        name: 'myApp.db',
        location: 'default',
      });
      console.log('Database created!');
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT UNIQUE, fileName TEXT, fileData TEXT)', 
        []
      );
    } catch (error) {
      console.error('Error creating database:', error);
    }
  }

  
  private async ensureDatabaseReady(): Promise<void> {
    if (!this.db) {
      await this.createDatabase();
    }
  }

  
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);  
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);  
    });
  }

  
  async insertFile(caseId: string, fileName: string, fileData: Blob): Promise<any> {
    await this.ensureDatabaseReady();  

    try {
      const base64Data = await this.blobToBase64(fileData);  
      const sql = 'INSERT INTO files (caseId, fileName, fileData) VALUES (?, ?, ?)';
      return await this.db.executeSql(sql, [caseId, fileName, base64Data]);
    } catch (error) {
      console.error('Error inserting file:', error);
    }
  }
  
  async getFileByCaseId(caseId: string): Promise<any> {
    await this.ensureDatabaseReady();  

    try {
      const sql = 'SELECT * FROM files WHERE caseId = ?';
      const result = await this.db.executeSql(sql, [caseId]);
      if (result.rows.length > 0) {
        const file = result.rows.item(0);

        
        return {
          caseId: file.caseId,
          fileName: file.fileName,
          fileData: file.fileData  
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving file:', error);
    }
  }
}
