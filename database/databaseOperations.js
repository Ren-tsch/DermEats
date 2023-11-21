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

//READ: Funktion zum Suchen eines Lebensmittels anhand des Namens
export const searchFoodItems = (searchText) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name, FoodID FROM FoodItems WHERE Name LIKE ?",
                [`%${searchText}%`],
                (tx, results) => {
                    let foodItems = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let item = results.rows.item(i);
                        foodItems.push({ id: item.FoodID, name: item.Name });
                    }
                    resolve(foodItems);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

//READ: Funktion um den Namen eines Lebensmittels anhand seiner ID abzurufen
export const getFoodNameById = (foodID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name FROM FoodItems WHERE FoodID = ?",
                [foodID],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0).Name);
                    } else {
                        resolve(null);
                    }
                },
                (error) => {
                    reject(error);
                }
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

// DELETE: Funktion zum Löschen eines Lebensmittels
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

// DELETE: Funktion zum Löschen eins Lebensmittels das in einem Menu enthalten ist.
export const updateMenuItemsBeforeFoodDeletion = (foodID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            // Hole den Namen des FoodItems
            tx.executeSql("SELECT Name FROM FoodItems WHERE FoodID = ?", [foodID], (tx, results) => {
                if (results.rows.length > 0) {
                    let foodName = results.rows.item(0).Name;

                    // Aktualisiere MenuItems
                    tx.executeSql("UPDATE MenuItems SET FoodName = ? WHERE FoodID = ?", [foodName, foodID], (tx, results) => {
                        resolve(results);
                    }, (error) => {
                        reject(error);
                    });
                }
            });
        });
    })
};


// --------------------------------------Menüs------------------------------------

// CREATE: Funktion zum Hinzufügen eines neuen Menüs
export const addMenu = (menuName) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO Menus (Name) VALUES (?)",
                [menuName],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// READ: Funktion zum Abrufen aller Menüs
export const getAllMenus = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM Menus",
                [],
                (_, results) => {
                    let menus = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        menus.push(results.rows.item(i));
                    }
                    resolve(menus);
                },
                (_, error) => reject(error)
            );
        });
    });
};

// UPDATE: Funktion zum Aktualisieren eines Menüs
export const updateMenu = (logId, name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE Menus SET Name = ? WHERE MenuID = ?",
                [name, logId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// DELETE: Funktion zum Löschen eines Menüs
export const deleteMenu = (logId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM Menus WHERE MenuID = ?",
                [logId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};


// --------------------------------------MenüItems------------------------------------

// CREATE: Funktion zum Hinzufügen eines neuen MenüItems
export const addMenuItem = (menuID, foodID, foodName) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO MenuItems (MenuID, FoodID, FoodName) VALUES (?, ?, ?)`,
                [menuID, foodID, foodName],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};

// READ: Funktion zum Abrufen aller MenüItems
export const getAllMenuItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM MenuItems`,
                [],
                (_, result) => resolve(result.rows._array),
                (_, error) => reject(error)
            );
        });
    });
};

//READ: Funktion zum Suchen der Lebensmittel in einem Menü anhand der MenüID
export const searchMenuItems = (menuID) => {
    return new Promise((resolve, reject) => {
        db.transaction(async (tx) => {
            tx.executeSql(
                "SELECT * FROM MenuItems WHERE MenuID = ?",
                [menuID],
                async (tx, results) => {
                    let foodItems = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let item = results.rows.item(i);
                        if (!item.FoodName && item.FoodID) {
                            item.FoodName = await getFoodNameById(item.FoodID);
                        }
                        foodItems.push({ MenuItemID: item.MenuItemID, FoodID: item.FoodID, FoodName: item.FoodName });
                    }
                    resolve(foodItems);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};


// UPDATE: Funktion zum Aktualisieren eines MenüItems
export const updateMenuItem = (menuItemID, menuID, foodID, foodName) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE MenuItems SET MenuID = ?, FoodID = ?, FoodName = ? WHERE MenuItemID = ?`,
                [menuID, foodID, foodName, menuItemID],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};

// DELETE: Funktion zum Löschen eines MenüItems anhand der MenuItemID und MenuID
export const deleteMenuItem = (menuItemID, menuID) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM MenuItems WHERE MenuItemID = ? AND MenuID = ?`,
                [menuItemID, menuID],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};
