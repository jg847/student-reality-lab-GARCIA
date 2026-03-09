import * as Sentry from "@sentry/nextjs";
import { AffordabilityCalculator } from "../components/AffordabilityCalculator";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ResearchCallout } from "../components/ResearchCallout";
import { RentBurden } from "../components/RentBurden";
import { RentTrendChart } from "../components/RentTrendChart";
import { ResourceList } from "../components/ResourceList";
import { WageGapChart } from "../components/WageGapChart";
import type { ProcessedData } from "../lib/schema";
import { getStoryData } from "../lib/loadData";

export default function HomePage() {
  let storyData: ProcessedData | null = null;

  try {
    storyData = getStoryData();
  } catch (error) {
    Sentry.captureException(error);
  }

  return (
    <main>
      <div className="story-shell">
        <h1 className="story-title">Student Reality Lab</h1>

        <ErrorBoundary>
          {storyData ? (
            <StorySections storyData={storyData} />
          ) : (
            <section className="story-card" role="alert">
              <h2 style={{ color: "var(--burden-threshold)", marginTop: 0 }}>Data Unavailable</h2>
              <p className="story-body" style={{ marginBottom: 0 }}>
                Unable to load housing data. Please try refreshing the page.
              </p>
            </section>
          )}
        </ErrorBoundary>
      </div>
    </main>
  );
}

function StorySections({ storyData }: { storyData: ProcessedData }) {
  const wageData = [
    { category: "Retail", low: 15.13, median: 17, high: 24 },
    { category: "Customer Service", low: 16, median: 21.25, high: 26 },
    { category: "Admin Support", low: 20, median: 25, high: 31 },
    { category: "Warehouse", low: 15.92, median: 18.5, high: 22 },
    { category: "Security", low: 16, median: 21.25, high: 30 },
    { category: "Barista", low: 15, median: 18.5, high: 22.25 },
  ];

  const resources = [
    {
      name: "La Casa de Don Pedro (Newark)",
      summary:
        "HUD-certified housing counseling with foreclosure prevention and financial capability support.",
      url: "https://www.lacasadedonpedro.org/housing/",
    },
    {
      name: "Ironbound Community Corporation (Newark)",
      summary:
        "Tenant-focused housing justice support, including right-to-counsel and anti-displacement advocacy.",
      url: "https://www.ironboundcc.org/programs/housing/",
    },
    {
      name: "Newark Emergency Services for Families",
      summary:
        "Emergency rental, security deposit, utility, and food assistance for Essex County residents.",
      url: "https://www.nesfnj.org/programs",
    },
    {
      name: "Catholic Charities of Newark",
      summary:
        "Housing counseling and rental assistance services for Essex County renters and residents facing homelessness.",
      url: "https://www.ccannj.org/housing-assistance",
    },
  ];

  return (
    <>
      <section className="story-section">
          <h2>Context</h2>
          <p className="story-body">
            Newark renters are navigating a market where housing costs keep climbing while wages
            move far more slowly. This story uses county-level trend data and an interactive
            burden model to show how fast affordability disappears for new graduates trying to live
            independently.
          </p>

          <div className="story-card">
            <RentTrendChart rentTrend={storyData.rent.rentTrend} />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <ResearchCallout
              title="Institutional Evidence: New Jersey Housing Wage"
              finding="NLIHC reports New Jersey's two-bedroom housing wage at $39.99/hr, and a minimum-wage worker needs roughly 103 hours/week to afford it."
              sourceLabel="NLIHC Out of Reach - New Jersey"
              sourceUrl="https://nlihc.org/oor/state/nj"
            />
          </div>
      </section>

      <section className="story-section">
          <h2>Newark Wage Realism</h2>
          <p className="story-body">
            To ground this in current labor market reality, we sampled hourly postings on
            Indeed for Newark-area entry and early-career jobs. Even stronger medians often sit
            well below the $35/hour line required for independent rent sustainability.
          </p>

          <div className="story-card">
            <WageGapChart wageData={wageData} targetWage={35} />
            <p className="chart-note" style={{ marginTop: "0.8rem", marginBottom: 0 }}>
              Source snapshot: Indeed job postings for Newark, NJ searches including retail,
              customer service, admin support, warehouse, security, and barista roles.
            </p>
          </div>
      </section>

      <section className="story-section">
          <h2>Evidence &amp; Segmentation</h2>
          <p className="story-body">
            Move the wage slider to see your projected rent burden in real time. Then activate the
            roommate counterpoint to compare solo renting against shared housing. The contrast
            makes the affordability gap visible immediately.
          </p>

          <div className="story-card">
            <RentBurden
              currentMonthlyRent={storyData.rent.currentMonthlyRent}
              livingWage={storyData.wages.livingWage}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <ResearchCallout
              title="National Burden Signal"
              finding="Harvard JCHS reports that half of all U.S. renters were cost burdened in 2022, totaling 22.4 million households paying more than 30% of income toward housing."
              sourceLabel="Harvard JCHS - America's Rental Housing 2024"
              sourceUrl="https://www.jchs.harvard.edu/americas-rental-housing-2024"
            />
          </div>
      </section>

      <section className="story-section">
          <h2>Calculate Your Personal Rent Burden</h2>
          <p className="story-body">
            The numbers above show the average picture for Newark renters. But your situation is
            specific to you. Enter your own numbers below to see exactly where you stand.
          </p>
          <p className="story-body">
            This calculator includes rent sharing, utilities, and optional take-home pay so the
            result reflects your real monthly pressure, not just a simplified estimate.
          </p>

          <AffordabilityCalculator />
      </section>

      <section className="story-section">
          <h2>Takeaway</h2>
          <p className="story-body">
            The data confirms our initial claim: A single student looking to live independently in a
            median-priced Newark apartment needs to secure a starting wage of at least $35/hour to
            avoid being rent-burdened. Standard minimum wages, and even calculated 'Living Wages,'
            force students to either take on dangerous levels of rent burden or compromise by
            sharing spaces.
          </p>
          <div className="story-card" style={{ borderLeft: "6px solid var(--burden-threshold)" }}>
            <p className="chart-note" style={{ margin: 0 }}>Practical threshold for independent living</p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: "var(--text-strong)",
                fontFamily: "var(--font-display)",
                fontSize: "var(--step-callout)",
                lineHeight: 1,
              }}
            >
              $35/hr
            </p>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <ResearchCallout
              title="Why This Matters for Students"
              finding="Urban Institute's housing research notes nearly 9 in 10 undergraduates live off campus, and housing instability can jeopardize degree completion and academic performance."
              sourceLabel="Urban Institute Housing Matters"
              sourceUrl="https://housingmatters.urban.org/research-summary/strategies-colleges-and-universities-help-students-housing-instability"
            />
          </div>
      </section>

      <section className="story-section">
          <h2>Local Housing Resources</h2>
          <p className="story-body">
            If your current wage does not clear the burden threshold, these Newark and Essex
            nonprofits offer practical housing support, counseling, and emergency assistance.
          </p>

          <ResourceList resources={resources} />
      </section>
    </>
  );
}
