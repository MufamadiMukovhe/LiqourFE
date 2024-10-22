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

  private async createDatabase() {
    try {
        this.db = await this.sqlite.create({
            name: 'myApp.db',
            location: 'default',
        });
        console.log('Database created!');
        await this.db.executeSql(
            'CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, caseId TEXT UNIQUE, fileName TEXT, fileData BLOB)',
            []
        );
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

async insertFile(caseId: string, fileName: string, fileData: Blob): Promise<any> {
  const sql = 'INSERT INTO files (caseId, fileName, fileData) VALUES (?, ?, ?)';
  return this.db.executeSql(sql, [caseId, fileName, fileData]);
}


async getFileByCaseId(caseId: string): Promise<any> {
  const sql = 'SELECT * FROM files WHERE caseId = ?';
  const result = await this.db.executeSql(sql, [caseId]);
  if (result.rows.length > 0) {
      return result.rows.item(0);
  }
  return null; 
}
}

