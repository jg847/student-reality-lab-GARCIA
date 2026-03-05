# Title: Rent Burden in Newark

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
