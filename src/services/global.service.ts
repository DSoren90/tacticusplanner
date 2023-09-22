﻿import {
    ICharacter,
    IPersonalCharacter,
    IPersonalCharacterData,
} from '../models/interfaces';
import { PersonalDataService } from './personal-data.service';
import { StaticDataService } from './static-data.service';
import { LegendaryEvents, Rank } from '../models/enums';
import { BehaviorSubject, Observable } from 'rxjs';
import { useEffect, useState } from 'react';

export class GlobalService {
    static _characters: BehaviorSubject<ICharacter[]> = new BehaviorSubject<ICharacter[]>([]);
    static characters$: Observable<ICharacter[]> = this._characters.asObservable();

    static init(): void {
        PersonalDataService.init();
        const staticUnitData = StaticDataService.unitsData;
        const personalUnitData = PersonalDataService._data.value;

        const characters = staticUnitData.map((staticData) => {
            const personalData: IPersonalCharacter = personalUnitData.characters.find(
                (c) => c.name === staticData.name
            ) ?? {
                name: staticData.name,
                unlocked: false,
                progress: false,
                rank: Rank.Stone1,
                rarity: staticData.rarity,
                rarityStars: staticData.rarityStars,
                leSelection: LegendaryEvents.None,
                alwaysRecommend: false,
                neverRecommend: false,
                currentShards: 0,
                targetRarity: staticData.rarity,
                targetRarityStars: staticData.rarityStars,
            };
            return {
                ...staticData,
                ...personalData,
                rank: +personalData.rank,
            };
        });
        this._characters.next(characters);
    }
}


export const useCharacters = () => {
    const [characters, setCharacters] = useState<ICharacter[]>(GlobalService._characters.value);
    useEffect(() => {
        const subscription = GlobalService.characters$.subscribe(setCharacters);
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { characters };
};