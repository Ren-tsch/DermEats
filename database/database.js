import * as SQLite from 'expo-sqlite';
import foodItems from './data/foodItems.json';
import { insertFoodItemsFromJson } from './databaseOperations';

const db = SQLite.openDatabase('dermEats.db');

const initializeDatabase = () => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog (LogID INTEGER PRIMARY KEY AUTOINCREMENT, Timestamp DATETIME, MealName VARCHAR);",);
        tx.executeSql("CREATE TABLE IF NOT EXISTS NonCataloguedFood (NonCataloguedFoodID INTEGER PRIMARY KEY AUTOINCREMENT, DailyLogID INTEGER, Name VARCHAR, FOREIGN KEY (DailyLogID) REFERENCES DailyLog (LogID));")
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog_FoodItems (LogID INTEGER, FoodID INTEGER, FOREIGN KEY (LogID) REFERENCES DailyLog (LogID), FOREIGN KEY (FoodID) REFERENCES FoodItems (FoodID));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS DailyLog_Menus (LogID INTEGER, MenuID INTEGER, FOREIGN KEY (LogID) REFERENCES DailyLog (LogID), FOREIGN KEY (MenuID) REFERENCES FoodItems (FoodID));");
        tx.executeSql("CREATE TABLE IF NOT EXISTS FoodItems (FoodID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS Menus (MenuID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS Symptoms (SymptomID INTEGER PRIMARY KEY AUTOINCREMENT, Name VARCHAR, Strenght VARCHAR, Date DATETIME);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS MenuItems (MenuItemID INTEGER PRIMARY KEY AUTOINCREMENT, MenuID INTEGER, FoodID INTEGER, FoodName VARCHAR, FOREIGN KEY (MenuID) REFERENCES Menus (MenuID), FOREIGN KEY (FoodID) REFERENCES FoodItems (FoodID));");

        // Löschen alle Einträge aus den Tabellen
        // tx.executeSql("DELETE FROM DailyLog;");
        // tx.executeSql('DELETE FROM NonCataloguedFood;');
        // tx.executeSql("DELETE FROM DailyLog_FoodItems;");
        // tx.executeSql("DELETE FROM DailyLog_Menus;");
        // tx.executeSql('DELETE FROM FoodItems;')
        // tx.executeSql('DELETE FROM Menus')
        // tx.executeSql('DELETE FROM Symptoms')
        // tx.executeSql('DELETE FROM MenuItems')

    }, (error) => {
        console.error("Fehler bei der Datenbanktransaktion:", error);
    }, () => {
        console.log("Datenbank erfolgreich initialisiert");
        insertFoodItemsFromJson(foodItems);
    });

    // function debugPrintTable(tableName) {
    //     db.transaction(tx => {
    //         tx.executeSql(`SELECT * FROM ${tableName};`, [], (_, { rows }) => {
    //             console.log(`Inhalte der Tabelle ${tableName}:`, JSON.stringify(rows));
    //         });
    //     }, (error) => {
    //         console.error(`Fehler beim Auslesen der Tabelle ${tableName}:`, error);
    //     });
    // }
};

export default initializeDatabase;