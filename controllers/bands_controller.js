// DEPENDENCIES
const bands = require("express").Router();
const db = require("../models");
const { Band, MeetGreet, SetTime, Event } = db;
const { Op } = require("sequelize");

// GET ALL BANDS
bands.get("/", async (req, res) => {
  try {
    const foundBands = await Band.findAll({
      order: [["available_start_time", "ASC"]],
      where: {
        name: { [Op.like]: `%${req.query.name ? req.query.name : ""}%` },
      },
    });
    res.status(200).json(foundBands);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET BAND
bands.get("/:name", async (req, res) => {
  try {
    const foundBand = await Band.findOne({
      where: { name: req.params.name },
      include: [
        {
          model: MeetGreet,
          as: "meet_greets",
          attributes: { exclude: ["band_id", "event_id"] },
          include: {
            model: Event,
            as: "event",
            where: {
              name: {
                [Op.like]: `%${req.query.event ? req.query.event : ""}%`,
              },
            },
          },
        },
        {
          model: SetTime,
          as: "set_times",
          attributes: { exclude: ["band_id", "event_id"] },
          include: {
            model: Event,
            as: "event",
            where: {
              name: {
                [Op.like]: `%${req.query.event ? req.query.event : ""}%`,
              },
            },
          },
        },
      ],
      order: [
        [
          { model: MeetGreet, as: "meet_greets" },
          { model: Event, as: "event" },
          "date",
          "DESC",
        ],
        [
          { model: SetTime, as: "set_times" },
          { model: Event, as: "event" },
          "date",
          "DESC",
        ],
      ],
    });
    res.status(200).json(foundBand);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CREATE BAND
bands.post("/", async (req, res) => {
  try {
    const newBand = await Band.create(req.body);
    res.status(200).json({
      message: "New band created!",
      data: newBand,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE BAND
bands.put("/:id", async (req, res) => {
  try {
    const updatedBands = await Band.update(req.body, {
      where: {
        band_id: req.params.id,
      },
    });
    res.status(200).json({
      message: `Updated ${updatedBands} band.`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE BAND
bands.delete("/:id", async (req, res) => {
  try {
    const deletedBands = await Band.destroy({
      where: {
        band_id: req.params.id,
      },
    });
    res.status(200).json({
      message: `Deleted ${deletedBands} band.`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = bands;
