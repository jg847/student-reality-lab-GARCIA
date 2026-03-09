# Student Reality Lab - STAR Presentation

**Claim:** A single student looking to move out in Newark, NJ needs to earn at least $35/hour to afford a median-priced apartment without crossing the 30% rent-burden threshold.

## S — Situation (20–30 sec)
Rent prices in Essex County (Newark) have risen significantly over the past few years. This causes heavy financial anxiety for students looking to move off-campus or stay in the city post-graduation, as baseline wages have not kept pace with housing costs.

## T — Task (10–15 sec)
I set out to answer: What minimum hourly wage must a single student earn to rent a typical apartment without spending more than 30% of their gross income on housing? I wanted viewers to interact with their expected salary to see their true rent burden.

## A — Action (60–90 sec)
- **What I built:** A Next.js interactive data story showing historical rent trends and a dynamic rent-burden calculator.
- **Key data transformation:** I merged the Zillow ZORI rent index for Essex County with the MIT Living Wage dataset, standardizing the timeline and converting annual housing allowances into monthly comparisons using a strictly typed Zod pipeline.
- **Interaction choices:** I built a dynamic wage slider. Forcing the user to physically drag the slider to $35/hr to escape the "red zone" creates a visceral understanding of the wage gap. I also added a "Roommate Toggle" as a segmentation/counterpoint to show how the math changes when sharing space.
- **Major engineering decision:** Adopted strict Test-Driven Development (TDD) using Vitest and React Testing Library to ensure the complex rent-burden math and state changes remained perfectly accurate.

## R — Result (60–90 sec)
- **What the data shows:** The local minimum wage and the MIT living wage (~$25/hr) both fail to keep a single renter below the 30% threshold. 
- **Interaction impact:** When you interact with the roommate toggle, the data shifts dramatically—showing that the MIT Living wage is only viable if you split a 1-bedroom apartment. 
- **Limitation (Honesty point):** The Zillow data (ZORI) is aggregated at the county level (Essex County). Micro-neighborhoods adjacent to the NJIT campus may have varying rent medians not perfectly reflected by the county-wide average. 
- **Actionable Takeaway:** Students planning to stay in Newark must either aggressively negotiate starting salaries toward $35/hr, or plan on co-housing to maintain financial health.
