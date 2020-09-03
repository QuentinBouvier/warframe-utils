import Items, { Item, Drop, Rarity, Component } from 'warframe-items';

export default class RelicsService {
    private itemsPrime: Item[];
    public relics: Relic[];

    constructor() {
        // Import all the items that can be looted in relics (Except Kavasa prime and Forma)
        this.itemsPrime = new Items({category: ['Primary', 'Secondary', 'Melee', 'Warframes', 'Sentinels', 'Archwing']})
            // Kavasa prime collar
            .concat(new Items({category: ['Skins']}).filter(x => x.uniqueName === '/Lotus/Upgrades/Skins/Kubrows/Collars/PrimeKubrowCollarA'));
        this.itemsPrime = this.itemsPrime.filter(x => x.name?.includes('Prime'));
        // Formas are a different brand of item
        const forma: Component = new Items({category: ['Misc']}).filter(x => x.uniqueName === '/Lotus/StoreItems/Types/Items/MiscItems/Forma')[0] as Component;
        // Import all relics once (Using their "Intact" occurence)
        const relicsRaw = (new Items({ category: ['Relics'] })).filter(x => x.name.includes("Intact"));

        this.relics = relicsRaw.map(x => {
            // Prepare the relic name
            const name = x.name;
            const splitName = x.name.split(" ");
            // Filter the items for which a component is part of the relic drop table
            const items = this.itemsPrime.filter(y => y.components?.some(z => z?.drops?.some(w => w.location === name)));
            const formaDrop = forma.drops.find(y => y.location === name);
            const drops: RelicDrop[] = items.flatMap(i => {
                // Gets every components in the item for the current relic
                const components = i?.components?.filter(c => c.drops?.some(d => d.location === name) && c.ducats);
                return components.flatMap(c => {
                    // Make the RelicDrop for each component on the loot table
                    const drops = c.drops.filter(d => d.location === name);
                    return drops.map(d => <RelicDrop> {
                        parentName: i.name,
                        parentUniqueName: i.uniqueName,
                        parentImageName: i.imageName,
                        name: c.name,
                        uniqueName: c.uniqueName,
                        vaulted: i.vaulted,
                        rarity: (d.chance > 0.25) ? 'Common' : (d.chance > 0.10) ? 'Uncommon' : 'Rare',
                        chance: d.chance,
                        imageName: c.imageName,
                        ducats: c.ducats,
                        wikiaUrl: i.wikiaUrl,
                    });
                });
            });
            if (formaDrop) {
                drops.push(<RelicDrop> {
                    name: forma.name,
                    uniqueName: forma.uniqueName,
                    vaulted: false,
                    rarity: (formaDrop.chance > 0.25) ? 'Common' : (formaDrop.chance > 0.10) ? 'Uncommon' : 'Rare',
                    chance: formaDrop.chance,
                    imageName: 'forma.png',
                });
            }
            return <Relic> {
                uniqueName: x.uniqueName,
                imageName: x.imageName,
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
    imageName: string;
    name: string;
    type: string;
    letter: string;
    numeral: string;
    vaulted: boolean;
    drops: RelicDrop[]
}

export interface RelicDrop {
    name: string;
    uniqueName: string;
    vaulted: boolean;
    rarity: Rarity;
    chance: number;
    imageName: string;
    parentName?: string;
    parentUniqueName?: string;
    parentImageName?: string;
    ducats?: number;
    wikiaUrl?: string;
}