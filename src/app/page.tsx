import { RentBurden } from "../components/RentBurden";
import { RentTrendChart } from "../components/RentTrendChart";
import { getStoryData } from "../lib/loadData";

export default function HomePage() {
  const storyData = getStoryData();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Student Reality Lab</h1>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-3">Context</h2>
          <p className="text-lg leading-relaxed mb-8">
            Newark renters are navigating a market where housing costs keep climbing while wages
            move far more slowly. This story uses county-level trend data and an interactive
            burden model to show how fast affordability disappears for new graduates trying to live
            independently.
          </p>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 my-8">
            <RentTrendChart rentTrend={storyData.rent.rentTrend} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-3">Evidence &amp; Segmentation</h2>
          <p className="text-lg leading-relaxed mb-8">
            Move the wage slider to see your projected rent burden in real time. Then activate the
            roommate counterpoint to compare solo renting against shared housing. The contrast
            makes the affordability gap visible immediately.
          </p>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 my-8">
            <RentBurden
              currentMonthlyRent={storyData.rent.currentMonthlyRent}
              livingWage={storyData.wages.livingWage}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-3">Takeaway</h2>
          <p className="text-lg leading-relaxed mb-8">
            The data confirms our initial claim: A single student looking to live independently in a
            median-priced Newark apartment needs to secure a starting wage of at least $35/hour to
            avoid being rent-burdened. Standard minimum wages, and even calculated 'Living Wages,'
            force students to either take on dangerous levels of rent burden or compromise by
            sharing spaces.
          </p>
        </section>
      </div>
    </main>
  );
}
