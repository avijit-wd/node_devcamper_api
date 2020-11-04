const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a  title for the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add a some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating in between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than 1 review per bootcamp
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
reviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost after remove
reviewSchema.post("remove", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", reviewSchema);
