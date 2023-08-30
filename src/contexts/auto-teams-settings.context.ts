﻿import { createContext } from 'react';
import { IAutoTeamsPreferences } from '../models/interfaces';

export const defaultAutoTeamsPreferences: IAutoTeamsPreferences = {
    preferCampaign: false,
    ignoreRank: false,
    ignoreRecommended: false
};

export const AutoTeamsSettingsContext = createContext<IAutoTeamsPreferences>(defaultAutoTeamsPreferences);