import { pickSources } from './db.js';
import { buildWhereClause, filterSchema, FilterParams } from './filters.js';

export interface StatsResponse {
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  otherVoters: number;
  youthVoters: number;
  duplicateVoters: number;
  voterCountOnHouse: number;
  totalBooth: number;
  totalEvent: number;
}

export interface CasteSlice {
  name: string;
  value: number;
  color: string;
}

export interface GenderAreaSlice {
  booth: string;
  male: number;
  female: number;
}

export interface VoterRecord {
  slNo: number;
  cardNo: string;
  name: string;
  age: number;
  gender: string;
  newAddress: string;
  voterId: string;
  parNo: string;
  wardName: string;
  wardNo: string;
  caste?: string;
  motherTongue?: string;
  phoneNo?: string;
  rationCardNo?: string;
  landmark?: string;
  nextHouseMobNo?: string;
  dataset: string;
}

export interface VoterResponse {
  total: number;
  data: VoterRecord[];
}

const palette = ['#0ea5e9', '#22c55e', '#f97316', '#e11d48', '#8b5cf6', '#14b8a6'];

const appendCondition = (clause: string, condition: string) =>
  clause ? `${clause} AND ${condition}` : `WHERE ${condition}`;

const defaultLimit = 200;

export const parseFilters = (query: Record<string, unknown>): FilterParams => {
  const parsed = filterSchema.parse(query);
  return {
    ...parsed,
    limit: parsed.limit ?? defaultLimit,
    offset: parsed.offset ?? 0,
  } as FilterParams;
};

export const fetchStats = (filters: FilterParams): StatsResponse => {
  const { clause, params } = buildWhereClause(filters);
  const sources = pickSources(filters.source);

  const aggregate = {
    totalVoters: 0,
    maleVoters: 0,
    femaleVoters: 0,
    otherVoters: 0,
    youthVoters: 0,
    duplicateVoters: 0,
    voterCountOnHouse: 0,
    totalBooth: 0,
    totalEvent: 0,
  } satisfies StatsResponse;

  sources.forEach(({ db }) => {
    const baseJoin = `FROM PersonsDraft p LEFT JOIN FamiliesDraft f ON f.LocalFamilyId = p.LocalFamilyId`;

    const stats = db.prepare(
      `SELECT
        COUNT(*) AS totalVoters,
        SUM(CASE WHEN LOWER(IFNULL(p.Gender, '')) = 'male' THEN 1 ELSE 0 END) AS maleVoters,
        SUM(CASE WHEN LOWER(IFNULL(p.Gender, '')) = 'female' THEN 1 ELSE 0 END) AS femaleVoters,
        SUM(CASE WHEN LOWER(IFNULL(p.Gender, '')) NOT IN ('male','female') THEN 1 ELSE 0 END) AS otherVoters,
        SUM(CASE WHEN p.AgeYears BETWEEN 18 AND 30 THEN 1 ELSE 0 END) AS youthVoters,
        COUNT(DISTINCT f.LocalFamilyId) AS voterCountOnHouse,
        COUNT(DISTINCT IFNULL(f.Area, 'unknown')) AS totalBooth,
        COUNT(DISTINCT f.FormId) AS totalEvent
      ${baseJoin}
      ${clause}`
    ).get(params) as StatsResponse;

    aggregate.totalVoters += stats.totalVoters;
    aggregate.maleVoters += stats.maleVoters;
    aggregate.femaleVoters += stats.femaleVoters;
    aggregate.otherVoters += stats.otherVoters;
    aggregate.youthVoters += stats.youthVoters;
    aggregate.voterCountOnHouse += stats.voterCountOnHouse;
    aggregate.totalBooth += stats.totalBooth;
    aggregate.totalEvent += stats.totalEvent;

    const duplicateClause = appendCondition(
      clause,
      "LENGTH(TRIM(IFNULL(p.EPICId, ''))) > 0"
    );

    const duplicates = db.prepare(
      `SELECT COUNT(*) AS duplicates FROM (
          SELECT p.EPICId
          ${baseJoin}
          ${duplicateClause}
          GROUP BY p.EPICId
          HAVING COUNT(*) > 1
        ) d`
    ).get(params) as { duplicates: number };

    aggregate.duplicateVoters += duplicates?.duplicates ?? 0;
  });

  return aggregate;
};

