﻿import {
    IAutoTeamsPreferences,
    ICharacter2,
    IGlobalState,
    ILegendaryEventProgressState,
    ILegendaryEventSelectedRequirements,
    ILegendaryEventSelectedTeams,
    IPersonalCharacterData2,
    IPersonalData2,
    IPersonalGoal,
    ISelectedTeamsOrdering,
    IViewPreferences,
    LegendaryEventData,
} from './interfaces';
import { StaticDataService } from '../services';
import { CharacterBias, Rank } from './enums';

export class GlobalState implements IGlobalState {
    readonly modifiedDate?: Date;

    readonly autoTeamsPreferences: IAutoTeamsPreferences;
    readonly characters: Array<ICharacter2>;
    readonly viewPreferences: IViewPreferences;
    readonly selectedTeamOrder: ISelectedTeamsOrdering;
    readonly leSelectedRequirements: LegendaryEventData<ILegendaryEventSelectedRequirements>;
    readonly goals: IPersonalGoal[];
    readonly leProgress: LegendaryEventData<ILegendaryEventProgressState>;
    readonly leSelectedTeams: LegendaryEventData<ILegendaryEventSelectedTeams>;

    constructor(personalData: IPersonalData2) {
        this.viewPreferences = personalData.viewPreferences;
        this.autoTeamsPreferences = personalData.autoTeamsPreferences;
        this.selectedTeamOrder = personalData.selectedTeamOrder;
        this.leSelectedRequirements = personalData.leSelectedRequirements;
        this.leSelectedTeams = personalData.leTeams;
        this.leProgress = personalData.leProgress;
        this.goals = personalData.goals;

        this.modifiedDate = personalData.modifiedDate;

        this.characters = StaticDataService.unitsData.map(staticData => {
            const personalCharData = personalData.characters.find(c => c.name === staticData.name);
            const combinedData: IPersonalCharacterData2 = {
                name: staticData.name,
                unlocked: personalCharData?.unlocked ?? false,
                rank: personalCharData?.rank ?? Rank.Stone1,
                rarity: personalCharData?.rarity ?? staticData.initialRarity,
                bias: personalCharData?.bias ?? CharacterBias.None,
            };
            return {
                ...staticData,
                ...combinedData,
                rank: +combinedData.rank,
            };
        });
    }

    static toStore(value: IGlobalState): IPersonalData2 {
        const charactersToStore: IPersonalCharacterData2[] = value.characters
            .filter(
                x =>
                    x.unlocked ||
                    x.bias !== CharacterBias.None ||
                    x.rank !== Rank.Stone1 ||
                    x.rarity !== x.initialRarity
            )
            .map(x => ({ name: x.name, unlocked: x.unlocked, rank: x.rank, rarity: x.rarity, bias: x.bias }));

        return {
            schemaVersion: 2,
            modifiedDate: value.modifiedDate,
            goals: value.goals,
            selectedTeamOrder: value.selectedTeamOrder,
            leTeams: value.leSelectedTeams,
            leProgress: value.leProgress,
            leSelectedRequirements: value.leSelectedRequirements,
            characters: charactersToStore,
            autoTeamsPreferences: value.autoTeamsPreferences,
            viewPreferences: value.viewPreferences,
        };
    }
}