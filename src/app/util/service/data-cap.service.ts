import { Injectable, signal, WritableSignal } from '@angular/core';
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from '@capacitor-community/sqlite'

const DB_USERS = 'myUserdb'

export interface User{
  id: number,
  name:string,
  active:number
}

@Injectable({
  providedIn: 'root'
})
export class DataCapService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  private db!:SQLiteDBConnection
  private user: WritableSignal<User[]> = signal<User[]>([])  

  constructor() {
   }


   async initialisePlugin()
   {
      this.db = await this.sqlite.createConnection
      (
        DB_USERS,
        false,
        'no-encryption',
        1,
        false
      )

      await this.db.open();

      const schema = `CREATE TABLE IF NOT EXIST users (
      id INTEGER PRIMARY KEY AUTO INCREMENT,
      name TEXT NOT NULL
      active INTEGER DEFAULT 1);`

      await this.db.execute(schema)
      this.loadUsers();

   }

   async loadUsers()
   {
    const users = await this.db.query("SELECT * FROM users;")

   }
}
