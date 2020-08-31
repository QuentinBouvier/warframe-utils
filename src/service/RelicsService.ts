import Items, { Item, Drop, Rarity } from 'warframe-items';

export default class RelicsService {
    private itemsPrime: Item[];
    public relics: Relic[];

    constructor() {
        this.itemsPrime = new Items({category: ['Primary', 'Secondary', 'Melee', 'Warframes', 'Sentinels', 'Archwing']});
        this.itemsPrime = this.itemsPrime.filter(x => x.tags?.find(x => x === 'Prime'));
        const relicsRaw = (new Items({ category: ['Relics'] })).filter(x => x.name.includes("Intact"));

        this.relics = relicsRaw.map(x => {
            const name = x.name;
            const splitName = x.name.split(" ");
            const items = this.itemsPrime.filter(x => x?.components?.some(y => y?.drops?.some(z => z.location === name)));
            const drops: RelicDrop[] = items.map(x => {
                const component = x?.components?.find(y => y.drops?.some(z => z.location === 'Axi A1 Intact'));
                const drop = component?.drops?.find(x => x.location === 'Axi A1 Intact');
                return <RelicDrop> {
                    parentName: x.name,
                    parentUniqueName: x.uniqueName,
                    parentImageName: x.imageName,
                    name: component?.name,
                    uniqueName: component?.uniqueName,
                    vaulted: x.vaulted,
                    rarity: drop?.rarity,
                    imageName: component?.imageName,
                    ducats: component?.ducats
                };
            });
            return <Relic> {
                uniqueName: x.uniqueName,
                name,
                type: splitName[0],
                letter: splitName[1].substring(0, 1),
                numeral: splitName[1].substring(1),
                vaulted: drops.some(y => y.vaulted),
                drops
            };
        });
    }
}

export interface Relic {
    uniqueName: string;
    name: string;
    type: string;
    letter: string;
    numeral: string;
    vaulted: boolean;
    drops: RelicDrop[]
}

interface RelicDrop {
    parentName: string;
    parentUniqueName: string;
    parentImageName: string;
    name: string;
    uniqueName: string;
    vaulted: boolean;
    rarity: Rarity;
    imageName: string;
    ducats: number;
}