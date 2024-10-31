import { Injectable } from '@angular/core';
import * as initSqlJs from 'sql.js';



@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private db: any;

  constructor() {
    this.initDatabase();
  }

  async initDatabase() {
    const SQL = await initSqlJs(); // Ensure this is correctly imported
    this.db = new SQL.Database();

    // Create tables for your data
    this.db.run(`
      CREATE TABLE IF NOT EXISTS Reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caseNo TEXT,
        formData TEXT,
        reportDoc TEXT
      );
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS Images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        caseNo TEXT,
        imgSrc TEXT,
        description TEXT
      );
    `);
  }

  saveFormData(caseNo: string, formData: any, reportDoc: string) {
    const stmt = this.db.prepare("INSERT INTO Reports (caseNo, formData, reportDoc) VALUES (?, ?, ?)");
    stmt.run([caseNo, JSON.stringify(formData), reportDoc]);
    stmt.free();
  }

  saveImage(caseNo: string, imgSrc: string, description: string) {
    const stmt = this.db.prepare("INSERT INTO Images (caseNo, imgSrc, description) VALUES (?, ?, ?)");
    stmt.run([caseNo, imgSrc, description]);
    stmt.free();
  }
  
  // Add methods to retrieve data as needed
}