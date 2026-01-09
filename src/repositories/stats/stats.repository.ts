/**
 * Stats repository interface
 * Abstracts the data source for platform statistics
 */

export interface Stats {
  organisations: number;
  services: number;
  partnerships: number;
}

export interface StatsRepository {
  getStats(): Promise<Stats>;
}
