export const inventory: string[] = []
export function addItem(item : any) {
    inventory.push(item);
    console.log('Inventory:', inventory);
}

export function hasItem(item : any) {
    return inventory.includes(item);
}