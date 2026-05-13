export type basefinderTipos =
  | 'written_sign'
  | 'open_portal'
  | 'bubble_column'
  | 'sky_build'
  | 'bedrock'
  | 'spawner'
  | 'nether_roof'
  | 'item_frame'
  | 'ender_pearl'
  | 'nametag'
  | 'villager'
  | 'boat'
  | 'entity_cluster'

export interface basefinderValues{
    snowflake: string,
    tipos: basefinderTipos,
    chunkX: number,
    chunkZ: number,
    x: number,
    y: number,
    z: number,
    name: string,
    id: number,
    score: number
}

export interface basefinderLog{
    chunkX: number,
    chunkZ: number,
    tipo: basefinderTipos,
    x: number,
    y: number,
    z: number,
    score: number,
    name: string
}