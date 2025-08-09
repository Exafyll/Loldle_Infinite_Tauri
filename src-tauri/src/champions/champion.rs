use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct Champion {
    pub name: String,
    pub gender: Gender,
    pub positions: Vec<Position>,
    pub species: Vec<Species>,
    pub resource: Resource,
    pub range_type: Vec<RangeType>,
    pub regions: Vec<Region>,
    pub release_year: u16,
    pub icon_path: String,
}

#[derive(Serialize, Clone)]
pub enum Gender {
    Male,
    Female,
    Other,
}

#[derive(Serialize, Clone)]
pub enum Position {
    Top,
    Jungle,
    Middle,
    Bottom,
    Support,
}

#[derive(Serialize, Clone)]
pub enum Species {
    Human,
    Plant,
    MagicallyAltered,
    Darkin,
    Magicborn,
    Vastayan,
    Minotaur,
    Undead,
    Yordle,
    God,
    Spirit,
    Spiritualist,
    Iceborn,
    Dragon,
    GodWarrior,
    Celestial,
    Golem,
    Cyborg,
    VoidBeing,
    Aspect,
    ChemicallyAltered, 
    Demon,
    Revenant,
    Unknown,
    Dog,
    Yeti,

}

#[derive(Serialize, Clone)]
pub enum Resource {
    Mana,
    Manaless,
    Energy,
    Health,
    Rage,
    Shield,
    Fury,
    Ferocity,
    Heat,
}

#[derive(Serialize, Clone)]
pub enum RangeType {
    Ranged,
    Melee,
}

#[derive(Serialize, Clone)]
pub enum Region {
    Noxus,
    Ixtal,
    Runeterra,
    Shurima,
    Piltover,
    Ionia,
    Freljord,
    Targon,
    Zuan,
    Void,
    BandleCity,
    ShadowIsles,
    Bilgewater,
    Demacia,
    Camavor,
    Icathia,
}
