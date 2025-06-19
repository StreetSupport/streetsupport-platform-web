export interface RawService {
  _id?: string;
  Address?: {
    Location?: {
      coordinates?: [number, number];
    };
  };
  ParentCategoryKey?: string;
  SubCategoryKey?: string;
  Info?: string;
  OpeningTimes?: { day: number; start: number; end: number }[];
  ClientGroups?: string[];
}
