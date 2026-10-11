import { CropPrice } from '../models/CropPrice.js';
import { Market } from '../models/Market.js';

// @desc Get all crop prices with search, filtering, and pagination
// @route GET /api/prices
export const getCropPrices = async (req, res) => {
  try {
    const {
      crop,
      market,
      category,
      state,
      date,
      minPrice,
      maxPrice,
      sortBy = 'date',
      order = 'desc',
      limit = 50,
      page = 1,
    } = req.query;

    const filter = {};

    if (crop) {
      filter.cropName = { $regex: crop, $options: 'i' };
    }

    if (market) {
      filter.market = { $regex: market, $options: 'i' };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (state && state !== 'All') {
      filter.state = { $regex: state, $options: 'i' };
    }

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (minPrice || maxPrice) {
      filter.modalPrice = {};
      if (minPrice) filter.modalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.modalPrice.$lte = Number(maxPrice);
    }

    const sortOption = {};
    if (sortBy === 'price') {
      sortOption.modalPrice = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'change') {
      sortOption.priceChangePercentage = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'crop') {
      sortOption.cropName = order === 'asc' ? 1 : -1;
    } else {
      sortOption.date = order === 'asc' ? 1 : -1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const prices = await CropPrice.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await CropPrice.countDocuments(filter);

    res.json({
      success: true,
      count: prices.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      prices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Compare prices for a crop across different markets (SPECIAL FEATURE)
// @route GET /api/prices/compare?crop=Wheat
export const compareMarketPrices = async (req, res) => {
  try {
    const { crop } = req.query;

    if (!crop) {
      return res.status(400).json({ success: false, message: 'Please provide a crop name to compare' });
    }

    // Find the latest records for this crop across all markets
    const latestPrices = await CropPrice.aggregate([
      {
        $match: {
          cropName: { $regex: `^${crop}$`, $options: 'i' },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $group: {
          _id: '$market',
          latestDoc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$latestDoc' },
      },
      {
        $sort: { modalPrice: -1 },
      },
    ]);

    if (!latestPrices || latestPrices.length === 0) {
      return res.status(404).json({ success: false, message: `No market records found for crop: ${crop}` });
    }

    // Calculate highest, lowest, average, and spread
    const highest = latestPrices[0]; // sorted desc
    const lowest = latestPrices[latestPrices.length - 1];
    const avgPrice = Math.round(
      latestPrices.reduce((acc, curr) => acc + curr.modalPrice, 0) / latestPrices.length
    );
    const spread = highest.modalPrice - lowest.modalPrice;
    const spreadPercent = Number(((spread / lowest.modalPrice) * 100).toFixed(1));

    // Fetch market distance reference if available
    const marketNames = latestPrices.map((p) => p.market);
    const marketsData = await Market.find({ name: { $in: marketNames } });
    const marketLookup = {};
    marketsData.forEach((m) => {
      marketLookup[m.name] = m;
    });

    const enrichedComparison = latestPrices.map((p) => {
      const marketMeta = marketLookup[p.market];
      return {
        ...p,
        isHighest: p._id.toString() === highest._id.toString(),
        isLowest: p._id.toString() === lowest._id.toString(),
        diffFromLowest: p.modalPrice - lowest.modalPrice,
        diffFromHighest: p.modalPrice - highest.modalPrice,
        transportBenchmarkKm: marketMeta?.distanceBenchmarkKm || 45,
        avgTransportRate: marketMeta?.avgTransportRatePerQuintalKm || 1.8,
        tradingHours: marketMeta?.tradingHours || '06:00 AM - 04:00 PM',
        contactPhone: marketMeta?.contactPhone || '+91 98765 43210',
      };
    });

    res.json({
      success: true,
      crop,
      totalMarkets: latestPrices.length,
      highestMarket: {
        market: highest.market,
        state: highest.state,
        modalPrice: highest.modalPrice,
        maxPrice: highest.maxPrice,
      },
      lowestMarket: {
        market: lowest.market,
        state: lowest.state,
        modalPrice: lowest.modalPrice,
        minPrice: lowest.minPrice,
      },
      averagePrice: avgPrice,
      spreadDifference: spread,
      spreadPercentage: spreadPercent,
      comparison: enrichedComparison,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get price history for charts
// @route GET /api/prices/history?crop=Wheat&market=Azadpur%20Mandi
export const getPriceHistory = async (req, res) => {
  try {
    const { crop, market, limit = 30 } = req.query;

    const filter = {};
    if (crop) filter.cropName = { $regex: crop, $options: 'i' };
    if (market) filter.market = { $regex: market, $options: 'i' };

    const records = await CropPrice.find(filter)
      .sort({ date: 1 })
      .limit(Number(limit));

    // If records have priceHistory sub-documents, we can flatten or use them
    let historyPoints = [];
    if (records.length === 1 && records[0].priceHistory?.length > 0) {
      historyPoints = records[0].priceHistory.map((h) => ({
        date: h.date,
        modalPrice: h.modalPrice,
        minPrice: h.minPrice,
        maxPrice: h.maxPrice,
        volume: h.volume,
        market: records[0].market,
      }));
    } else {
      historyPoints = records.map((r) => ({
        id: r._id,
        date: r.date,
        modalPrice: r.modalPrice,
        minPrice: r.minPrice,
        maxPrice: r.maxPrice,
        volume: r.arrivalVolume,
        market: r.market,
        crop: r.cropName,
      }));
    }

    res.json({ success: true, history: historyPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get summary statistics for dashboard
// @route GET /api/prices/summary
export const getDashboardSummary = async (req, res) => {
  try {
    const totalCropsCount = (await CropPrice.distinct('cropName')).length;
    const totalMarketsCount = (await CropPrice.distinct('market')).length;

    // Highest and lowest priced crops right now
    const highestPriced = await CropPrice.findOne().sort({ modalPrice: -1 });
    const lowestPriced = await CropPrice.findOne().sort({ modalPrice: 1 });

    // Recent price changes (gainers & losers)
    const topGainers = await CropPrice.find({ priceChangePercentage: { $gt: 0 } })
      .sort({ priceChangePercentage: -1 })
      .limit(5);

    const topLosers = await CropPrice.find({ priceChangePercentage: { $lt: 0 } })
      .sort({ priceChangePercentage: 1 })
      .limit(5);

    // Latest 8 price updates
    const recentUpdates = await CropPrice.find()
      .sort({ date: -1 })
      .limit(8);

    res.json({
      success: true,
      stats: {
        totalCropsCount,
        totalMarketsCount,
        highestPriced: highestPriced ? {
          crop: highestPriced.cropName,
          market: highestPriced.market,
          price: highestPriced.modalPrice,
        } : null,
        lowestPriced: lowestPriced ? {
          crop: lowestPriced.cropName,
          market: lowestPriced.market,
          price: lowestPriced.modalPrice,
        } : null,
      },
      topGainers,
      topLosers,
      recentUpdates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get metadata (available crop names, categories, markets)
// @route GET /api/prices/meta
export const getPriceMeta = async (req, res) => {
  try {
    const crops = await CropPrice.distinct('cropName');
    const markets = await CropPrice.distinct('market');
    const categories = await CropPrice.distinct('category');
    const states = await CropPrice.distinct('state');

    res.json({
      success: true,
      crops: crops.sort(),
      markets: markets.sort(),
      categories: categories.sort(),
      states: states.sort(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add a new crop price
// @route POST /api/prices
export const createCropPrice = async (req, res) => {
  try {
    const {
      cropName,
      category,
      variety,
      market,
      state,
      district,
      minPrice,
      maxPrice,
      modalPrice,
      arrivalVolume,
      priceChange,
      mspPrice,
      qualityGrade,
    } = req.body;

    if (!cropName || !market || !state || !modalPrice) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const calculatedMin = Number(minPrice) || Number(modalPrice) * 0.92;
    const calculatedMax = Number(maxPrice) || Number(modalPrice) * 1.08;
    const numChange = Number(priceChange) || 0;
    const changePct = modalPrice ? Number(((numChange / modalPrice) * 100).toFixed(2)) : 0;
    const trend = numChange > 0 ? 'up' : numChange < 0 ? 'down' : 'stable';

    // Generate simulated 14-day history for charts
    const priceHistory = [];
    const base = Number(modalPrice);
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const variance = (Math.sin(i * 0.8) * 0.05 + (Math.random() - 0.5) * 0.03);
      const dayPrice = Math.round(base * (1 + variance));
      priceHistory.push({
        date: d,
        modalPrice: dayPrice,
        minPrice: Math.round(dayPrice * 0.94),
        maxPrice: Math.round(dayPrice * 1.06),
        volume: Math.round(100 + Math.random() * 80),
      });
    }

    const newPrice = await CropPrice.create({
      cropName: cropName.trim(),
      category: category || 'Cereals',
      variety: variety || 'FAQ Standard',
      market: market.trim(),
      state: state.trim(),
      district: district || '',
      minPrice: Math.round(calculatedMin),
      maxPrice: Math.round(calculatedMax),
      modalPrice: Number(modalPrice),
      arrivalVolume: Number(arrivalVolume) || 120,
      priceChange: numChange,
      priceChangePercentage: changePct,
      trend,
      qualityGrade: qualityGrade || 'Grade A (FAQ)',
      mspPrice: mspPrice ? Number(mspPrice) : undefined,
      priceHistory,
      addedBy: req.user?._id,
      date: new Date(),
    });

    res.status(201).json({ success: true, price: newPrice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update an existing crop price
// @route PUT /api/prices/:id
export const updateCropPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await CropPrice.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Price record not found' });
    }

    if (updateData.modalPrice && updateData.modalPrice !== existing.modalPrice) {
      const oldPrice = existing.modalPrice;
      const newPrice = Number(updateData.modalPrice);
      updateData.priceChange = newPrice - oldPrice;
      updateData.priceChangePercentage = Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2));
      updateData.trend = updateData.priceChange > 0 ? 'up' : updateData.priceChange < 0 ? 'down' : 'stable';
    }

    const updated = await CropPrice.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, price: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a crop price record
// @route DELETE /api/prices/:id
export const deleteCropPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const price = await CropPrice.findById(id);
    if (!price) {
      return res.status(404).json({ success: false, message: 'Price record not found' });
    }

    await CropPrice.findByIdAndDelete(id);
    res.json({ success: true, message: 'Crop price record removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
