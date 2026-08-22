const mongoose = require("mongoose");

// Condition used to decide whether a workflow step should run
const conditionSchema = new mongoose.Schema(
  {
    field: {
      type: String,
      required: true,
    },

    operator: {
      type: String,
      required: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// One individual step inside a workflow
const stepSchema = new mongoose.Schema(
  {
    stepId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    actionType: {
      type: String,
      required: true,
      enum: [
        "function",
        "formCreate",
        "formUpdate",
        "formDelete",
        "operation",
      ],
    },

    // Required when actionType = function
    functionName: {
      type: String,
      default: null,
      required: function () {
        return this.actionType === "function";
      },
    },

    // Required when actionType is a form action
    schema: {
      type: String,
      default: null,
      required: function () {
        return ["formCreate", "formUpdate", "formDelete"].includes(
          this.actionType
        );
      },
    },

    // Required when actionType = operation
    formId: {
      type: String,
      default: null,
      required: function () {
        return this.actionType === "operation";
      },
    },

    buttonId: {
      type: String,
      default: null,
      required: function () {
        return this.actionType === "operation";
      },
    },

    inputMapping: {
      type: Object,
      default: {},
    },

    condition: {
      type: conditionSchema,
      default: null,
    },

    onSuccess: {
      type: String,
      default: null,
    },

    onFailure: {
      type: String,
      default: "abort",
    },
  },
  {
    _id: false,
  }
);

// Event that starts the workflow
const triggerEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["formCreate", "formUpdate", "formDelete", "manual", "webhook"],
    },

    schema: {
      type: String,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// Complete workflow definition
const workflowSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    workflowName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    triggerEvent: {
      type: triggerEventSchema,
      required: true,
    },

    steps: {
      type: [stepSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// A workflow name must be unique only inside its project
workflowSchema.index(
  {
    projectName: 1,
    workflowName: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Workflow", workflowSchema);