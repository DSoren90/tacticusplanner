﻿import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ICharacter } from '../models/interfaces';
import { Rank, Rarity } from '../models/enums';
import { pooEmoji, starEmoji } from '../models/constants';

export const fitGridOnWindowResize = (gridRef: React.RefObject<AgGridReact>) => {
    function handleResize() {
        gridRef.current?.api.sizeColumnsToFit();
    }

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return handleResize;
};

export const rankToString = (rank: Rank): string => {
    switch (rank) {
        case Rank.Stone1:
            return 'Stone I';
        case Rank.Stone2:
            return 'Stone II';
        case Rank.Stone3:
            return 'Stone III';
        case Rank.Iron1:
            return 'Iron I';
        case Rank.Iron2:
            return 'Iron II';
        case Rank.Iron3:
            return 'Iron III';
        case Rank.Bronze1:
            return 'Bronze I';
        case Rank.Bronze2:
            return 'Bronze II';
        case Rank.Bronze3:
            return 'Bronze III';
        case Rank.Silver1:
            return 'Silver I';
        case Rank.Silver2:
            return 'Silver II';
        case Rank.Silver3:
            return 'Silver III';
        case Rank.Gold1:
            return 'Gold I';
        case Rank.Gold2:
            return 'Gold II';
        case Rank.Gold3:
            return 'Gold III';
        case Rank.Diamond1:
            return 'Diamond I';
        case Rank.Diamond2:
            return 'Diamond II';
        case Rank.Diamond3:
            return 'Diamond III';
        default:
            return '';
    }
};

export const stringToRank = (rankString: string): Rank => {
    switch (rankString) {
        case 'Stone I':
            return Rank.Stone1;
        case 'Stone II':
            return Rank.Stone2;
        case 'Stone III':
            return Rank.Stone3;
        case 'Iron I':
            return Rank.Iron1;
        case 'Iron II':
            return Rank.Iron2;
        case 'Iron III':
            return Rank.Iron3;
        case 'Bronze I':
            return Rank.Bronze1;
        case 'Bronze II':
            return Rank.Bronze2;
        case 'Bronze III':
            return Rank.Bronze3;
        case 'Silver I':
            return Rank.Silver1;
        case 'Silver II':
            return Rank.Silver2;
        case 'Silver III':
            return Rank.Silver3;
        case 'Gold I':
            return Rank.Gold1;
        case 'Gold II':
            return Rank.Gold2;
        case 'Gold III':
            return Rank.Gold3;
        case 'Diamond I':
            return Rank.Diamond1;
        case 'Diamond II':
            return Rank.Diamond2;
        case 'Diamond III':
            return Rank.Diamond3;
        default:
            throw new Error('Invalid rank string');
    }
};

export const getEnumValues = (enumObj: any): number[] => {
    return Object.keys(enumObj)
        .filter(key => typeof enumObj[key] === 'number')
        .map(key => enumObj[key]);
};

export const getCompletionRateColor = (curr: number, total: number): string => {
    if (!curr) {
        return 'white';
    }
    if (curr >= total) {
        return 'lightgreen';
    }

    const average = total / 2;

    if (curr <= average) {
        return 'lightcoral';
    }

    if (curr > average) {
        return 'yellow';
    }

    return 'white';
};
