import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import PageVisit from "@/app/models/PageVisit";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const last7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // ── Total visits ────────────────────────────────────────────────────────
    const totalVisits   = await PageVisit.countDocuments();
    const visitsToday   = await PageVisit.countDocuments({
      timestamp: { $gte: new Date(now.toDateString()) },
    });
    const visitsLast7   = await PageVisit.countDocuments({ timestamp: { $gte: last7 } });
    const visitsLast30  = await PageVisit.countDocuments({ timestamp: { $gte: last30 } });

    // ── Top pages ────────────────────────────────────────────────────────────
    const topPages = await PageVisit.aggregate([
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // ── Daily visits — last 14 days ──────────────────────────────────────────
    const last14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const dailyRaw = await PageVisit.aggregate([
      { $match: { timestamp: { $gte: last14 } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const dailyMap: Record<string, number> = {};
    dailyRaw.forEach((d: any) => { dailyMap[d._id] = d.count; });
    const daily = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(last14.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      return { date: key, count: dailyMap[key] ?? 0 };
    });

    // ── Top referrers ────────────────────────────────────────────────────────
    const topReferrers = await PageVisit.aggregate([
      { $match: { referrer: { $ne: "" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return NextResponse.json({
      totalVisits,
      visitsToday,
      visitsLast7,
      visitsLast30,
      topPages,
      daily,
      topReferrers,
    });
  } catch (err) {
    console.error("[admin/analytics]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
