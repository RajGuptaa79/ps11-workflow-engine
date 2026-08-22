const mongoose = require("mongoose");
require("dotenv").config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const db = mongoose.connection;

    // -------------------------
    // FORM SCHEMA: ORDERS
    // -------------------------
    await db.collection("form_schemas").updateOne(
      {
        projectName: "sample-flow",
        schemaName: "orders",
      },
      {
        $set: {
          projectName: "sample-flow",
          schemaName: "orders",
          formIdRef: "sample-flow_forms",
          isActive: true,
          isDeleted: false,

          fields: [
            {
              field: "totalAmount",
              dataType: "Number",
              label: "Total Amount",
              type: "number",
              inputType: "input",
              validation: true,
              mandatoryField: true,
              mappedColumn: null,
              mappedTableRef: null,
              multipleSelect: false,
            },
            {
              field: "stock_type",
              dataType: "String",
              label: "Stock Type",
              type: "text",
              inputType: "input",
              validation: true,
              mandatoryField: false,
              mappedColumn: null,
              mappedTableRef: null,
              multipleSelect: false,
            },
            {
              field: "item_id",
              dataType: "String",
              label: "Item ID",
              type: "text",
              inputType: "input",
              validation: true,
              mandatoryField: true,
              mappedColumn: null,
              mappedTableRef: null,
              multipleSelect: false,
            },
          ],
        },
      },
      {
        upsert: true,
      }
    );

    // -------------------------
    // FORM SCHEMA: INVOICES
    // -------------------------
    await db.collection("form_schemas").updateOne(
      {
        projectName: "sample-flow",
        schemaName: "invoices",
      },
      {
        $set: {
          projectName: "sample-flow",
          schemaName: "invoices",
          formIdRef: "sample-flow_forms",
          isActive: true,
          isDeleted: false,

          fields: [
            {
              field: "order_id",
              dataType: "String",
              label: "Order ID",
              type: "text",
              inputType: "input",
              validation: true,
              mandatoryField: true,
              mappedColumn: "_id",
              mappedTableRef: "orders",
              multipleSelect: false,
            },
            {
              field: "vendor_id",
              dataType: "String",
              label: "Vendor ID",
              type: "text",
              inputType: "input",
              validation: true,
              mandatoryField: true,
              mappedColumn: null,
              mappedTableRef: null,
              multipleSelect: false,
            },
            {
              field: "amount",
              dataType: "Number",
              label: "Invoice Amount",
              type: "number",
              inputType: "input",
              validation: true,
              mandatoryField: true,
              mappedColumn: null,
              mappedTableRef: null,
              multipleSelect: false,
            },
            {
              field: "payment_status",
              dataType: "String",
              label: "Payment Status",
              type: "text",
              inputType: "input",
              validation: true,
              mandatoryField: false,
              mappedColumn: null,
              mappedTableRef: null,
              multipleSelect: false,
            },
          ],
        },
      },
      {
        upsert: true,
      }
    );

    // -------------------------
    // CUSTOM FUNCTION:
    // NOTIFY VENDOR
    // -------------------------
    await db.collection("custom_functions").updateOne(
      {
        projectName: "sample-flow",
        name: "NotifyVendorOnOrder",
      },
      {
        $set: {
          projectName: "sample-flow",
          name: "NotifyVendorOnOrder",
          description: "Notify vendor when a new order is created",

          payloadStructure: {
            orderId: "String",
            projectName: "String",
          },

          expectedResponseSchema: {
            vendorId: "String",
            notified: "Boolean",
          },

          isActive: true,
          isDeleted: false,
        },
      },
      {
        upsert: true,
      }
    );

    // -------------------------
    // CUSTOM FUNCTION:
    // SEND CONFIRMATION
    // -------------------------
    await db.collection("custom_functions").updateOne(
      {
        projectName: "sample-flow",
        name: "SendOrderConfirmation",
      },
      {
        $set: {
          projectName: "sample-flow",
          name: "SendOrderConfirmation",
          description: "Send confirmation after order processing",

          payloadStructure: {
            orderId: "String",
            invoiceId: "String",
          },

          expectedResponseSchema: {
            orderId: "String",
            invoiceId: "String",
            notified: "Boolean",
          },

          isActive: true,
          isDeleted: false,
        },
      },
      {
        upsert: true,
      }
    );

    // -------------------------
    // BUTTON
    // -------------------------
    await db.collection("buttons").updateOne(
      {
        projectName: "sample-flow",
        buttonId: "update-inventory-button",
      },
      {
        $set: {
          projectName: "sample-flow",
          buttonId: "update-inventory-button",
          formId: "orders-form",
          name: "Update Inventory",
          type: "query",
          role: "system",
          description:
            "Updates inventory for a physical item during order processing.",
          isActive: true,
          isDeleted: false,
        },
      },
      {
        upsert: true,
      }
    );

    // -------------------------
    // BUTTON CONDITION
    // -------------------------
    await db.collection("button_conditions").updateOne(
      {
        projectName: "sample-flow",
        buttonId: "update-inventory-button",
      },
      {
        $set: {
          projectName: "sample-flow",
          buttonId: "update-inventory-button",
          formId: "orders-form",
          field: "stock_type",
          operator: "eq",
          value: "physical",
          description:
            "Allow inventory update only when stock type is physical.",
          isActive: true,
          isDeleted: false,
        },
      },
      {
        upsert: true,
      }
    );

    console.log("Seed completed successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error.message);

    await mongoose.disconnect();
  }
}

seedDatabase();