export const fetchCasteSlices = (filters: FilterParams): CasteSlice[] => {
  const { clause, params } = buildWhereClause(filters);
  const sources = pickSources(filters.source);
  const bucket = new Map<string, number>();

  sources.forEach(({ db }) => {
    const rows = db.prepare(
      `SELECT LOWER(IFNULL(p.Caste, 'others')) AS caste, COUNT(*) AS count
       FROM PersonsDraft p
       LEFT JOIN FamiliesDraft f ON f.LocalFamilyId = p.LocalFamilyId
       ${clause}
       GROUP BY caste`
    ).all(params) as { caste: string; count: number }[];

    rows.forEach(({ caste, count }) => {
      const key = caste || 'others';
      bucket.set(key, (bucket.get(key) ?? 0) + count);
    });
  });

  return Array.from(bucket.entries()).map(([name, value], idx) => ({
    name: name === 'others' ? 'Others' : name.toUpperCase(),
    value,
    color: palette[idx % palette.length],
  }));
};

export const fetchGenderAreaSlices = (filters: FilterParams): GenderAreaSlice[] => {
  const { clause, params } = buildWhereClause(filters);
  const sources = pickSources(filters.source);
  const bucket = new Map<string, { male: number; female: number }>();

  sources.forEach(({ db }) => {
    const rows = db.prepare(
      `SELECT LOWER(IFNULL(f.Area, 'Unknown')) AS booth,
        SUM(CASE WHEN LOWER(IFNULL(p.Gender, '')) = 'male' THEN 1 ELSE 0 END) AS male,
        SUM(CASE WHEN LOWER(IFNULL(p.Gender, '')) = 'female' THEN 1 ELSE 0 END) AS female
       FROM PersonsDraft p
       LEFT JOIN FamiliesDraft f ON f.LocalFamilyId = p.LocalFamilyId
       ${clause}
       GROUP BY booth
       ORDER BY booth`
    ).all(params) as GenderAreaSlice[];

    rows.forEach(({ booth, male, female }) => {
      const current = bucket.get(booth) ?? { male: 0, female: 0 };
      current.male += male;
      current.female += female;
      bucket.set(booth, current);
    });
  });

  return Array.from(bucket.entries()).map(([booth, counts]) => ({
    booth,
    male: counts.male,
    female: counts.female,
  }));
};

const composeAddress = (row: any) =>
  [row.AddressLine1, row.AddressLine2, row.Area, row.City, row.District, row.State]
    .filter(Boolean)
    .join(', ');

export const fetchVoters = (filters: FilterParams): VoterResponse => {
  const { clause, params } = buildWhereClause(filters);
  const sources = pickSources(filters.source);
  const limit = filters.limit ?? defaultLimit;
  const offset = filters.offset ?? 0;

  let slNo = offset + 1;
  const data: VoterRecord[] = [];
  let total = 0;

  sources.forEach(({ db, key }) => {
    const baseSelect = `FROM PersonsDraft p
      LEFT JOIN FamiliesDraft f ON f.LocalFamilyId = p.LocalFamilyId
      LEFT JOIN PhonesDraft ph ON ph.LocalPersonId = p.LocalPersonId AND ph.IsPrimary = 1`;

    const pageRows = db.prepare(
      `SELECT
        p.LocalPersonId,
        p.FullName,
        p.AgeYears,
        p.Gender,
        p.EPICId,
        p.Caste,
        p.MotherTongue,
        f.CardNumber,
        f.Area,
        f.FormId,
        f.AddressLine1,
        f.AddressLine2,
        f.City,
        f.District,
        f.State,
        f.Pincode,
        f.Landmark,
        f.NextHouseMobile,
        ph.PhoneNumber
      ${baseSelect}
      ${clause}
      ORDER BY p.LocalPersonId DESC
      LIMIT ${limit} OFFSET ${offset}`
    ).all(params) as any[];

    const countRow = db.prepare(
      `SELECT COUNT(*) AS total ${baseSelect} ${clause}`
    ).get(params) as { total: number };

    total += countRow?.total ?? 0;

    pageRows.forEach((row) => {
      data.push({
        slNo: slNo++,
        cardNo: row.CardNumber ?? '—',
        name: row.FullName ?? 'Unknown',
        age: row.AgeYears ?? 0,
        gender: row.Gender ?? 'Other',
        newAddress: composeAddress(row) || 'Address not available',
        voterId: row.EPICId ?? 'N/A',
        parNo: row.FormId ? `FORM-${row.FormId}` : 'N/A',
        wardName: row.Area ?? 'N/A',
        wardNo: row.FormId ? String(row.FormId) : '—',
        caste: row.Caste ?? undefined,
        motherTongue: row.MotherTongue ?? undefined,
        phoneNo: row.PhoneNumber ?? row.NextHouseMobile ?? undefined,
        rationCardNo: row.CardNumber ?? undefined,
        landmark: row.Landmark ?? undefined,
        nextHouseMobNo: row.NextHouseMobile ?? undefined,
        dataset: key,
      });
    });
  });

  return { total, data };
};
