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
    winnerRiichiSticks: true
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
export const SEAT_WINDS = ['east', 'south', 'west', 'north'] as const
export type SeatWind = typeof SEAT_WINDS[number] 

export interface PlayerSeat {
    player: Player
    wind?: SeatWind
    uma?: number
    /**the score at the end of the game */
    gameScore?: number
    /** the gameScore minus any loans the player aquired */
    net?: number
    /** difference to the initial score */
    delta?: number
    loan?: number
    /**the score after uma calculations */
    finalScore?: number
    penalties?: number
}

export interface Table {
    seats: PlayerSeat[]
    remainingRiichiSticks?: number
    number: number
}