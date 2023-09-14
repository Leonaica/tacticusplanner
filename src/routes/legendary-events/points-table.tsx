﻿import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    CellClassParams,
    ColDef,
    ColGroupDef,
    ITooltipParams,
    RowClassParams, RowStyle
} from 'ag-grid-community';

import {
    ILegendaryEvent, ILegendaryEventTrack,
    SelectedTeams
} from '../../models/interfaces';
import { Rank } from '../../models/enums';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { fitGridOnWindowResize } from '../../shared-logic/functions';
import { PersonalDataService } from '../../services';
import { sum, uniq } from 'lodash';
import { CharactersSelection, ITableRow } from './legendary-events.interfaces';


const PointsTable = (props: { legendaryEvent: ILegendaryEvent, selectionChange: (selection: CharactersSelection) => void  }) => {
    const { legendaryEvent } = props;
    const personalLegendaryEvent = useMemo(() => PersonalDataService.getLEPersonalData(legendaryEvent.id), [legendaryEvent.id]);
    const [selection, setSelection] = useState<CharactersSelection>(CharactersSelection.All);

    const gridRef = useRef<AgGridReact>(null);

    const columnsDef: Array<ColDef | ColGroupDef> = useMemo(() =>[
        {
            headerName: 'Position',
            field: 'position',
            maxWidth: 100,
            width: 100,
            minWidth: 100,
            pinned: true,
            sortable: true,
            sort: 'asc'
        },
        {
            field: 'name',
            width: 150,
            sortable: true,
            cellClass: (params: CellClassParams<ITableRow>) => params.data?.className,
            tooltipValueGetter: (params: ITooltipParams<ITableRow>) => params.data?.tooltip
        },
        {
            headerName: 'Total',
            children: [
                {
                    field: 'totalPoints',
                    headerName: 'Points',
                    width: 100,
                    sortable: true,
                },
                {
                    field: 'totalSlots',
                    headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                    width: 100,
                    sortable: true,
                }
            ]
        },
        {
            headerName: legendaryEvent.alphaTrack.name,
            children: [
                {
                    field: 'alphaPoints',
                    headerName: 'Points',
                    width: 100,
                    sortable: true,
                },
                {
                    field: 'alphaSlots',
                    headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                    width: 100,
                    sortable: true,
                }
            ]
        },
        {
            headerName: legendaryEvent.betaTrack.name,
            children: [
                {
                    field: 'betaPoints',
                    headerName: 'Points',
                    width: 100,
                    sortable: true,
                },
                {
                    field: 'betaSlots',
                    headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                    width: 100,
                    sortable: true,
                }
            ]
        },
        {
            headerName: legendaryEvent.gammaTrack.name,
            children: [
                {
                    field: 'gammaPoints',
                    headerName: 'Points',
                    width: 100,
                    sortable: true,
                },
                {
                    field: 'gammaSlots',
                    headerName: selection === 'selected' ? 'Times selected' : 'Slots',
                    width: 100,
                    sortable: true,
                }
            ]
        },
    ], [selection]);

    const selectedChars = useMemo(() => {
        const alphaChars = Object.values(personalLegendaryEvent.alpha).flat();
        const betaChars = Object.values(personalLegendaryEvent.beta).flat();
        const gammaChars = Object.values(personalLegendaryEvent.gamma).flat();

        return uniq([...alphaChars, ...betaChars, ...gammaChars]);
    }, [personalLegendaryEvent.id]);

    const selectedCharsRows: ITableRow[] = useMemo(() => {
        const alpha = getPointsAndSlots(legendaryEvent.alphaTrack, getRestrictionsByChar(personalLegendaryEvent.alpha));
        const beta = getPointsAndSlots(legendaryEvent.betaTrack, getRestrictionsByChar(personalLegendaryEvent.beta));
        const gamma = getPointsAndSlots(legendaryEvent.gammaTrack, getRestrictionsByChar(personalLegendaryEvent.gamma));

        return legendaryEvent.allowedUnits
            .filter(x => selectedChars.includes(x.name))
            .sort((a,b) => {
                const aTotal = (alpha[a.name]?.points ?? 0) + (beta[a.name]?.points ?? 0) + (gamma[a.name]?.points ?? 0);
                const bTotal = (alpha[b.name]?.points ?? 0) + (beta[b.name]?.points ?? 0) + (gamma[b.name]?.points ?? 0);
                
                return bTotal - aTotal;
            })
            .map((x, index) => ({
                name: x.name,
                position: index + 1,
                className: Rank[x.rank].toLowerCase(),
                tooltip: x.name + ' - ' + Rank[x.rank ?? 0],
                alphaPoints: alpha[x.name]?.points ?? 0,
                alphaSlots: alpha[x.name]?.slots ?? 0,
                betaPoints: beta[x.name]?.points ?? 0,
                betaSlots: beta[x.name]?.slots ?? 0,
                gammaPoints: gamma[x.name]?.points ?? 0,
                gammaSlots: gamma[x.name]?.slots ?? 0,
                totalPoints: (alpha[x.name]?.points ?? 0) + (beta[x.name]?.points ?? 0) + (gamma[x.name]?.points ?? 0),
                totalSlots: (alpha[x.name]?.slots ?? 0) + (beta[x.name]?.slots ?? 0) + (gamma[x.name]?.slots ?? 0),
            }));

        function getRestrictionsByChar(selectedTeams: SelectedTeams): Record<string, string[]> {
            const result: Record<string, string[]> = {};

            for (const key in selectedTeams) {
                const values = selectedTeams[key];
                values.forEach((value) => {
                    if (!result[value]) {
                        result[value] = [];
                    }
                    result[value].push(key);
                });
            }
            return result;
        }

        function getPointsAndSlots(track: ILegendaryEventTrack, restrictionsByChar: Record<string, string[]>): Record<string, {
            name: string,
            slots: number,
            points: number,
        }> {
            const result: Record<string, {
                name: string,
                slots: number,
                points: number,
            }> = {};

            for (const key in restrictionsByChar) {
                const restrictions = restrictionsByChar[key];
                result[key] = {
                    name: key,
                    slots: restrictionsByChar[key].length,
                    points: sum(restrictions.map(x => track.getRestrictionPoints(x))) + track.killPoints
                };
            }
            return result;
        }
    }, [personalLegendaryEvent.id]);

    const rows = useMemo<ITableRow[]>(() => {
        const chars = selection === 'all'
            ? legendaryEvent.allowedUnits
            : selection === 'unlocked'
                ? legendaryEvent.allowedUnits.filter(x => x.unlocked)
                : [];

        return chars
            .sort((a,b) => b.legendaryEvents[legendaryEvent.id].totalPoints - a.legendaryEvents[legendaryEvent.id].totalPoints)
            .map((x, index) => ({
                name: x.name,
                position: index + 1,
                className: Rank[x.rank].toLowerCase(),
                tooltip: x.name + ' - ' + Rank[x.rank ?? 0],
                alphaPoints: x.legendaryEvents[legendaryEvent.id].alphaPoints,
                alphaSlots: x.legendaryEvents[legendaryEvent.id].alphaSlots,
    
                betaPoints: x.legendaryEvents[legendaryEvent.id].betaPoints,
                betaSlots: x.legendaryEvents[legendaryEvent.id].betaSlots,
    
                gammaPoints: x.legendaryEvents[legendaryEvent.id].gammaPoints,
                gammaSlots: x.legendaryEvents[legendaryEvent.id].gammaSlots,
    
                totalPoints: x.legendaryEvents[legendaryEvent.id].totalPoints,
                totalSlots: x.legendaryEvents[legendaryEvent.id].totalSlots,
            }));
    }
    , [selection]);

    const getRowStyle = (params: RowClassParams<ITableRow>): RowStyle => {
        return { background: (params.node.rowIndex ?? 0) % 2 === 0 ? 'lightsteelblue' : 'white' };
    };

    useEffect(() => {
        gridRef.current?.api?.sizeColumnsToFit();
    }, [rows]);

    const onFilterTextBoxChanged = useCallback((change: ChangeEvent<HTMLInputElement>) => {
        gridRef.current?.api.setQuickFilter(
            change.target.value
        );
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <TextField sx={{ margin: '10px', width: '300px' }} label="Quick Filter" variant="outlined" onChange={onFilterTextBoxChanged}/>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label" style={{ fontWeight: 700 }}>Characters
                        Selection</FormLabel>
                    <RadioGroup
                        style={{ display: 'flex', flexDirection: 'row' }}
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={CharactersSelection.All}
                        onChange={(_, value) => {
                            setSelection(value as CharactersSelection);
                            props.selectionChange(value as CharactersSelection);
                        }}
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value={CharactersSelection.All} control={<Radio/>} label="All"/>
                        <FormControlLabel value={CharactersSelection.Unlocked} control={<Radio/>} label="Only unlocked"/>
                        <FormControlLabel value={CharactersSelection.Selected} control={<Radio/>} label="Only selected"/>
                    </RadioGroup>
                </FormControl>
            </div>
            <div className="ag-theme-material" style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    tooltipShowDelay={100}
                    rowData={selection === 'selected' ? selectedCharsRows : rows}
                    columnDefs={columnsDef}
                    getRowStyle={getRowStyle}
                    onGridReady={fitGridOnWindowResize(gridRef)}
                    onSortChanged={() => gridRef.current?.api?.refreshCells()}
                    onFilterChanged={() => gridRef.current?.api?.refreshCells()}
                >
                </AgGridReact>
            </div>
        </div>
    );
};

export default PointsTable;