import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dermEats.db');

const initializeDatabase = () => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog (LogID INTEGER PRIMARY KEY AUTOINCREMENT, Timestamp DATETIME, MealName VARCHAR);",);
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog_FoodItems (LogID INTEGER, FoodID INTEGER, FOREIGN KEY (LogID) REFERENCES DailyLog (LogID), FOREIGN KEY (FoodID) REFERENCES FoodItems (FoodID));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog_Menus (LogID INTEGER, MenuID INTEGER, FOREIGN KEY (LogID) REFERENCES DailyLog (LogID), FOREIGN KEY (MenuID) REFERENCES FoodItems (FoodID));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog_Symptoms (LogID INTEGER, SymptomID INTEGER, FOREIGN KEY (LogID) REFERENCES DailyLog (LogID), FOREIGN KEY (SymptomID) REFERENCES Symptoms (SymptomID));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS FoodItems (FoodID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS Menus (MenuID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS Symptoms (SymptomID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR, Strenght VARCHAR);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS MenuItems (MenuItemID INTEGER PRIMARY KEY AUTOINCREMENT, MenuID INTEGER, FoodID INTEGER, FoodName VARCHAR, FOREIGN KEY (MenuID) REFERENCES Menus (MenuID), FOREIGN KEY (FoodID) REFERENCES FoodItems (FoodID));");
    }, (error) => {
        console.error("Fehler bei der Datenbanktransaktion:", error);
    }, () => {
        console.log("Datenbank erfolgreich initialisiert");
    });
};

export default initializeDatabase;