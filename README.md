# Title: Rent Burden in Newark

**Live Demo:** [Insert Vercel Link Here]

## Essential Question
What minimum hourly wage must a single student in Newark, NJ earn to rent a typical apartment without spending more than 30% of their gross income on housing?

## Claim (Hypothesis)
A single student looking to move out in Newark, NJ needs to earn at least $35/hour to afford a median-priced apartment without crossing the 30% rent-burden threshold.

## Audience
Current university students in Newark (e.g., Rutgers-Newark, NJIT, Essex County College) who are planning to move off-campus or graduate soon and are budgeting for their immediate future.

## STAR Draft
* **S — Situation:** Rent prices in Newark have risen significantly, causing heavy financial anxiety for students who want to move off-campus or stay in the city post-graduation. 
* **T — Task:** The viewer should be able to input their expected post-grad or part-time salary to see exactly how much of their income will be eaten by rent, and whether they will be classified as "rent-burdened."
* **A — Action:** I will build an interactive wage slider that dynamically updates a chart. As the user moves the slider to match their target wage, the chart will show their rent-to-income ratio compared to the 30% "affordable" threshold.
* **R — Result:** I expect the data to show that the standard local minimum wage, and even the MIT estimated living wage for Essex County ($25.03/hr as of early 2026), falls short of keeping a single renter below the 30% rent burden threshold for a typical Newark apartment. The primary metric reported will be the **Rent-to-Income Percentage**.

## Dataset & Provenance
* **Source 1: Zillow Observed Rent Index (ZORI)**
  * **Link:** https://www.zillow.com/research/data/ (Under "Rentals" -> ZORI All Homes Plus Multifamily)
  * **License/Usage:** Free for public/academic use with proper citation to Zillow Research.
* **Source 2: MIT Living Wage Calculator (Essex County, NJ)**
  * **Link:** https://livingwage.mit.edu/counties/34013
  * **License/Usage:** Academic/Personal use permitted; copyrighted by Dr. Amy K. Glasmeier and MIT.

## Data Dictionary

| Column Name | Meaning | Units |
| :--- | :--- | :--- |
| `RegionName` | The city or metro area (Filtered to Newark, NJ) | String |
| `ObservationDate` | The year and month the rent data was recorded | Date (YYYY-MM) |
| `Typical_Rent` | The smoothed median market rent for an apartment | USD ($) |
| `Hourly_Wage` | The hourly income of the user/student | USD/Hour ($) |
| `Rent_Burden_Pct` | Calculated: `(Typical_Rent / (Hourly_Wage * 160)) * 100` | Percentage (%) |

## Data Viability Audit
* **Missing values + weird fields:** The raw Zillow dataset uses a "wide" format where every month is its own column. There may be `NULL` values for older years (pre-2015) where data wasn't collected for Newark. The MIT Living wage data is static for the current year, requiring manual entry or a simple JSON array.
* **Cleaning plan:** I will filter the Zillow CSV to `RegionName == "Newark"` and `State == "NJ"`. I will then pivot (melt) the date columns into a "long" format so that I have a clean time-series of rent prices. I will calculate monthly income by assuming 160 working hours a month (40 hours/week * 4 weeks) and create a calculated `Rent_Burden_Pct` column.
* **What this dataset cannot prove (limits/bias):** ZORI measures the *typical* asking rent on the market, which may skew higher than a student finding a cheap, unlisted room via word-of-mouth. It also assumes the student is living alone; it cannot prove the exact rent burden for students splitting rent with multiple roommates unless I add a "roommate divisor" into the interactive logic. 

## Draft Chart Screenshot
*(Note to self: Insert a screenshot here from Excel/Google Sheets showing a bar chart or line graph comparing $25/hr income to Newark's median rent).*

* **Why this answers the question:**
  * It visually establishes the 30% line as a hard boundary, immediately showing the viewer if their hypothetical wage puts them in the "danger zone."
  * It clearly compares the gap between standard living wages and actual market realities in Newark, giving students a realistic financial target.

## Phase 2: Cleaning & Transform Notes

`scripts/processData.ts` reads both raw CSVs in `data/raw/`, then builds one clean output object for the app:
- From `living_wage_essex_nj.csv`, it finds the `Category` rows for `Living Wage` and `Minimum Wage`, then extracts values from `1 ADULT - 0 Children`.
- From `County_zori_uc_sfrcondomfr_sm_m.csv`, it filters for `RegionName = Essex County` and `State = NJ`, collects monthly date columns (2019 onward) into a `rentTrend` time series, and selects the newest valid month as `currentMonthlyRent`.
- The script validates the output against a Zod schema contract and writes `data/processed.json` for the Next.js app.

### Key Terms
- **Rent-to-Income Percentage:** Calculated as `(Monthly Rent / Gross Monthly Income) * 100`.
- **30% Rent Burden Threshold:** The standard federal guideline stating housing costs should not exceed 30% of gross income.
- **Living Wage:** The hourly rate modeled by the MIT Living Wage Calculator (`$25.03/hr` for a single adult in this dataset).

### Note on Transparency
There are no hard-coded magic numbers in the app without explanation. Core assumptions and thresholds are named in code and documented in this README.

## Phase 3: Interaction Design

### What it is
A dynamic wage slider linked to a real-time bar chart showing the user's rent-to-income percentage.

### Why it helps answer the question
By forcing the user to physically slide the wage scale to bring the bar under the 30% threshold, it provides an immediate, visceral understanding of the gap between baseline minimum/living wages and the actual income required to survive in the Newark housing market.

## Limits & What I'd Do Next

### Limits
- The Zillow ZORI dataset is aggregated at the county level (Essex County). It does not perfectly capture hyper-local micro-markets, such as the immediate blocks surrounding the NJIT campus in Newark, which might be artificially inflated by student demand.
- The 30% rule is calculated using gross income, but students pay rent with net (after-tax) income, meaning the true burden is actually heavier than shown.

### What I'd Do Next
- Integrate a zip-code level dataset or scrape active listings from local off-campus housing portals for higher geographic precision.
- Add a toggle to include average utility costs (internet, electricity, water) into the total housing burden.
