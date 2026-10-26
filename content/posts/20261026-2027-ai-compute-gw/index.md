---
title: "How Much New AI Compute Comes Online in 2027? Backing It Out from NVIDIA's Revenue"
date: 2026-10-26T13:00:00+08:00
draft: false
lang: en
tags: ["NVIDIA", "AI Compute", "Data Center", "GPU", "Investing"]
categories: ["Investing"]
description: "About 15 GW of new NVIDIA compute (IT basis, range 13–18 GW; about 18 GW grid-side) powers on in 2027, equal to about 23 GW of GB200 or 20 GW of GB300. Derived from NVIDIA's revenue and revenue per GW, cross-checked against TSMC capacity, the supply chain and analyst forecasts."
cover:
    image: "https://raw.githubusercontent.com/Miss-you/img/master/blog/2027-ai-compute-gw/01-revenue-to-compute-cover.png"
    alt: "Revenue papers flowing through a prism into three glowing chips: backing compute out from revenue"
    relative: false
---

*Estimate as of October 26, 2026. NVIDIA reports its next quarter (fiscal Q3 FY27, roughly August–October 2026) in mid-to-late November.*

## Bottom line

**About 15 GW of new NVIDIA compute will be installed and actually powered on in 2027, with a reasonable range of 13–18 GW.** That figure counts only the power drawn by the equipment in the racks (the "IT" basis). Including cooling and other facility overhead, the draw on the grid is about 18 GW.

