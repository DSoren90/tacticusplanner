﻿import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, Popover } from '@mui/material';
import { ICharacter2, IMaterialRecipeIngredientFull } from '../models/interfaces';
import { StaticDataService } from '../services';
import Button from '@mui/material/Button';
import { Info } from '@mui/icons-material';
import { UpgradeImage } from './upgrade-image';
import { StoreContext } from '../reducers/store.provider';

export const CharacterUpgrades = ({
    upgradesChanges,
    character,
}: {
    character: ICharacter2;
    upgradesChanges: (upgrades: string[], updateInventory: IMaterialRecipeIngredientFull[]) => void;
}) => {
    const { inventory } = useContext(StoreContext);

    const [formData, setFormData] = useState({
        currentUpgrades: character.upgrades,
        newUpgrades: [] as string[],
        originalUpgrades: character.upgrades,
        originalRank: character.rank,
    });

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [updateInventory, setUpdateInventory] = React.useState<boolean>(false);

    const handleClick = (event: React.UIEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const possibleUpgrades = useMemo(() => {
        return StaticDataService.getUpgrades({
            id: character.name,
            rankStart: character.rank,
            rankEnd: character.rank + 1,
            appliedUpgrades: [],
        });
    }, [character.rank]);

    const handleUpgradeChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        let currentUpgrades: string[];
        let newUpgrades: string[];

        if (event.target.checked) {
            currentUpgrades = [...formData.currentUpgrades, value];
            const isNewUpgrade = !formData.originalUpgrades.includes(value);
            newUpgrades = isNewUpgrade ? [...formData.newUpgrades, value] : formData.newUpgrades;
        } else {
            currentUpgrades = formData.currentUpgrades.filter(x => x !== value);
            newUpgrades = formData.newUpgrades.filter(x => x !== value);
        }

        setFormData({
            ...formData,
            currentUpgrades,
            newUpgrades,
        });
    };

    const baseMaterials = useMemo<IMaterialRecipeIngredientFull[]>(() => {
        if (character.rank <= formData.originalRank) {
            const newUpgrades = possibleUpgrades.filter(x => formData.newUpgrades.includes(x.material));
            return StaticDataService.groupBaseMaterials(newUpgrades);
        } else if (character.rank > formData.originalRank) {
            const neededUpgrades = StaticDataService.getUpgrades({
                id: character.name,
                rankStart: formData.originalRank,
                rankEnd: character.rank,
                appliedUpgrades: formData.originalUpgrades,
            });

            console.log(neededUpgrades.map(x => x.material).join(', '));

            return StaticDataService.groupBaseMaterials(neededUpgrades);
        }

        return [];
    }, [formData.newUpgrades, character.rank]);

    useEffect(() => {
        if (updateInventory) {
            upgradesChanges(formData.currentUpgrades, baseMaterials);
        } else {
            upgradesChanges(formData.currentUpgrades, []);
        }
    }, [formData.currentUpgrades, baseMaterials, updateInventory]);

    useEffect(() => {
        if (character.rank === formData.originalRank) {
            setFormData({ ...formData, currentUpgrades: formData.originalUpgrades, newUpgrades: [] });
        } else {
            setFormData({ ...formData, currentUpgrades: [], newUpgrades: [] });
        }
    }, [character.rank]);

    return (
        <div>
            <h4>Applied upgrades</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {possibleUpgrades.map(x => (
                    <FormControlLabel
                        key={x.material}
                        control={
                            <Checkbox
                                checked={formData.currentUpgrades.includes(x.material)}
                                onChange={event => handleUpgradeChange(event, x.material)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label={`(${x.stat}) ${x.material}`}
                    />
                ))}
            </div>
            <hr />
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={!baseMaterials.length}
                        checked={updateInventory}
                        onChange={event => setUpdateInventory(event.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
                label={'Update inventory'}
            />
            <Button disabled={!updateInventory} onClick={handleClick} color={'primary'}>
                <Info />
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <div style={{ padding: 15 }}>
                    <p>Inventory after update:</p>
                    <ul style={{ padding: 0 }}>
                        {baseMaterials.map(x => (
                            <li
                                key={x.material}
                                style={{
                                    listStyleType: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    paddingBottom: 10,
                                }}>
                                <UpgradeImage material={x.material} iconPath={x.iconPath} />{' '}
                                {inventory.upgrades[x.material] ?? 0} - {x.count} ={' '}
                                {(inventory.upgrades[x.material] ?? 0) - x.count < 0
                                    ? 0
                                    : (inventory.upgrades[x.material] ?? 0) - x.count}
                            </li>
                        ))}
                    </ul>
                </div>
            </Popover>
        </div>
    );
};
