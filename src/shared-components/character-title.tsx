﻿import React from 'react';
import { CharacterBias, Rank } from '../models/enums';
import { pooEmoji, starEmoji } from '../models/constants';
import { CharacterImage } from './character-image';
import { Tooltip } from '@mui/material';
import { RarityImage } from 'src/v2/components/images/rarity-image';
import { RankImage } from 'src/v2/components/images/rank-image';
import { IUnit } from 'src/v2/features/characters/characters.models';
import { isCharacter, isMow } from 'src/v2/features/characters/units.functions';

export const CharacterTitle = ({
    character,
    showLockedWithOpacity,
    onClick,
    hideName,
    short,
    imageSize,
}: {
    character: IUnit;
    showLockedWithOpacity?: boolean;
    hideName?: boolean;
    onClick?: () => void;
    short?: boolean;
    imageSize?: number;
}) => {
    if (isCharacter(character)) {
        const isUnlocked = character.rank > Rank.Locked;

        const emoji =
            character.bias === CharacterBias.AlwaysRecommend
                ? starEmoji
                : character.bias === CharacterBias.NeverRecommend
                ? pooEmoji
                : '';
        const opacity = showLockedWithOpacity ? (isUnlocked ? 1 : 0.5) : 1;
        const cursor = onClick ? 'pointer' : undefined;

        const characterFull = (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity, cursor }} onClick={onClick}>
                <CharacterImage
                    key={character.name}
                    icon={character.icon}
                    name={character.name}
                    imageSize={imageSize}
                />
                {!hideName && <span>{character.name}</span>}
                <RarityImage rarity={character.rarity} />
                {isUnlocked ? <RankImage key={character.rank} rank={character.rank} /> : undefined}
                <Tooltip
                    placement="top"
                    title={
                        character.bias === CharacterBias.AlwaysRecommend
                            ? 'Always recommend first'
                            : character.bias === CharacterBias.NeverRecommend
                            ? 'Always recommend last'
                            : ''
                    }>
                    <span>{emoji}</span>
                </Tooltip>
            </div>
        );

        const characterShort = (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', opacity, cursor }} onClick={onClick}>
                <Tooltip title={character.name} leaveDelay={1000} placement="top">
                    <span style={{ height: imageSize }}>
                        <CharacterImage
                            key={character.name}
                            icon={character.icon}
                            name={character.name}
                            imageSize={imageSize}
                        />
                    </span>
                </Tooltip>
                {!hideName && <span>{character.name}</span>}
            </div>
        );

        return short ? characterShort : characterFull;
    }

    if (isMow(character)) {
        return (
            <div className="flex-box gap5 p5" onClick={onClick}>
                <CharacterImage icon={character.badgeIcon} imageSize={35} />
                <span>{character.name}</span>
            </div>
        );
    }

    return <></>;
};
