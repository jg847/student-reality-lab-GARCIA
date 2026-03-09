# Title
Rent Burden in Newark

## Essential Question (1 sentence)
What minimum hourly wage must a single student in Newark, NJ earn to rent a typical apartment without spending more than 30% of their gross income on housing costs?

## Claim (Hypothesis) (1 sentence; can be wrong)
A single student in Newark needs about $35/hour to stay under the 30% housing-cost burden threshold when paying market rent.

## Audience (who is this for?)
This project is for Newark-area college students (NJIT, Rutgers-Newark, Essex County College) and recent graduates who need a practical, data-backed way to judge whether a lease is financially sustainable.

## STAR Draft (bullets)
- **S — Situation: Why this matters to students now**
  - Newark-area rents have increased faster than entry-level wages, making off-campus and post-grad housing decisions high risk.
- **T — Task: What the viewer should be able to conclude or do**
  - A viewer should be able to determine whether their expected income and housing setup places them below 30%, between 30% and 50%, or above 50% burden.
- **A — Action: What you will build (views + interaction)**
  - Build a narrative dashboard with a rent trend view, wage-gap context chart, slider-based burden simulator, and a standalone personal affordability calculator with live results.
- **R — Result: What you expect the data to show; what metric you'll report**
  - The data is expected to show that common student/entry wages fall short of independent living affordability; the primary reported metric is **housing-cost burden percentage** (`total housing cost / gross monthly income`).

## Dataset & Provenance (source links + retrieval date + license/usage)
- **Zillow Observed Rent Index (ZORI), county-level rental series**
  - Link: https://www.zillow.com/research/data/
  - Usage: Zillow Research public dataset; used for educational/academic analysis with source attribution.
- **MIT Living Wage Calculator, Essex County, NJ**
  - Link: https://livingwage.mit.edu/counties/34013
  - =
  - Usage: Educational use with attribution; copyrighted by Dr. Amy K. Glasmeier and MIT.
- **Contextual wage examples (labor-market snapshots)**
  - Link: https://www.indeed.com/
  - Usage: Public listing snapshots used as contextual examples in narrative components, not as canonical source-of-truth wage series.

## Data Dictionary (minimum 5 rows: column -> meaning -> units)

| Column | Meaning | Units |
| :--- | :--- | :--- |
| `date` | Observation month from transformed Essex rent series | YYYY-MM |
| `rent` | Typical monthly market rent value from ZORI transform | USD/month |
| `currentMonthlyRent` | Latest valid monthly rent used in burden calculators | USD/month |
| `livingWage` | MIT living wage for one adult, no children (Essex County) | USD/hour |
| `minimumWage` | Minimum wage reference pulled from living wage source file | USD/hour |
| `grossBurdenPct` | Calculated: `(totalHousingCost / grossMonthlyIncome) * 100` | Percent (%) |
| `netBurdenPct` | Calculated when take-home is provided: `(totalHousingCost / takeHomePay) * 100` | Percent (%) |

## Data Viability Audit
### Missing values + weird fields
- The Zillow CSV is a wide table where each month is a separate column, with occasional blanks for some dates/areas.
- Monthly labels are column headers rather than row values, so dates must be reshaped.
- Living wage data includes multiple household categories; only one scenario is relevant (`1 ADULT - 0 Children`).

### Cleaning plan
- Filter Zillow data to `Essex County, NJ`.
- Pivot wide monthly columns into long format (`date`, `rent`).
- Keep 2019+ observations for trend clarity and consistency.
- Parse living wage/minimum wage from `living_wage_essex_nj.csv` for one-adult-no-children category.
- Validate final object with Zod and output to `data/processed.json`.

### What this dataset cannot prove (limits/bias)
- ZORI reflects typical market behavior, not every off-market student sublease or informal room arrangement.
- County-level rent can hide neighborhood-level variation around specific Newark campuses.
- Burden thresholds are standardized but do not capture personal debt load, family support, or commuting tradeoffs.

## Draft Chart Screenshot (from Sheets/Excel) + 2 bullets explaining why the chart answers the question
![Draft chart placeholder from Sheets/Excel](docs/draft-chart-placeholder.png)

- The chart directly compares observed rent trend growth against realistic student/entry wage baselines, making the affordability gap visible.
- The 30% threshold framing lets a viewer quickly see when a scenario transitions from manageable to rent-burdened.

## B) /data/
- `data/raw/County_zori_uc_sfrcondomfr_sm_m.csv`
  - Raw Zillow source file used for rent trend extraction.
- `data/raw/living_wage_essex_nj.csv`
  - Raw MIT-derived wage reference file used for baseline wage values.
- `data/processed.json`
  - Cleaned and validated app-ready dataset produced by `scripts/processData.ts`.
- `data/notes.md`
  - Contains source notes and caveats about data origin and required transforms.


