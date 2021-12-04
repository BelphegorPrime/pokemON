import Dexie, {Table} from 'dexie';

export type Pokemon = {
    id: number;
}

export class SubClassedDexie extends Dexie {
    pokemonTable!: Table<Pokemon>;

    constructor() {
        super('pokemonDB');
        this.version(1).stores({
            pokemonTable: '++id', // Primary key and indexed props
        });
    }
}

export const db = new SubClassedDexie();