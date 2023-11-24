import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('dermEats.db');

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


// --------------------------------------Nicht-Katalogisierte-Lebensmittel------------------------------------

// CREATE: Funktion zum Hinzufügen eines neuen nicht katalogisierten Lebensmittels
export const addNonCataloguedFood = (dailyLogId, name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO NonCataloguedFood (DailyLogID, Name) VALUES (?, ?)",
                [dailyLogId, name],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// READ: Funktion zum Abrufen aller nicht katalogisierten Lebensmittel
export const getAllNonCataloguedFood = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM NonCataloguedFood",
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

// READ: Funktion zum Abrufen eines nicht katalogisierten Lebensmittels anhand der DailyLogID
export const getAllNonCataloguedFoodByDailyLogId = (dailyLogID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name FROM NonCataloguedFood WHERE DailyLogID = ?",
                [dailyLogID],
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

// UPDATE: Funktion zum Aktualisieren eines nicht katalogisierten Lebensmittels
export const updateNonCataloguedFood = (nonCataloguedFoodId, name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE NonCataloguedFood SET Name = ? WHERE NonCataloguedFoodID = ?",
                [name, nonCataloguedFoodId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
};

// DELETE: Funktion zum Löschen eines nicht katalogisierten Lebensmittels
export const deleteNonCataloguedFood = (nonCataloguedFoodId) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM NonCataloguedFood WHERE NonCataloguedFoodID = ?",
                [nonCataloguedFoodId],
                (_, results) => resolve(results),
                (_, error) => reject(error)
            );
        });
    });
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

//READ: Funktion zum Suchen eines Lebensmittels anhand des Namens
export const searchMenuByName = (searchText) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name, MenuID FROM Menus WHERE Name LIKE ?",
                [`%${searchText}%`],
                (tx, results) => {
                    let menus = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let item = results.rows.item(i);
                        menus.push({ id: item.MenuID, name: item.Name });
                    }
                    resolve(menus);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

//READ: Funktion zum Suchen eines Lebensmittels anhand der MenuID
export const searchMenuById = (menuID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name FROM Menus WHERE MenuID = ?",
                [menuID],
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


// --------------------------------------DaiyliLog------------------------------------

// CREATE: Funktion, um einen neuen Eintrag in DailyLog hinzuzufügen
export const addDailyLog = (timestamp, mealName) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO DailyLog (Timestamp, MealName) VALUES (?, ?);",
                [timestamp, mealName],
                (tx, results) => {
                    resolve(results.insertId);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// READ: Funktion um Details aus DailyLog anhand der LogID abzurufen
export const getDailyLogDetailsById = (logID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM DailyLog WHERE LogID = ?;",
                [logID],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0));
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

// READ: Funktion um Details aus DailyLog anhand dem Timestamp (Datum) abzurufen
export const getDailyLogDetailsByTimestamp = (timestamp) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM DailyLog WHERE Timestamp = ?",
                [timestamp],
                (tx, results) => {
                    let logs = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        logs.push(results.rows.item(i));
                    }
                    resolve(logs);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// UPDATE: Funktion um einen Eintrag in DailyLog zu aktualisieren
export const updateDailyLog = (logID, timestamp, mealName) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE DailyLog SET Timestamp = ?, MealName = ? WHERE LogID = ?;",
                [timestamp, mealName, logID],
                () => {
                    resolve(true);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// DELETE: Funktion um einen Eintrag in DailyLog zu löschen
export const deleteDailyLog = (logID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM DailyLog WHERE LogID = ?;",
                [logID],
                () => {
                    resolve(true);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};


// --------------------------------------DailyLog_FoodItems------------------------------------

// CREATE: Funktion, um einen neuen Eintrag in DailyLog_FoodItems hinzuzufügen
export const addDailyLogFoodItem = (logID, foodID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO DailyLog_FoodItems (LogID, FoodID) VALUES (?, ?);",
                [logID, foodID],
                (tx, results) => {
                    resolve(results.insertId);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// READ: Funktion um FoodItems für einen bestimmten LogID abzurufen
export const getDailyLogFoodItemsByLogId = (logID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM DailyLog_FoodItems WHERE LogID = ?;",
                [logID],
                (tx, results) => {
                    var len = results.rows.length;
                    var foodItems = [];
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        foodItems.push(row);
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

// DELETE: Funktion um einen Eintrag in DailyLog_FoodItems zu löschen
export const deleteDailyLogFoodItem = (logID, foodID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM DailyLog_FoodItems WHERE LogID = ? AND FoodID = ?;",
                [logID, foodID],
                () => {
                    resolve(true);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};


// --------------------------------------DailyLog_Menus------------------------------------

// CREATE: Funktion, um einen neuen Eintrag in DailyLog_Menus hinzuzufügen
export const addDailyLogMenu = (logID, menuID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO DailyLog_Menus (LogID, MenuID) VALUES (?, ?);",
                [logID, menuID],
                (tx, results) => {
                    resolve(results.insertId);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// READ: Funktion um Menus für einen bestimmten LogID abzurufen
export const getDayliLogMenusByLogId = (logID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM DailyLog_Menus WHERE LogID = ?;",
                [logID],
                (tx, results) => {
                    var len = results.rows.length;
                    var menus = [];
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        menus.push(row);
                    }
                    resolve(menus);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};

// DELETE: Funktion um einen Eintrag in DailyLog_Menus zu löschen
export const deleteDailyLogMenu = (logID, menuID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM DailyLog_Menus WHERE LogID = ? AND MenuID = ?;",
                [logID, menuID],
                () => {
                    resolve(true);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    });
};


