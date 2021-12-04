import Dexie, {Table} from 'dexie';

type FlavorText = {
    flavor_text: string;
    language: {
        name: string
    }
}

export type Pokemon = {
    id: number;
    name: string;
    sprites: {
        front_default: string
    }
    species: {
        data: {
            flavor_text_entries: FlavorText[]
        }
    }
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