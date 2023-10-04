﻿import React, { useCallback, useMemo, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import {
    ILegendaryEvent, 
    ILegendaryEventBattle,
    ILegendaryEventProgressState,
    ILegendaryEventProgressTrack,
    ILegendaryEventTrackRequirement
} from '../models/interfaces';
import { LeTrackProgress } from './le-track-progress';
import { LeProgressOverview } from './le-progress-overview';
import { usePersonalData } from '../services';
import { LegendaryEvent } from '../models/enums';

export const LeProgress = ({ legendaryEvent }: { legendaryEvent: ILegendaryEvent}) => {
    const { personalData, updateLegendaryEventProgress } = usePersonalData();
    const [value, setValue] = React.useState(0);
    const [personalProgress, setPersonalProgress] = useState<ILegendaryEventProgressState>(personalData.legendaryEventsProgress[legendaryEvent.id] ?? {
        id: legendaryEvent.id,
        name: LegendaryEvent[legendaryEvent.id],
        alpha: {
            battles: Array.from({ length: 12 }, () => Array.from({ length: 6 }, () => false))
        },
        beta: {
            battles: Array.from({ length: 12 }, () => Array.from({ length: 6 }, () => false))
        },
        gamma: {
            battles: Array.from({ length: 12 }, () => Array.from({ length: 6 }, () => false))
        },
        regularMissions: 0,
        premiumMissions: 0
    });
    
    const getTrackProgress = useCallback(( name: 'alpha' | 'beta' | 'gamma', killPoints: number, requirements: ILegendaryEventTrackRequirement[]): ILegendaryEventProgressTrack => {
        const personalBattles = personalProgress[name].battles;
        return {
            name,
            requirements: [{
                name: 'Defeat All Enemies',
                points: killPoints,
                units: []
            }, ...requirements],
            battles: personalBattles.map((state, index) => ({ battleNumber: index + 1, state }))
        };
    }, []);

    const alphaProgress = useMemo(() => getTrackProgress('alpha', legendaryEvent.alphaTrack.killPoints, legendaryEvent.alphaTrack.unitsRestrictions), [legendaryEvent.id]);
    const betaProgress = useMemo(() => getTrackProgress('beta', legendaryEvent.betaTrack.killPoints, legendaryEvent.betaTrack.unitsRestrictions), [legendaryEvent.id]);
    const gammaProgress = useMemo(() => getTrackProgress('gamma',legendaryEvent.gammaTrack.killPoints, legendaryEvent.gammaTrack.unitsRestrictions), [legendaryEvent.id]);
    
    const handleBattlesChange = (section: 'alpha' | 'beta' | 'gamma') => (battles: ILegendaryEventBattle[]): void => {
        setPersonalProgress(current => {
            const eventSection = current[section];
            eventSection.battles = battles.map(x => x.state);
            updateLegendaryEventProgress(current);
            return current;
        });
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    
    const totalPoints = useMemo(() => {
        const alphaTotalPoints = alphaProgress.requirements.map(x => x.points).reduce((accumulator, currentValue) => accumulator + currentValue, 0) * alphaProgress.battles.length;
        const betaTotalPoints = betaProgress.requirements.map(x => x.points).reduce((accumulator, currentValue) => accumulator + currentValue, 0) * betaProgress.battles.length;
        const gammaTotalPoints = gammaProgress.requirements.map(x => x.points).reduce((accumulator, currentValue) => accumulator + currentValue, 0) * gammaProgress.battles.length;
        
        return alphaTotalPoints + betaTotalPoints + gammaTotalPoints;
    }, []);

    const getCurrentPoints = (trackProgress: ILegendaryEventProgressTrack) => {
        let total = 0;

        trackProgress.battles.forEach(battle => {
            battle.state.forEach((value, index) => {
                if(value) {
                    total += trackProgress.requirements[index].points;
                }
            });
        });

        return total;
    };

    const currentPoints = useMemo(() => {
        const alphaTotalPoints = getCurrentPoints(alphaProgress);
        const betaTotalPoints = getCurrentPoints(betaProgress);
        const gammaTotalPoints = getCurrentPoints(gammaProgress);

        return alphaTotalPoints + betaTotalPoints + gammaTotalPoints;
    }, [value]);


    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab value={0} label="Overview"/>
                <Tab value={1} label="Alpha" />
                <Tab value={2} label="Beta" />
                <Tab value={3} label="Gamma" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <p>Total: <span style={{ fontWeight: 700 }}> {currentPoints} / {totalPoints}</span></p>
                <LeProgressOverview progress={{
                    alpha: alphaProgress,
                    beta: betaProgress,
                    gamma: gammaProgress,
                }}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <LeTrackProgress trackProgress={alphaProgress} onStateUpdate={handleBattlesChange('alpha')} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <LeTrackProgress trackProgress={betaProgress} onStateUpdate={handleBattlesChange('beta')} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <LeTrackProgress trackProgress={gammaProgress} onStateUpdate={handleBattlesChange('gamma')} />
            </TabPanel>
        </div>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>{children}</div>
            )}
        </div>
    );
}
