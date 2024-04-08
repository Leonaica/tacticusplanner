﻿import { sum } from 'lodash';
import { ICharacter2 } from 'src/models/interfaces';
import { Rank, Rarity, RarityStars } from 'src/models/enums';

import dirtyDozenData from 'src/v2/data/dirtyDozen.json';
import { IDirtyDozenChar } from 'src/v2/features/dirty-dozen/dirty-dozen.models';

export class CharactersPowerService {
    public static getCharacterPower(character: ICharacter2): number {
        if (character.rank === Rank.Locked) {
            return 0;
        }

        const upgradeBoost =
            (1 / 9) *
            (CharactersPowerService.getRankCoeff(character.rank + 1) -
                CharactersPowerService.getRankCoeff(character.rank));

        // Leave this off as we're scaling so that 40,000 is the ultimate Power for any character.
        //      const dirtyDozenCoeff = CharactersPowerService.getDirtyDozenCoeff(character.name);

        const attributesWeight = 3000000 / 9326;
        const abilityWeight = 500000 / 41274;

        const powerLevel =
            //                dirtyDozenCoeff *
            attributesWeight *
                CharactersPowerService.getStarsCoeff(character.stars) *
                (CharactersPowerService.getRankCoeff(character.rank) +
                    upgradeBoost * (character.upgrades?.length ?? 0)) +
            abilityWeight *
                CharactersPowerService.getRarityCoeff(character.rarity) *
                (CharactersPowerService.getAbilityCoeff(character.activeAbilityLevel) +
                    CharactersPowerService.getAbilityCoeff(character.passiveAbilityLevel));
        return Math.round(powerLevel);
    }

    public static getDirtyDozenCoeff(characterId: string): number {
        const dirtyDozenChar: IDirtyDozenChar | undefined = dirtyDozenData.find(x => x.Name === characterId);
        if (!dirtyDozenChar) {
            return 1;
        }
        const rankings: number[] = [
            dirtyDozenChar.Pvp,
            dirtyDozenChar.GROrk,
            dirtyDozenChar.GRMortarion,
            dirtyDozenChar.GRNecron,
            dirtyDozenChar.GRTyranid,
            dirtyDozenChar.GRScreamer,
            dirtyDozenChar.GRRogalDorn,
        ];
        return 1 + (sum(rankings) - rankings.length) / 100;
    }

    public static getAbilityCoeff(level: number): number {
        if (level <= 22) {
            return level;
        } else if (level <= 39) {
            return 3.8 * (level - 22) + 22;
        } else if (level <= 40) {
            return 5.3 * (level - 39) + 86.6;
        } else if (level <= 44) {
            return 8.4 * (level - 40) + 91.9;
        } else {
            return 17.3 * (level - 44) + 125.5;
        }
    }

    public static getRarityCoeff(rarity: Rarity): number {
        switch (rarity) {
            case Rarity.Common:
            default:
                return 1.0;
            case Rarity.Uncommon:
                return 1.2;
            case Rarity.Rare:
                return 1.4;
            case Rarity.Epic:
                return 1.6;
            case Rarity.Legendary:
                return 1.8;
        }
    }

    public static getRankCoeff(rank: Rank): number {
        switch (rank) {
            case Rank.Stone1:
                return 1.0;
            case Rank.Stone2:
                return 1.25;
            case Rank.Stone3:
                return 1.25 ** 2;
            case Rank.Iron1:
                return 1.25 ** 3;
            case Rank.Iron2:
                return 1.25 ** 4;
            case Rank.Iron3:
                return 1.25 ** 5;
            case Rank.Bronze1:
                return 1.25 ** 6;
            case Rank.Bronze2:
                return 1.25 ** 7;
            case Rank.Bronze3:
                return 1.25 ** 8;
            case Rank.Silver1:
                return 1.25 ** 9;
            case Rank.Silver2:
                return 1.25 ** 10;
            case Rank.Silver3:
                return 1.25 ** 11;
            case Rank.Gold1:
                return 1.25 ** 12;
            case Rank.Gold2:
                return 1.25 ** 13;
            case Rank.Gold3:
                return 1.25 ** 14;
            case Rank.Diamond1:
                return 1.25 ** 15;
            case Rank.Diamond2:
                return 1.25 ** 16;
            case Rank.Diamond3:
                return 1.25 ** 17;

            case Rank.Locked:
            default:
                return 0;
        }
    }

    public static getStarsCoeff(rank: RarityStars): number {
        switch (rank) {
            case RarityStars.OneStar:
                return 1.1;
            case RarityStars.TwoStars:
                return 1.2;
            case RarityStars.ThreeStars:
                return 1.3;
            case RarityStars.FourStars:
                return 1.4;
            case RarityStars.FiveStars:
                return 1.5;
            case RarityStars.RedOneStar:
                return 1.6;
            case RarityStars.RedTwoStars:
                return 1.7;
            case RarityStars.RedThreeStars:
                return 1.8;
            case RarityStars.RedFourStars:
                return 1.9;
            case RarityStars.RedFiveStars:
                return 2.0;
            case RarityStars.BlueStar:
                return 2.1;

            case RarityStars.None:
            default:
                return 1.0;
        }
    }
}
