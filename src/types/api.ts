export interface RawService {
  _id?: string;
  Address?: {
    Location?: {
      type?: 'Point';
      coordinates?: [number, number];
    };
  };
  ParentCategoryKey?: string;
  SubCategoryKey?: string;
  Info?: string;
  OpeningTimes?: { day: number; start: number; end: number }[];
  ClientGroups?: string[];
  // Accommodation-specific properties
  accommodationData?: Record<string, unknown>;
  sourceType?: string;
  isAppointmentOnly?: boolean;
  isTelephoneService?: boolean;
  isOpen247?: boolean;
}
