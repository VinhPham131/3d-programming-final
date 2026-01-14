const SAVE_KEY = 'gameSavePoint';

export interface SaveData {
    lastCompletedRoom: number;
}

export function saveProgress(roomNumber: number): void {
    try {
        const saveData: SaveData = {
            lastCompletedRoom: roomNumber
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log(` Save point updated: Room ${roomNumber}`);
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}


export function loadSavePoint(): number {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const data: SaveData = JSON.parse(savedData);
            console.log(` Loaded save point: Room ${data.lastCompletedRoom}`);
            return data.lastCompletedRoom;
        }
    } catch (error) {
        console.error('Error loading save point:', error);
    }
    return 1;
}

export function clearSavePoint(): void {
    try {
        localStorage.removeItem(SAVE_KEY);
        console.log(' Save point cleared');
    } catch (error) {
        console.error('Error clearing save point:', error);
    }
}

export function getLastCompletedRoom(): number {
    return loadSavePoint();
}
