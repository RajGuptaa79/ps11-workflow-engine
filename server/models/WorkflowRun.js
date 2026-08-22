const mongoose = require("mongoose");

const stepResultSchema = new mongoose.Schema(
  {
    stepId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    durationMs: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const workflowRunSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: true,
    },

    triggerPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "running",
        "completed",
        "failed",
        "partial",
      ],
      default: "pending",
    },

    stepResults: {
      type: [stepResultSchema],
      default: [],
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "workflow_runs",
  }
);

workflowRunSchema.index({
  workflowId: 1,
  startedAt: -1,
});

module.exports = mongoose.model(
  "WorkflowRun",
  workflowRunSchema
);