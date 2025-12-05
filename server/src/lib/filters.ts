import { z } from 'zod';

const normalizeString = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.toString().trim().toLowerCase();
  if (!trimmed || trimmed === 'all') return undefined;
  return trimmed;
};

const yesNoSchema = z
  .enum(['yes', 'no', 'all'])
  .optional()
  .transform((val) => (val && val !== 'all' ? val : undefined));

const genderSchema = z
  .enum(['male', 'female', 'other', 'all'])
  .optional()
  .transform((val) => (val && val !== 'all' ? val : undefined));

const ageSchema = z
  .enum(['18-25', '26-35', '36-45', '46-55', '56-65', '65+', 'all'])
  .optional()
  .transform((val) => (val && val !== 'all' ? val : undefined));

export const filterSchema = z.object({
  search: z.string().optional().transform(normalizeString),
  ward: z.string().optional().transform(normalizeString),
  booth: z.string().optional().transform(normalizeString),
  gender: genderSchema,
  caste: z.string().optional().transform(normalizeString),
  ageGroup: ageSchema,
  motherTongue: z.string().optional().transform(normalizeString),
  voterType: z.string().optional().transform(normalizeString),
  pollingStation: z.string().optional().transform(normalizeString),
  society: z.string().optional().transform(normalizeString),
  hasRationCard: yesNoSchema,
  hasComplaint: yesNoSchema,
  limit: z.coerce.number().min(1).max(1000).optional(),
  offset: z.coerce.number().min(0).optional(),
  source: z
    .enum(['scanner', 'reviewed', 'all'])
    .optional()
    .transform((val) => val ?? 'all'),
});

export type FilterParams = z.infer<typeof filterSchema> & { limit?: number; offset?: number; source?: 'scanner' | 'reviewed' | 'all' };

export const buildWhereClause = (filters: FilterParams) => {
  const conditions: string[] = ['p.IsActive = 1'];
  const params: Record<string, unknown> = {};

  if (filters.search) {
    conditions.push(`(
      LOWER(p.FullName) LIKE @search
      OR LOWER(IFNULL(p.EPICId, '')) LIKE @search
      OR LOWER(IFNULL(f.CardNumber, '')) LIKE @search
      OR LOWER(IFNULL(f.AddressLine1, '')) LIKE @search
      OR LOWER(IFNULL(f.AddressLine2, '')) LIKE @search
      OR LOWER(IFNULL(f.Area, '')) LIKE @search
      OR EXISTS (
        SELECT 1 FROM PhonesDraft ph
        WHERE ph.LocalPersonId = p.LocalPersonId
          AND LOWER(IFNULL(ph.PhoneNumber, '')) LIKE @search
      )
    )`);
    params.search = `%${filters.search}%`;
  }

  if (filters.gender) {
    conditions.push("LOWER(IFNULL(p.Gender, '')) = @gender");
    params.gender = filters.gender;
  }

  if (filters.caste) {
    conditions.push("LOWER(IFNULL(p.Caste, '')) = @caste");
    params.caste = filters.caste;
  }

  if (filters.motherTongue) {
    conditions.push("LOWER(IFNULL(p.MotherTongue, '')) = @motherTongue");
    params.motherTongue = filters.motherTongue;
  }

  if (filters.ward) {
    conditions.push("LOWER(IFNULL(f.Area, '')) = @ward");
    params.ward = filters.ward;
  }

  if (filters.hasRationCard) {
    conditions.push(
      filters.hasRationCard === 'yes'
        ? "LENGTH(TRIM(IFNULL(f.CardNumber, ''))) > 0"
        : "LENGTH(TRIM(IFNULL(f.CardNumber, ''))) = 0"
    );
  }

  if (filters.hasComplaint) {
    conditions.push(
      filters.hasComplaint === 'yes'
        ? "LENGTH(TRIM(IFNULL(f.Notes, ''))) > 0"
        : "LENGTH(TRIM(IFNULL(f.Notes, ''))) = 0"
    );
  }

  if (filters.ageGroup) {
    switch (filters.ageGroup) {
      case '18-25':
        conditions.push('p.AgeYears BETWEEN 18 AND 25');
        break;
      case '26-35':
        conditions.push('p.AgeYears BETWEEN 26 AND 35');
        break;
      case '36-45':
        conditions.push('p.AgeYears BETWEEN 36 AND 45');
        break;
      case '46-55':
        conditions.push('p.AgeYears BETWEEN 46 AND 55');
        break;
      case '56-65':
        conditions.push('p.AgeYears BETWEEN 56 AND 65');
        break;
      case '65+':
        conditions.push('p.AgeYears >= 65');
        break;
    }
  }

  return {
    clause: `WHERE ${conditions.join(' AND ')}`,
    params,
  };
};