1. **The single most important assumption is how much NVIDIA earns per GW of Blackwell.** Blackwell is NVIDIA's current GPU generation. I use $27B per GW. At the higher price management cited in 2025 ($30–35B), the answer falls to about 13.7 GW. If you take NVIDIA's February 2026 statement that roughly 9 GW of Blackwell was "deployed" and ignore the shipping-to-power-on lag (about $21B per GW), it rises to about 17.7 GW.
2. **About a third of what powers on in 2027 is backlog,** meaning GPUs sold in 2026 that do not get electricity until 2027. The other two-thirds come from shipments made in roughly January–September 2027. Going the other way, NVIDIA ships about 17 GW during 2027, but part of that will not be switched on until 2028.
3. **Measured by work done, that is equivalent to about 23 GW of GB200 or 20 GW of GB300.** GB200 and the upgraded GB300 are Blackwell's rack-scale products. Rubin, the next generation, began shipping in August 2026 and does roughly twice as much work per watt as Blackwell. So among the GPUs that power on in 2027, Blackwell accounts for about 58% of the power, while Rubin accounts for about 57% of the compute. (Both shares are medians of the model's simulations; dividing the central values directly gives numbers a point or two off.)
4. **The whole industry adds about 22–27 GW (the model's 80% range).** The widely quoted "43 GW of new AI compute in 2027" is SemiAnalysis's forecast of new data-center capacity worldwide across all vendors. It should be compared with the industry total, not with NVIDIA's 15 GW. On that comparison, SemiAnalysis's 43 GW is about 1.6–2 times the industry's 22–27 GW of chips. If you take investor Brad Gerstner's view that only about 25 GW can actually be built, the two are close to one-to-one. (Section 4.4 combines both views into a 1.0–2.1× range.)
5. **The final formula.** In plain terms: take what NVIDIA sells, divide by NVIDIA's revenue per GW, and subtract what has not yet been switched on.

   GW powered on in 2027 (IT basis) = Σ over months of [NVIDIA data-center revenue × share that goes into GPU data centers × (Blackwell share ÷ Blackwell revenue per GW + Rubin share ÷ Rubin revenue per GW) × probability that a given month's shipments power on in 2027]

   Conversions: grid-side GW = IT GW × PUE (total facility power ÷ IT power, about 1.2). GB200-equivalent GW = Blackwell GW × 1.1 + Rubin GW × 2.1. GB300-equivalent GW = GB200-equivalent ÷ 1.18. A hand calculation with central values is in 2.2; terms are defined in the Notes.

**What each section answers:**

| Section | Question |
|---|---|
| 1 | Why NVIDIA's revenue can be turned into GW |
| 2 | How the calculation works, and where each parameter comes from |
| 3 | What the numbers are, and which shipments power on in 2027 |
| 4 | Whether the result holds up: a summary of cross-checks first, then the details |
| 5 | Which parameters matter most |
| 6 | Whether some common intuitions are right |
| 7 | Limitations, and what to watch after the next earnings report |

---

## 1. Why NVIDIA's revenue can be turned into 2027 GW

**In 2027 the bottleneck is likely to be chips, not data centers. NVIDIA supplies about two-thirds of new AI compute (measured by power), and it sells as much as it can get made. So revenue divided by revenue per GW gives the compute actually delivered.**

### 1.1 The 2027 bottleneck is likely to be chips, so count chips

Data-center GW measure how much power a site is ready to accept; chip GW measure how much compute is actually plugged in. The two can diverge sharply by 2027. Data-center and grid construction is accelerating, while SemiAnalysis judged in October 2026 that chips could become the binding constraint, describing "memory and logic possibly becoming the new #1 constraint in 2027-28" (logic chips are the ones that do the computing, such as GPUs). When the constraint is on the chip side, compute should be counted from the seller of the chips.

### 1.2 NVIDIA supplies about two-thirds of new compute

Epoch AI tracks chip sales by power. By that measure, NVIDIA accounted for 65% of new AI compute in 2025 and 67% in the first half of 2026.

To scale from NVIDIA to the whole industry, I assume NVIDIA's share is 55%–68%. The lower end sits below Epoch's figure for two reasons:

- Epoch records the power of Google's TPU v8i and Huawei's Ascend 950PR as zero, so it understates non-NVIDIA share and overstates NVIDIA's.
- TPUs and AMD are both accelerating in 2027. Morgan Stanley estimates NVIDIA will account for only 45% of 2027 demand for CoWoS, TSMC's advanced packaging capacity (see 1.4).

### 1.3 NVIDIA's revenue is set by supply

Management's preliminary outlook is about 70% revenue growth in FY28, NVIDIA's fiscal year ending January 2028, which roughly matches calendar 2027. Management also said explicitly that supply sets this number. In the words of CEO Jensen Huang, according to the Motley Fool transcript: "even though our demand is much greater than 70%, our supply allows us to confidently deliver 70%." (Another transcript words it slightly differently.)

When demand exceeds supply, what gets sold is what gets made. So once you know how much NVIDIA earns per GW, dividing revenue by it gives the GW the supply chain actually delivers.

### 1.4 TSMC serves as a ceiling, not the main method

One view holds that a data-center GPU built without TSMC's leading-edge process and CoWoS packaging is not competitive on performance, so TSMC's CoWoS capacity is roughly the AI industry's compute capacity. (CoWoS packages the GPU together with high-bandwidth memory, or HBM.)

That view largely holds, for two reasons:

- Google's TPU, Amazon's Trainium and AMD's GPUs all use TSMC process technology plus CoWoS.
- Chips made outside TSMC are a small volume (see 4.2).

But converting CoWoS wafers into GW requires knowing how many good GPUs each wafer yields and whether there is enough HBM, and neither has reliable public data. So TSMC is used here for two things only: as a ceiling, since the GW implied by revenue should not exceed what CoWoS can support; and as a check on growth rates.

## 2. How money turns into GW, and what each parameter is

**NVIDIA's revenue is split by month, divided by revenue per GW separately for each generation, and shifted into 2027 according to the power-on lag. Every parameter is a range, not a point.**

### 2.1 The calculation chain

1. Take monthly NVIDIA data-center revenue and multiply by the share that goes into GPU data centers. This removes a small amount of revenue, such as RTX Pro servers and software, that does not end up in GPU data centers.
2. Split it by the revenue shares of Blackwell and Rubin, and divide each by its revenue per GW (how much NVIDIA revenue corresponds to one GW of compute). This gives **GW shipped that month**.
3. Shift shipments to the month they power on, using a distribution of shipping-to-power-on lags. This gives **GW powered on that month**.
4. Add up everything that lands in 2027 to get **GW powered on in 2027 (IT basis)**.
5. Then convert: multiply by PUE for grid-side GW; multiply by performance-per-watt factors (2.7) for equivalent GW; divide by NVIDIA's share for the industry total.

The calculation is a Monte Carlo simulation: each run draws one value from each parameter's range and computes the result, 20,000 times in all. The "about 15 GW" in the text is the median of those 20,000 results; the "80% range" drops the top and bottom 10%.

### 2.2 A hand calculation with central values

The average lag from shipment to power-on is about four months, so "powered on in 2027" roughly equals "shipped between September 2026 and August 2027."

1. **Remove revenue that does not go into GPU data centers.** NVIDIA's data-center revenue over those 12 months is about $517B. Removing the 2.5% that does not go into GPU data centers leaves about $504B. Rubin is about 54% of it.
2. **Divide by revenue per GW.** Blackwell revenue of about $230B divided by $27B per GW is about 8.5 GW; Rubin revenue of about $274B divided by $40B per GW is about 6.8 GW. Together, about 15.3 GW.
3. **Re-sort by actual power-on date.** Four months is only an average: some systems power on earlier, some later, and a few wait for electricity. Working month by month, **15.2 GW** lands in 2027, split by shipment batch into 8.8 GW of Blackwell and 6.4 GW of Rubin. Blackwell is higher and Rubin lower than in step 2 because most of what shipped in autumn 2026 was Blackwell, so most of what carries over into 2027 is Blackwell too. 15.2 GW × PUE of 1.2 gives about **18 GW** on the grid side.
4. **Convert to equivalent compute.** 8.8 × 1.1 + 6.4 × 2.1 ≈ **23 GW GB200-equivalent**; divided by GB300's factor of 1.18, about **19.5 GW GB300-equivalent**. Here 1.1, 2.1 and 1.18 are the means of the parameter distributions; the table in 2.7 lists 1.10, 1.9 and 1.15, which are the modes (most likely values). That is why the two sets of numbers differ.

A rougher shortcut skips the monthly split: FY28 shipments ≈ FY28 data-center revenue × 97.5% × (Blackwell share ÷ $27B + Rubin share ÷ $40B). This gives shipments for FY28 (February 2027–January 2028), about 0.6 GW more than calendar-2027 shipments. It also counts shipments, not power-on; for that, see 3.3.

### 2.3 Revenue

Confidence in the tables below comes in three grades: "high" means company filings or primary data; "medium" means secondary reports, management's spoken remarks, or several sources that agree; "low" means judgment calls, single sources, or search snippets only.

| Item | Value | Basis | Confidence |
|---|---|---|---|
| Reported data-center revenue | FY26 Q3 $51.2B, Q4 $62.3B; FY27 Q1 $75.2B, Q2 $89.0B | SEC filings | High |
| FY27 Q3 (Aug–Oct 2026) | Total revenue $106–114B, mode $110B; data center 91.5%–93.5% of total | Company guidance: "Revenue is expected to be $108.0 billion, plus or minus 2%." | Medium |
| FY27 Q4 | Total revenue $116–130B | Judgment | Low |
| FY28 | Growth 50%–85%, mode 72%; data center 92%–94% of total; equal sequential growth across the four quarters | CFO Colette Kress's preliminary outlook: "our preliminary expectation is for fiscal year '28 revenue to grow approximately 70% year-over-year" | Medium |
| Cross-check | Model median FY28 data-center revenue $647B; post-earnings sell-side consensus total revenue about $692B, implying about $640B for data center | Consensus seen only in a tikr search snippet | Low |

The FY27 Q3 mode sits slightly above guidance because NVIDIA has generally beaten its guidance by a small margin in recent years. The FY28 range extends down to 50% to cover a demand slowdown.

### 2.4 Revenue per GW is priced on IT load

The firmest evidence is in NVIDIA's 10-Q (its quarterly filing), which describes the PORTS-Pike campus as "approximately 4.25 gigawatts of IT load." Kress's written commentary says each generation of infrastructure there "could represent" about 1.5 million GPUs and $150–200B of revenue. Spread over 4.25 GW, that is about $35–47B per GW, consistent with Rubin's $40B. So this estimate reads revenue per GW as an IT-basis figure. Confidence: medium.

The earnings calls never define which GW they mean. If revenue per GW is actually priced on grid-side power, the same revenue buys fewer IT GW, because revenue per IT GW must be multiplied by PUE. Applying that to Rubin alone lowers 2027 to 14.1 GW; applying it to both Blackwell and Rubin lowers it to 12.7 GW. This is one source of the lower end of the reasonable range (see 4.6).

### 2.5 What NVIDIA earns per GW: the parameter that matters most

According to third-party transcripts such as Motley Fool's (NVIDIA's official PDF was not available), Jensen Huang gave revenue per GW for three generations on the August 2026 earnings call: "In the case of Hopper, we were at about $18 billion per gigawatt. For Grace Blackwell, we're about $25 billion per gigawatt. And for Vera Rubin, it's about $40 billion per gigawatt."

The Blackwell figure does not match what he said earlier. In November 2025 he put Grace Blackwell at "$30 billion plus or minus," and in August 2025 he said NVIDIA's share of a one-GW data center was about $35B. So Blackwell needs independent evidence. The table below tests it against three anchors:

| Anchor | Implied revenue per GW | What it shows |
|---|---|---|
| Epoch: NVIDIA unit shipments, first half of 2026 | $28.3B | Consistent with Epoch's price assumptions; not an independent backtest |
| Epoch: NVIDIA chip TDP (rated chip power), 2025 | $26–28B | Same |
| CFO Kress, February 2026: "nearly nine gigawatts of infrastructure on Blackwell are deployed" | $14–21B | Clearly low |

How each anchor is computed:

The first anchor: Epoch counts about 2.33 million B300 and 0.57 million B200 shipped by NVIDIA in the first half of 2026. Taking each GPU's IT power as rack power ÷ 72 gives about 5.5 GW in total; data-center revenue over the same period was about $155B, which gives $28.3B per GW.

The second anchor: Epoch puts NVIDIA's 2025 chip TDP at about 4.9 GW. Multiplying TDP by 1.4–1.5 to get IT power gives about 6.8–7.3 GW; FY26 data-center revenue of $193.7B then gives $26–28B per GW.

Neither of these is independent: Epoch derives NVIDIA's unit counts from NVIDIA's revenue divided by unit prices, so they only show consistency with Epoch's price assumptions.

The third anchor: if "deployed" means powered on, then with a four-month lag those 9 GW can only correspond to about $127B of shipments made before October 2025; with no lag and counting through January 2026, about $188B. The resulting $14–21B is clearly low. The 9 GW may include systems shipped but not yet powered on, may be on a grid-side basis, or may simply be a round number.

**Values used in the model:**

- **Blackwell: $22–32B, mode $27B.** Confidence medium. This is a gross figure: total data-center revenue is the numerator. Management's earlier $30–35B is not used because both Epoch anchors fall at $26–28B. Instead, the earlier figure drives the low-GW scenario and the strict reading of "9 GW" drives the high-GW scenario (see 4.6).
- **Share that goes into GPU data centers: deduct only 0–5%.** Confidence low. When Kress discussed Rubin, she said revenue per GW already includes the Vera CPU, LPU (NVIDIA's inference accelerator) and networking.
- **Rubin: $34–46B, mode $40B.** Confidence medium. PORTS-Pike implies $35–47B; the model uses a symmetric range centered on $40B. There is no Rubin shipment data yet to test it.

### 2.6 Generation mix, shipping-to-power-on lag, and facility overhead

| Parameter | Value | Basis | Confidence |
|---|---|---|---|
| Rubin share of data-center revenue | FY27 Q3 20%, Q4 35%–50%; FY28 quarters 50%–65%, 60%–75%, 70%–85%, 75%–90% | Q3 from Kress; others see below | Q3 high, others medium |
| Shipping-to-power-on lag | Mean 2.5–6 months, mode 4 months; each batch spread ±2 months | Assembly, shipping and commissioning times, see below | Low |
| Waiting for power or buildings | 0–15% of shipments delayed a further 6 months | Epoch has pushed back its estimate of Stargate Abilene's timeline | Low |
| PUE | 1.12–1.30, mode 1.2 | Best-operator measurements and targets for new builds, see below | Low |

Rubin share: the Q3 figure of 20% is from Kress: "We see Vera Rubin accounting for about 20% of data center revenue in Q3." Later quarters draw on two pieces of information: on the Q1 FY27 call, management said the first quarter of FY28 would be "very big"; TrendForce says GB300 will carry through the first half of 2027 and that VR200 (Rubin's rack-scale product) will be the highest-volume product of 2027.

Shipping-to-power-on lag: ODMs (contract manufacturers) take about 1–2 months to assemble a rack, then shipping, installation and commissioning take another 1–3 months. CoreWeave added more than 300 MW of active power in the single month of June 2026.

PUE does not go as low as 1.1 at the bottom of the range. SemiAnalysis's InferenceX benchmark implies about 1.1 and Google's fleet averages 1.09, but both come from best-in-class operators. New liquid-cooled AI data centers generally target below 1.3, and the industry average will be above the best operators.

### 2.7 Performance per watt, used for equivalent GW

Relative to GB200, on an IT-power basis. FP8 and FP4 are two numerical precisions; lower precision computes faster. "Dense" means rated compute without sparsity speedups.

| Product | Performance per watt vs. GB200 | Basis | Confidence |
|---|---|---|---|
| Blackwell shipped in 2026–27, mostly GB300 | 0.95–1.35, mode 1.10 | Specifications and InferenceX measurements, see below | Medium |
| Rubin | 1.3–3.0, mode 1.9 | Specification estimates only, see below | Low (no measurements yet) |
| GB300 (used for GB300-equivalent) | 1.0–1.4, mode 1.15 | Same as Blackwell row | Medium |

Blackwell: on specifications, dense FP8 compute is unchanged while power is about 15% higher, so about 0.86× for training; FP4 inference is about 1.29×. InferenceX throughput per MW measured 0.93–1.13× for DeepSeek R1 and 1.36–4.1× for V4 Pro.

Rubin can be estimated from specifications in two ways. Token generation is limited by memory bandwidth: 19.2–22 TB/s per GPU ÷ 2.64–3.19 kW gives about 1.26–1.74× GB200. Dense compute ÷ power gives about 1.8–2.2×. NVIDIA's marketing claim that Vera Rubin "delivers up to 10x more tokens per megawatt than NVIDIA GB200 NVL72" picks the most favorable operating point and is not used.

The GB300 factor and the blended Blackwell factor are drawn independently in the model, so the GB300-equivalent range is slightly wider than it would otherwise be.

## 3. The numbers

**About 15 GW powers on in 2027, equivalent to about 23 GW of GB200. About 5 GW of it is backlog from 2026.**

### 3.1 Physical GW: about 15 GW powers on in 2027

"Powered on" below means the data center is energized and the GPUs start working.

| GW (IT basis) | Blackwell | Rubin | Total |
|---|---|---|---|
| Shipped in 2026 | 11.2 | 1.3 | **12.5** |
| Powered on in 2026 | | | **9.9** (8.8–11.2) |
| Shipped in 2027 | 6.7 | 10.5 | **17.2** |
| **Powered on in 2027** | **8.8** | **6.4** | **15.2** (14.1–16.5) |
| Powered on in 2027, grid-side | | | **18.3** (16.8–20.0) |

Figures in parentheses are 80% ranges.

On a calendar-year basis, NVIDIA's data-center revenue rises from about $362B in 2026 to about $620B in 2027, up about 71%, but shipments rise only from 12.5 GW to 17.2 GW, up about 38%. The difference is the rise in revenue per GW: blending Blackwell and Rubin, it goes from about $28.3B to about $34.8B, up about 23%. Roughly, six-tenths of NVIDIA's revenue growth comes from selling more GW and four-tenths from charging more per GW.

### 3.2 Measured by work done: about 23 GW of GB200, 20 GW of GB300

| Powered on in 2027 | Median | 80% range |
|---|---|---|
| Physical GW (IT basis) | 15.2 | 14.1–16.5 |
| **GB200-equivalent GW** | **23.0** | 19.7–27.1 |
| **GB300-equivalent GW** | **19.5** | 16.3–23.5 |
| Rubin's share of effective compute | 57% | 48%–65% |

The equivalent-GW range is much wider than the physical one, and most of the uncertainty is Rubin's performance per watt. There are no public Rubin measurements yet: the InferenceX comparison page is empty, and MLPerf (the industry-standard benchmark) 6.0 has no Rubin results. This is the softest link in the whole estimate.

Converting to H100-equivalent GW depends on the workload. On specifications for training, GB200's performance per watt is about 1.9× H100's; measured inference on large MoE (mixture-of-experts) models is 8–23×. So "how many H100-equivalent GW come online in 2027" could be anything from 45 GW to over 200 GW. That number carries too little information to be useful here.

### 3.3 About a third of what powers on in 2027 is 2026 backlog

| Shipment period | Shipped in period | Of which powered on in 2027 |
|---|---|---|
| Aug–Dec 2025 | 3.3 GW | 0 |
| Jan–Jun 2026 | 5.6 GW | 0.3 GW |
| Jul–Sep 2026 | 3.4 GW | 1.6 GW |
| Oct–Dec 2026 | 3.5 GW | 3.3 GW |
| **Shipped in 2026, powered on in 2027: total** | | **about 5.2 GW** |
| Jan–Mar 2027 | 3.7 GW | 3.6 GW |
| Apr–Jun 2027 | 4.1 GW | 3.7 GW |
| Jul–Sep 2027 | 4.5 GW | 2.4 GW |
| Oct–Dec 2027 | 5.0 GW | 0.2 GW |
| **Shipped and powered on in 2027: total** | | **about 9.9 GW** |

What flows into 2027 and what flows out of it are different generations. The roughly 5.2 GW shipped in 2026 and powered on in 2027 is mostly GB300; the roughly 7.3 GW shipped in 2027 and powered on in 2028 is mostly Rubin. That is why, counted by power-on, 2027 is still a Blackwell year.

Because shipments grow every quarter, more flows out of 2027 than flows in, so 2027's power-on total is about 2 GW below its shipments (15.2 GW versus 17.2 GW).

The naive one-step division gives 15.5–25.6 GW, too wide to use. The Appendix explains why it was dropped and how the model evolved.

## 4. Does the result hold up?

**Evidence points both ways: slightly more items suggest the true figure could be higher than the model, while three suggest it could be lower. The reasonable range is 13–18 GW.**

### 4.1 Summary

The "Direction" column gives the direction of the true value relative to the model: ↑ means the true figure may be higher than the model, ↓ means it may be lower, ≈ means agreement. The tables in 4.3 and 4.5 use the same notation.

| Item | Tests | Independent of the model? | Direction |
|---|---|---|---|
| Ming-Chi Kuo: 2026 Rubin rack count | Shipments | Yes | ≈ agrees |
| Morgan Stanley: 2026 Blackwell rack count | Shipments | Yes | ↑ slightly higher |
| TrendForce: 2027 rack count | Shipments | Yes | ↑ |
| Wolfe Research: 2027 rack count (including Rubin Ultra) | Shipments | Yes | ↑ (though Wolfe's own 2026 count is higher than other sources) |
| TSMC CoWoS, mid and high scenarios | Shipment ceiling | Partly | ↑ room to spare |
| NVIDIA's own statements: neocloud (GPU-rental cloud) capacity, the ~9 GW "deployed" remark | Power-on | Partly | ↑ |
| **TSMC CoWoS low scenario, and tighter HBM** | Shipment ceiling | Partly | **↓ downside risk** |
| **Management's 2025 revenue per GW ($30–35B)** | Revenue per GW | Yes | **↓** |
| **Revenue per GW priced on grid-side power** | Basis of revenue per GW | Yes | **↓** |
| Morgan Stanley's 7-million-unit figure | Shipments | Yes | Unresolved conflict |
| Epoch data-center sites, Wells Fargo | Data centers | Yes | Does not test chips directly (data-center basis) |
| Epoch chip sales | Shipments | No | Not counted (already used for calibration) |

### 4.2 How much TSMC packaging and high-bandwidth memory can support

**Tests:** the ceiling on 2027 shipments. **Independent?** Partly. The CoWoS wafer counts come from independent sources, but converting wafers to GW uses the same Rubin share and per-GPU power assumptions as the model.

**Capacity trajectory:** TSMC's monthly CoWoS capacity was about 65–75k wafers at end-2025 (Epoch), will be about 120–140k at end-2026, and about 170–200k at end-2027. The end-2027 figure has two sources: KGI said 170k in March 2026, noting that "expansion will mainly happen in 2H27F"; Morgan Stanley says 200k but does not say whether that is a year-end or full-year monthly average. That implies about 1.8–2.0M wafers for full-year 2027.

NVIDIA used about 377k wafers in 2025, or 59% (Epoch). Morgan Stanley estimates NVIDIA's 2027 demand at 1.222M wafers, or 45%. That 45% is a share of Morgan Stanley's estimate of global demand (2.694M wafers), and the demand figure itself exceeds the TSMC supply estimated above, so it is not on the same basis as the 1.8–2.0M. Another estimate, counting only CoWoS-L (one CoWoS variant), is about 910k wafers; it also comes from Morgan Stanley and was seen only in a search snippet.

**Converting to GW (my estimate):** good GPUs per wafer are taken as 8.5–10 for B300 (the chip in GB300), based on about 9 back-calculated from Epoch's data, and 7–9 for Rubin, based only on an old JPMorgan estimate of 9. Rubin is 60%–70% of NVIDIA's wafers.

| Scenario | NVIDIA 2027 CoWoS wafers | GPUs | Implied shipments (IT basis) |
|---|---|---|---|
| Low | 900k (half of TSMC's roughly 1.8M for the year) | about 6.16M | about 14 GW |
| Mid | 1.1M | about 8.73M | about 22 GW |
| High | 1.222M (Morgan Stanley) | about 11.36M | about 32 GW |

The low scenario averages about 6.8 GPUs per wafer, below both ranges above, because the three scenarios assume 90%, 95% and 100% of wafers, respectively, go to GPUs; the rest go to switch chips and other parts.

**Verdict: no constraint in the mid and high scenarios; a binding one in the low scenario.** Revenue implies 17.2 GW of 2027 shipments.

The low scenario's ceiling is only 14 GW, below the model's 17.2 GW. HBM may also bind before CoWoS does. Four signs point that way:

- In September 2026 TrendForce said: "TrendForce expects the HBM market to remain supply-constrained in 2027."
- HBM bit shipments are expected to grow 50%–60% in 2027, slower than the 70%–90% growth in CoWoS wafers.
- KGI said Rubin's share of CoWoS in 2026 was pushed below half because HBM4 supply fell short.
- NVIDIA's supply commitments rose from $119B to $279B in Q2 FY27, with the increase mainly for memory purchases, another sign that memory is the constraint.

All of these point to downside risk.

The mid scenario's wafers could support more than 20 GW, above the 17.2 GW implied by revenue. There are two possible explanations: either NVIDIA earns less per GW than assumed, so actual shipments exceed the model; or some chips packaged in 2027 do not ship until 2028.

**"Chips not made at TSMC are not competitive" largely holds.** The largest non-TSMC AI chip is Huawei's Ascend, at about 800k units in 2025 (SemiAnalysis); CFR estimates its 2026 compute at about 4% of NVIDIA's. Intel's EMIB-T packaging will reach about 15–20k wafers per month by 2027 (in CoWoS-equivalent terms). By my rough estimate, non-TSMC AI chips amount to less than 5%–10% of NVIDIA's power, so "TSMC advanced-packaging capacity ≈ industry compute capacity" is a reasonable approximation. Note, though, that TPU, Trainium and AMD are also inside TSMC's capacity and take about half of CoWoS.

### 4.3 Rack and unit counts from the supply chain and analysts

**Tests:** shipped GW. **Independent?** Yes; none of these numbers were used to set parameters. But converting rack counts to GW uses one shared set of rack-power assumptions (190–230 kW per rack, from Ming-Chi Kuo and server maker 2CRSi).

| Source | Implied figure | Model | Direction |
|---|---|---|---|
| Ming-Chi Kuo: 5,000–7,000 VR200 racks in H2 2026 | × 190–230 kW per rack, about 1.0–1.6 GW | 2026 Rubin shipments 1.3 GW | **≈ agrees** |
| Morgan Stanley: 80–85k GB200 and GB300 NVL72 racks (72 GPUs each) in 2026 | × 135–140 kW per rack, about 10.8–11.9 GW; HGX (8-GPU server) systems on top | 2026 Blackwell shipments 11.2 GW | **↑ slightly higher** (after adding HGX) |
| Wolfe Research (sell-side, March 2026): 20k Rubin racks in 2026; 55k Rubin racks plus 15k Rubin Ultra racks in 2027 | About 3.8–4.6 GW in 2026; Rubin alone 10.5–12.7 GW in 2027 | 1.3 GW in 2026, 10.5 GW in 2027 | 2026: Wolfe is high. 2027: ≈ for Rubin alone, ↑ including Ultra |
| Morgan Stanley (July 2026): nearly 7 million Rubin plus Rubin Ultra units in 2027; up to 90k NVL72 racks | 18–22 GW if counted as packages; 9–11 GW if counted as dies (the individual pieces of silicon in a package; Rubin has two per package) | 2027 Rubin shipments 10.5 GW | **Unresolved conflict** |
| TrendForce: 2027 NVL72 rack shipments up "more than 50%," total rack value above $710B | My estimate: at least 120–128k racks; at a blended 170–200 kW per GB300/VR200 rack, at least 20–26 GW shipped | 2027 shipments 17.2 GW | **↑**; even at the lower bound, the model is about 15%–50% low |

Three of these need a word more:

- **Wolfe:** its 2026 Rubin rack count disagrees with both Kuo and Kress, and Wolfe is the one that is high. For 2027, Rubin alone matches the model; adding Rubin Ultra suggests actual shipments could exceed it.
- **Morgan Stanley's 7-million figure:** 90k racks × 72 ≈ 6.5 million, so the 7 million looks like a package count. But if it really is packages, Rubin revenue would have to reach about $800B, more than NVIDIA's entire data-center revenue.
- **TrendForce:** $710B of rack value already exceeds NVIDIA's data-center revenue, because it includes non-NVIDIA content such as assembly and memory; neither the rack count nor the unit price is transparent.

### 4.4 Third-party statistics: more data centers than chips

**Tests:** the relationship between data centers and chips. These sources count data-center capacity, **so they cannot show whether chip counts are too high or too low.**

| Source | Content | Reading |
|---|---|---|
| Epoch data-center database | Tracked sites add 10.2 GW (IT basis) in 2026, covering about 43% of global deployed AI compute | Scaled up by the 43% coverage, global data-center additions are about 24 GW, above the model's industry-wide 2026 power-on of about 15–16 GW. That fits "buildings first, chips later." |
| SemiAnalysis data-center forecast | 43–51 GW added globally in 2027; Gerstner thinks only about 25 GW can be built | Data centers are 1.0–2.1 times chips (industry about 25 GW): the low end if you believe Gerstner, the high end if you believe SemiAnalysis |
| Wells Fargo | Top five cloud providers deploy 22 GW in 2026 and 25 GW in 2027 (all vendors' chips) | Looks like a data-center or contracted basis; those five alone come close to the industry's total chips, which also suggests more data centers than chips |
| Epoch chip sales | Power of NVIDIA shipments in 2025 and H1 2026 | Already used to calibrate revenue per GW (see 2.5), not counted again |

### 4.5 What buyers and NVIDIA itself say

**Tests:** power-on volume. **Independent?** See each row.

| Source | Content | Independence | Direction |
|---|---|---|---|
| NVIDIA: neocloud capacity grows from about 3 GW at end-2025 to 8 GW at end-2026 | Net addition of about 5 GW in 2026 | NVIDIA's own statement, same source as the next row | ↑ (could also be grid-side) |
| CFO Kress: about 9 GW of Blackwell deployed as of February 2026 | See 2.5 | Already used as an anchor in 2.5, not independent | ↑ (on the strict reading) |
| CoreWeave: 1.5 GW of active power at end-June 2026, about 500 MW added in the quarter | The public figure closest to "actually powered on" | Independent | Plausible magnitude, but one company cannot test the total |

The neocloud row points ↑ because neoclouds' net additions in 2026 alone equal half of the model's 2026 NVIDIA power-on (9.9 GW).

### 4.6 Where the 13–18 GW reasonable range comes from

The 80% range (14.1–16.5) reflects only parameter uncertainty. The reasonable range also accounts for definitional ambiguity and data conflicts:

- **Low end, about 13 GW.** Three cases land here:
  - Blackwell revenue per GW at about $32B, per management's 2025 remarks: rerunning gives 13.7 GW.
  - Revenue per GW priced on grid-side power: 14.1 GW if applied to Rubin only, 12.7 GW if applied to both Blackwell and Rubin.
  - The CoWoS low scenario capping shipments (14 GW), which corresponds to about 13 GW powered on.
- **High end, about 18 GW.** Two cases land here:
  - Blackwell revenue per GW at about $21B, from reading the ~9 GW "deployed" remark with no lag: rerunning gives 17.7 GW.
  - TrendForce's rack counts: at least 20 GW shipped, which at the same shipment-to-power-on ratio is about 18 GW powered on.

## 5. Which parameters matter most

**Physical GW depends mostly on what NVIDIA earns per GW; equivalent GW depends mostly on how fast Rubin really is.**

### 5.1 Rank correlation: which parameter matters most

The rank correlation coefficient measures how strongly the result moves when a parameter rises. The larger the absolute value, the bigger the effect; a negative sign means a larger parameter gives a smaller result.

| Parameter | Physical GW | GB200-equivalent GW |
|---|---|---|
| Blackwell revenue per GW | **−0.71** | −0.25 |
| Rubin revenue per GW | −0.40 | −0.27 |
| Shipping-to-power-on lag | −0.29 | −0.30 |
| FY28 revenue growth | +0.26 | +0.15 |
| Share that goes into GPU data centers | +0.23 | +0.12 |
| Rubin performance per watt | 0 | **+0.78** |
| Blackwell performance per watt | 0 | +0.24 |

FY28 growth matters little because most of the extra shipments in the second half of 2027 do not power on until 2028.

The table below is a quick lookup of FY28 shipments (GW, IT basis) for different values of FY28 data-center revenue and Rubin's revenue share. It uses the shortcut formula in 2.2 with point values on an FY28 basis, so it runs about 0.6–1 GW above the model's calendar-2027 shipments (17.2 GW).

| FY28 data-center revenue \ Rubin share of revenue | 50% | 60% | 70% | 80% |
|---|---|---|---|---|
| $600B | 18.1 | 17.4 | 16.7 | 16.0 |
| $647B (model median) | 19.6 | 18.8 | 18.0 | 17.3 |
| $690B (about the sell-side consensus) | 20.9 | 20.1 | 19.2 | 18.4 |

Each 10-percentage-point rise in Rubin's share cuts about 0.7–0.9 GW; each additional $45B of revenue adds about 1.1–1.5 GW (computed cell by cell from the table).

### 5.2 If Rubin slips: physical GW barely changes, compute falls 2%–7%

Suppose HBM4 or yield problems cut Rubin's share by 15 percentage points across the board from FY27 Q4, with GB300 filling the gap. There are two cases: total revenue unchanged, which requires spare GB300 capacity; or FY28 revenue 10% lower.

| Powered on in 2027 | Base | Slip, revenue unchanged | Slip, revenue −10% |
|---|---|---|---|
| Physical GW (IT basis) | 15.2 | 15.9 | 15.3 |
| GB200-equivalent GW | 23.0 | 22.5 | 21.5 |
| Rubin share of physical GW | 42% | 30% | 30% |

Physical GW barely changes because Blackwell is cheaper per GW, so the same money buys more watts. Of the two cases, lower revenue is the more realistic: memory is already a constraint (see 4.2), so GB300 may not have spare capacity to fill in.

### 5.3 If some backlog lasts over a year: at most about 1 GW more

The model assumes most shipments power on within 2–6 months, with only 0–15% waiting a further 6 months, so 2025 shipments contribute nothing to 2027. If in reality some GPUs sit for more than a year, the model misses them. (Satya Nadella has said Microsoft had chips it could not plug in; I saw this remark only in a search snippet.) About 9 GW shipped from the second half of 2025 through the first half of 2026. Every 5% of that slipping into 2027 adds about 0.45 GW to 2027; even a 10% slip adds only about 1 GW.

## 6. Are some common intuitions right?

**The common intuitions are broadly right. Two need correcting: NVIDIA's share should be revised down, and Rubin is not stuck in a queue. It has already shipped and is waiting for power.**

**"NVIDIA has 70%–80% of the market, so the others can be ignored."** Slightly too high. Epoch puts it at 65%–67%, and since Epoch understates other vendors, NVIDIA's true share is lower still. TPUs and AMD are both accelerating in 2027: sell-side forecasts have TPU shipments rising from 3.2–4.5 million to 5.0–7.9 million units (seen only in search snippets), and AMD has won a first 1 GW each from OpenAI and Anthropic. TPU and Trainium use the same advanced TSMC capacity and cannot be ignored. The industry figure is NVIDIA's divided by 0.55–0.68. The direction is right, though: work out NVIDIA and you have worked out about two-thirds.

**"GB200/GB300 cost two to three times as much as H100. Are they four to five times as capable?"** Four to five times is a reasonable estimate for a mixed workload, but the comparison has to be per GW, not per GPU. Revenue per GW went from $18B for Hopper to $25B for Grace Blackwell (Jensen Huang's figures on the earnings call, see 2.5), only about 1.4 times. Performance per watt, meanwhile, is about 1.9× for training (specification) and 8–23× for large-model inference (measured). So each dollar buys more compute. The claim that "H100 can't run frontier models" is, strictly, that it can't run them economically: frontier MoE models with long context need a 72-GPU interconnect domain like NVL72. H100 has only 8-GPU nodes, and that is where the 8–23× gap in throughput per MW comes from.

**"New capacity in 2027 is mostly GB200/GB300; Rubin is still in the queue."** Counted by physical GW powered on, this is right: Blackwell is 58%. But counted by shipments, Rubin is already about 61%, and by effective compute about 57%. So Rubin is not in a queue. It has already shipped and is waiting for power.

**"What powers on in 2027 should include GPUs sold earlier but not yet powered on."** Correct, and that is how the model works. About a third comes from 2026 backlog (see 3.3).

## 7. Limitations, and what to watch after the next earnings report

**Limitations**

- **Rubin has no measured data.** Its revenue per GW and its performance per watt are both estimates, the main reason the equivalent-GW range is wide.
- **The three anchors for Blackwell revenue per GW disagree,** and two of them rely on Epoch's price assumptions. Yet this is the parameter with the biggest effect on physical GW (see 5.1).
- **The 80% range reflects only parameter uncertainty.** Uncertainty from definitions and data conflicts is captured in the reasonable range in 4.6.
- **China is excluded.** China is not in NVIDIA's guidance; if exports are allowed, that is additional volume.
- **Revenue is assumed to be set entirely by supply.** If demand weakens, revenue will fall short. This estimate covers only "how much can be delivered," not "whether buyers can absorb it."
- **The 2026 power-on figure has no independent check.** No power-on data exist to test the 9.9 GW.

**After the next earnings report (FY27 Q3, mid-to-late November), update:**

1. Data-center revenue and Rubin's share: is Q3 about 20%, and how high does Q4 climb?
2. The revenue per GW management cites, especially whether Rubin goes above $40B.
3. Supply-chain rack counts, and whether Morgan Stanley's 7-million figure counts packages or dies. This is the unresolved conflict with the largest effect.
4. Quarterly growth in active power (electricity actually in use) at neoclouds such as CoreWeave and Nebius. This is the number closest to "actually powered on."

---

## Notes: definitions

1. **GW, IT basis, grid-side basis.** A GW (gigawatt) is one million kilowatts. The IT basis counts only electricity used by GPUs, CPUs and networking equipment in the racks. The grid-side basis is the total electricity a data center draws from the grid, including cooling and power-distribution losses. The ratio of the two is PUE, about 1.2 for new liquid-cooled AI data centers. NVIDIA prices revenue per GW on IT load (2.4), so revenue translates directly into IT GW. Use the grid-side basis when asking how much extra power the grid and generators must supply.
2. **Fiscal year.** NVIDIA's fiscal year ends in late January: FY27 roughly equals calendar 2026, and FY28 roughly equals calendar 2027. The model works month by month, which handles the one-month offset.
3. **Shipment and power-on.** Shipment is when NVIDIA recognizes revenue; power-on is when the data center is energized and the GPUs start working. The two are about four months apart on average.
4. **Equivalent GW.** How many GW of GB200 (or GB300) racks it would take to match a batch of GPUs' compute, used to compare the working capacity of different generations.
5. **Median, mode.** The median is the middle value of the 20,000 simulation results. The mode is the most likely value within a parameter's range.
6. **Other abbreviations.**

| Abbreviation | Meaning |
|---|---|
| ODM | Contract manufacturer that assembles servers |
| HGX | NVIDIA's 8-GPU server board |
| NVL72 | A rack of 72 GPUs connected as one unit |
| MoE | Mixture-of-experts model |
| Neocloud | A newer cloud provider that specializes in renting out GPUs |
| TPU | Google's in-house AI chip |
| Trainium | Amazon's in-house AI chip |
| LPU | NVIDIA's inference accelerator |
| HBM | High-bandwidth memory |
| CoWoS | TSMC's advanced packaging that puts the GPU and HBM in one package |
| 10-Q | A US public company's quarterly filing |
| TDP | A chip's rated power |

## Appendix: how the model evolved

All figures in the text come from the final version (v3). The table records earlier versions and the problems found in each.

| Version | Approach | Result | Problems found |
|---|---|---|---|
| v0 | 2027 data-center revenue of $620–640B ÷ $25B or $40B per GW | 15.5–25.6 GW | Range too wide; generation mix guessed; GW basis undefined; revenue per GW untested; not all revenue goes into data centers; shipment ≠ power-on |
| v1 | Generation mix by quarter, monthly lag, backtest of revenue per GW | 14.8 GW | 2026 missed shipments from August–October 2025; no sensitivity analysis |
| v2 | Added the missing shipments, sensitivity analysis and a Rubin-slip scenario | 14.9 GW | A second-opinion review found five serious problems: the same revenue was deducted twice; "9 GW" contradicted the lag assumption; some cross-checks were circular; Rubin's performance-per-watt floor was too high; the slip scenario held revenue constant |
| v3 | Aligned the basis of revenue per GW and the deduction; Rubin floor lowered to 1.3; FY28 growth floor lowered to 50%; slip scenario can also cut revenue; NVIDIA share floor lowered to 55%; revenue per GW can be overridden for low/high cases | **15.2 GW** | Final version. Two rounds each of correctness and reader review then corrected the direction of the grid-side reading and removed data-center-basis evidence from the ↑ rows in 4.1 |

## Sources

**Primary documents and data (original pages read):**

- NVIDIA quarterly CFO commentary, press releases and 10-Q filings (SEC EDGAR), e.g. [Q2 FY27 CFO commentary](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000073/q2fy27cfocommentary.htm) and [Q2 FY27 10-Q](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)
- NVIDIA's official earnings-call transcripts (PDF) for FY26 Q1 through FY27 Q1
- Epoch AI: [AI chip sales](https://epoch.ai/data/ai-chip-sales) ([CSV](https://epoch.ai/data/ai_chip_sales_timelines_by_chip.csv)), [data-center timelines](https://epoch.ai/data/data_centers/data_center_timelines.csv), [chip-components methodology](https://epoch.ai/data/ai-chip-components-documentation/methodology)
- SemiAnalysis: [InferenceX](https://inferencex.semianalysis.com/compare/deepseek-r1-gb200-vs-h100), InferenceMAX, the October 19, 2026 newsletter (portion before the paywall), [Huawei Ascend production](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp) (portion before the paywall)
- NVIDIA DGX manuals and spec pages; Google's PUE page; BNEF
- [KGI TSMC report, March 2026](https://www.kgi.com.hk/en/-/media/files/kgishk/research-reports/tw-reports/tsmc_2330-tt_09032026e.pdf)
- TrendForce press releases (e.g. [HBM outlook, September 29, 2026](https://www.trendforce.com/presscenter/news/20260929-13255.html); 2027 rack value)

**Secondary sources (read via reprints or transcripts; original not seen):**

- NVIDIA Q2 FY27 earnings call: transcripts from [Motley Fool (via Webull)](https://www.webull.com/news/15497781742806016) and [platformaeronaut](https://transcripts.platformaeronaut.com/transcripts/NVDA-2Q27-transcript)
- Morgan Stanley rack and CoWoS figures, as reported by [TechNews](https://technews.tw/2026/09/10/morgan-stanley-is-bullish-on-nvidias-rack-server-shipments-expecting-them-to-double-this-year/), [TechNews](https://technews.tw/2026/07/13/the-significant-increase-in-chip-demand-in-2027-will-boost-the-size-of-the-wafer-foundry-and-advanced-packaging-markets/), Economic Daily News and [KuCoin](https://www.kucoin.com/news/flash/morgan-stanley-report-cowos-demand-to-double-by-2027-amd-and-asics-drive-ai-chip-growth)
- Ming-Chi Kuo, as reported by [Commercial Times](https://www.ctee.com.tw/news/20260107701081-430704)
- Wolfe Research, as reported by [boerse-express](https://www.boerse-express.com/news/articles/nvidia-aktie-billionen-pipeline-im-blick-885518)
- Wells Fargo, as reported by Yahoo Finance
- CoreWeave earnings-call summary

**Seen only in search snippets:**

- SemiAnalysis year-by-year additions for 2025–2027 (15.6 / 25 / 51.2 GW)
- NVIDIA CoWoS of about 700k wafers in 2026 and about 910k CoWoS-L wafers in 2027
- TPU shipment forecasts
- Satya Nadella's "warm shell" remark
- FY28 consensus of $692B
