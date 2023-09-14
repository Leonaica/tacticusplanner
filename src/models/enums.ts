﻿export enum Alliance {
    Chaos = 'Chaos',
    Imperial = 'Imperial',
    Xenos = 'Xenos',
}

export enum Faction {
    Ultramarines = 'Ultramarines',
    Black_Legion = 'Black Legion',
    Orks = 'Orks',
    ADEPTA_SORORITAS = 'ADEPTA SORORITAS',
    Necrons = 'Necrons',
    Astra_militarum = 'Astra militarum',
    Death_Guard = 'Death guard',
    Black_Templars = 'Black templars',
    Aeldari = 'Aeldari',
    Space_Wolves = 'Space Wolves',
    T_Au = 'T\'au Empire',
    Dark_Angels = 'Dark Angels',
    Thousand_Sons = 'Thousand Sons',
    Tyranids = 'Tyranids',
}

export enum RarityString {
    Common = 'Common',
    Epic = 'Epic',
    Legendary = 'Legendary',
    Rare = 'Rare',
    Uncommon = 'Uncommon',
}

export enum Rarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
}

export enum RarityStars {
    OneStar,
    TwoStars,
    ThreeStarts,
    FourStarts,
    FiveStarts,
    RedOneStar,
    RedTwoStarts,
    RedThreeStarts,
    RedFourStarts,
    RedFiveStarts,
    DiamondStar
}

export enum Equipment {
    Crit = 'Crit',
    Block = 'Block',
    CritBooster = 'Crit Booster',
    BlockBooster = 'Block Booster',
    Defensive = 'Defensive',
}

export enum Trait {
    Psyker = 'Psyker',
    Overwatch = 'Overwatch',
    HeavyWeapon = 'Heavy Weapon',
    Infiltrate = 'Infiltrate',
    Flying = 'Flying',
    MKXGravis = 'MK X Gravis',
    Healer = 'Healer',
    FinalVengeance = 'Final Vengeance',
    LetTheGalaxyBurn = 'Let the Galaxy Burn',
    DeepStrike = 'Deep Strike',
    TerminatorArmour = 'Terminator Armour',
    Resilient = 'Resilient',
    BeastSnagga = 'Beast Snagga',
    Mechanic = 'Mechanic',
    Mechanical = 'Mechanical',
    Explodes = 'Explodes',
    Dakka = 'Dakka',
    Mounted = 'Mounted',
    ActOfFaith = 'Act of Faith',
    LivingMetal = 'Living Metal',
    IndirectFire = 'Indirect Fire',
    ContagionsOfNurgle = 'Contagions of Nurgle',
    PutridExplosion = 'Putrid Explosion',
    Parry = 'Parry',
    Terrifying = 'Terrifying',
    Unstoppable = 'Unstoppable',
    CloseCombatWeakness = 'Close Combat Weakness',
    Camouflage = 'Camouflage',
    WeaverOfFates = 'Weaver of Fates',
    BigTarget = 'Big Target',
    ShadowInTheWarp = 'Shadow in the Warp',
    Synapse = 'Synapse',
    SuppressiveFire = 'Suppressive Fire'
}

export enum DamageType {
    Physical = 'Physical',
    Psychic = 'Psychic',
    Bolter = 'Bolter',
    Piercing = 'Piercing',
    Power = 'Power',
    HeavyRound = 'Heavy Round',
    Chain = 'Chain',
    Projectile = 'Projectile',
    Flame = 'Flame',
    Molecular = 'Molecular',
    Particle = 'Particle',
    Plasma = 'Plasma',
    Energy = 'Energy',
    Las = 'Las',
    Blast = 'Blast',
    Direct = 'Direct',
    Pulse = 'Pulse',
    Melta = 'Melta',
}

export enum Rank {
    Undefined,
    Stone1,
    Stone2,
    Stone3,
    Iron1,
    Iron2,
    Iron3,
    Bronze1,
    Bronze2,
    Bronze3,
    Silver1,
    Silver2,
    Silver3,
    Gold1,
    Gold2,
    Gold3,
    Diamond1,
    Diamond2,
    Diamond3,
}

export enum LegendaryEvents {
    None = 0,
    JainZar = 1 << 0,
    AunShi = 1 << 1,
    ShadowSun = 1 << 2,
}

export enum LegendaryEvent {
    JainZar = 1,
    AunShi = 2,
    ShadowSun = 4,
}