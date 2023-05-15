import { LeagueStatus, MatchdayStatus } from '@api/arena/models';

export as namespace API;

export interface PaginatedResponse<T> {
  count: number;
  data: T[];
}

export interface AppStatusResponse {
  status: string;
}

export interface AuthSignInResponse {
  jwt: string;
  id: string;
  name: string;
  image: string;
  email: string;
}

export interface League {
  id: string;
  name: string;
  description: string;
  status: LeagueStatus;
  activeSeasons: Array<Omit<Season, 'league', 'matchdays'>>;
}

export namespace League {
  export interface CreateResponse {
    id: string;
    name: string;
    description: string;
  }

  export type GetLeaguesResponse = PaginatedResponse<
    Omit<League, 'activeSeasons'>
  >;

  export type GetLeagueResponse = League;

  export type GetSeasonsForLeagueResponse = PaginatedResponse<
    Omit<Season, 'league', 'matchdays'>
  >;
}

export interface Season {
  id: string;
  name: string;
  status: SeasonStatus;
  createdAt: string;
  updatedAt: string;
  league: {
    id: string;
    name: string;
  };
  matchdays: Array<{
    id: string;
    name: string;
    status: MatchdayStatus;
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export namespace Season {
  export type CreateSeasonResponse = Season;

  export type GetSeasonResponse = Season;

  export type GetSeasonsResponse = PaginatedResponse<Season>;

  export interface GenerateNextMatchdayResponse {
    id: string;
    name: string;
    status: MatchdayStatus;
    createdAt: string;
    updatedAt: string;
    startDate?: string;
    endDate?: string;
  }
}

export interface Matchday {
  id: string;
  name: string;
  status: MatchdayStatus;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export namespace Matchday {
  export type GetMatchdayResponse = Matchday;

  export type GetMatchesResponse = Array<{
    id: string;
    homeTeam: {
      id: string;
      name: string;
    };
    awayTeam: {
      id: string;
      name: string;
    };
    homeTeamScore?: number;
    awayTeamScore?: number;
    status: MatchStatus;
    createdAt: string;
    updatedAt: string;
    startTime: string | null;
  }>;
}
export namespace Team {
  export interface CreateTeamResponse {
    id: string;
    name: string;
    league: { id: string };
    invitedOwnerEmail?: string;
  }

  export type GetTeamsResponse = PaginatedResponse<TeamResponse>;
}
