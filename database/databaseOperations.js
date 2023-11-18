import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dermEats.db');

// --------------------------------------Mahlzeiten------------------------------------

// CREATE: Funktion zum Hinzufügen einer neuen Mahlzeit
export const addMeal = (mealName, timestamp) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO DailyLog (Timestamp, MealName) VALUES (?, ?)",
                [timestamp, mealName],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// READ: Funktion zum Abrufen aller Mahlzeiten
export const getAllMeals = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM DailyLog",
                [],
                (_, results) => {
                    let meals = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        meals.push(results.rows.item(i));
                    }
                    resolve(meals);
                },
                (_, error) => reject(error)
            );
        });
    });
};

// UPDATE: Funktion zum Aktualisieren einer Mahlzeit
export const updateMeal = (logId, mealName, timestamp) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE DailyLog SET MealName = ?, Timestamp = ? WHERE LogID = ?",
                [mealName, timestamp, logId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// DELETE: Funktion zum Löschen einer Mahlzeit
export const deleteMeal = (logId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM DailyLog WHERE LogID = ?",
                [logId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};


// --------------------------------------Lebensmittel------------------------------------

// CREATE: Funktion zum Hinzufügen eines neuen Lebensmittels
export const addFood = (foodName) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO FoodItems (Name) VALUES (?)",
                [foodName],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// READ: Funktion zum Abrufen aller Lebensmittel
export const getAllFood = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM FoodItems",
                [],
                (_, results) => {
                    let foods = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        foods.push(results.rows.item(i));
                    }
                    resolve(foods);
                },
                (_, error) => reject(error)
            );
        });
    });
};

// UPDATE: Funktion zum Aktualisieren eines Lebensmittels
export const updateFood = (logId, name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE FoodItems SET Name = ? WHERE FoodID = ?",
                [name, logId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// DELETE: Funktion zum Löschen einer Mahlzeit
export const deleteFood = (logId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM FoodItems WHERE FoodID = ?",
                [logId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};
