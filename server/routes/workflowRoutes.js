const express = require("express");
const Workflow = require("../models/Workflow");
const WorkflowRun = require("../models/WorkflowRun");
const executeWorkflow = require("../workflowExecutor");
const getProjectContext = require("../projectContext");

const router = express.Router();
// Prepare project context for workflow detection
router.post("/detect", async (req, res) => {
  try {
    const { projectName, requirement } = req.body;

    if (!projectName || !requirement) {
      return res.status(400).json({
        message: "projectName and requirement are required",
      });
    }

    const context = await getProjectContext(projectName);

    res.json({
      message: "Project context fetched successfully",
      projectName,
      requirement,
      context,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to prepare workflow detection",
      error: error.message,
    });
  }
});
// Create a workflow
router.post("/", async (req, res) => {
  try {
    const workflow = await Workflow.create(req.body);

    res.status(201).json({
      message: "Workflow created successfully",
      workflow,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create workflow",
      error: error.message,
    });
  }
});

// Get all active workflows
router.get("/", async (req, res) => {
  try {
    const workflows = await Workflow.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.json(workflows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workflows",
      error: error.message,
    });
  }
});

// Get one workflow by ID
router.get("/:workflowId", async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.workflowId,
      isDeleted: false,
    });

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.json(workflow);
  } catch (error) {
    res.status(400).json({
      message: "Invalid workflow ID",
      error: error.message,
    });
  }
});
// Trigger a workflow
router.post("/trigger/:workflowId", async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.workflowId,
      isActive: true,
      isDeleted: false,
    });

    if (!workflow) {
      return res.status(404).json({
        message: "Active workflow not found",
      });
    }

    const run = await WorkflowRun.create({
      workflowId: workflow._id,
      triggerPayload: req.body,
      status: "running",
      stepResults: [],
      startedAt: new Date(),
      completedAt: null,
    });
    const executedRun = await executeWorkflow(workflow, run);

    res.status(201).json({
      message: "Workflow triggered successfully",
      run: executedRun,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to trigger workflow",
      error: error.message,
    });
  }
});
// Get workflow run history
router.get("/runs/:workflowId", async (req, res) => {
  try {
    const runs = await WorkflowRun.find({
      workflowId: req.params.workflowId,
    }).sort({
      startedAt: -1,
    });

    res.json(runs);
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch workflow runs",
      error: error.message,
    });
  }
});
// Update a workflow
router.patch("/:workflowId", async (req, res) => {
  try {
    const workflow = await Workflow.findOneAndUpdate(
      {
        _id: req.params.workflowId,
        isDeleted: false,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.json({
      message: "Workflow updated successfully",
      workflow,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update workflow",
      error: error.message,
    });
  }
});

// Soft delete a workflow
router.delete("/:workflowId", async (req, res) => {
  try {
    const workflow = await Workflow.findOneAndUpdate(
      {
        _id: req.params.workflowId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!workflow) {
      return res.status(404).json({
        message: "Workflow not found",
      });
    }

    res.json({
      message: "Workflow deleted successfully",
      workflow,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid workflow ID",
      error: error.message,
    });
  }
});

module.exports = router;