﻿import { IDailyRaids, SetStateAction } from '../models/interfaces';

export type DailyRaidsAction =
    | {
          type: 'AddCompletedBattle';
          battle: string;
      }
    | {
          type: 'ResetCompletedBattles';
      }
    | SetStateAction<IDailyRaids>;

export const dailyRaidsReducer = (state: IDailyRaids, action: DailyRaidsAction) => {
    switch (action.type) {
        case 'Set': {
            return action.value;
        }
        case 'AddCompletedBattle': {
            return { ...state, completedBattles: [...state.completedBattles, action.battle] };
        }
        case 'ResetCompletedBattles': {
            return { ...state, completedBattles: [] };
        }
        default: {
            throw new Error();
        }
    }
};
