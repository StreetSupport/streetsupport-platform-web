
# Clarifying Service Counts in the Rebuild

As part of the Street Support Network rebuild, we reviewed how services are counted and displayed on both location pages and across the platform. In doing so, we discovered that the legacy website was miscalculating the number of services, both locally and nationally. Sometimes understating what is available, sometimes overstating.

This wasn’t due to incorrect data, but rather how service entries were structured and counted behind the scenes.

## What We Found

On the old site, any published entry in the database's `ProvidedServices` collection was included in the count, even if multiple entries referred to the same real-world service, just tagged under different subcategories or split by eligibility criteria. This led to significant inflation, particularly in areas with more active data input.

For example, if one organisation offered food support and ticked three subcategories - "meals", "food parcels", and "emergency food" - each of those was counted as a separate service, even if they all referred to the same actual offering.

## How We’re Counting Services Now

In the rebuild, we’ve taken the opportunity to define more clearly what counts as a distinct service. This ensures our numbers are more meaningful and accurately reflect the support that’s truly available in each location.

> A **service** is now defined as one unique combination of:
>
> - A **published organisation**
> - A **published service**
> - A single **service category and subcategory**

This means:
- If an organisation offers two different types of support (e.g. **accommodation** and **food**), each will be counted separately.
- If an organisation lists the same service under multiple subcategories, it will only be counted once.

## Examples

**Example 1:**  
*“NOAH Enterprise” offers both debt advice and help with benefits under the “support” category.*  
→ Counted as **2 services**

**Example 2:**  
*“Luton Foodbank” ticks three subcategories under “foodbank” but refers to a single food parcel service.*  
→ Counted as **1 service**

## Why This Matters

This updated logic makes our reporting more transparent and robust. It helps local partnerships understand what’s actually available, avoids inflated impressions, and provides a more honest foundation for funding bids, strategy, and advocacy.

We believe this small change brings our platform closer to the practical reality on the ground and better supports the people and organisations who rely on it.
