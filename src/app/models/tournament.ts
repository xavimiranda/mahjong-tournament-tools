import { Duration } from "moment"
import { Player } from "./player"
import { RoundResults } from "good-enough-golfer"


export type SeatingMap = RoundResults & { players: Player[]}

export interface Tournament {
    players: Player[]
    rounds: Round[]
    settings: TournamentSettings 
}

export interface TournamentSettings {
    roundDuration: Duration
    startingGameScore: number
    firstPlaceUma: number
    secondPlaceUma: number
    thirdPlaceUma: number
    fourthPlaceUma: number

}

export interface Round {
    startingTime?: Date
    tables: Table[]
}

export interface PlayerSeat {
    player: Player
    wind?: string
    uma?: number
    finalGameScore?: number
    net?: number
}

export interface Table {
    players: PlayerSeat[]
    remainingRiichiSticks?: number
    number: number
}