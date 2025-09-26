const { Schema, model } = require("mongoose");

const subAdminPermissionSchema = new Schema(
  {
    subAdminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      unique: true,
    },
    permissions: {
      manageSuppliers: {
        type: Boolean,
        default: false,
      },
      masterTables: {
        type: Boolean,
        default: false,
      },
      subAdmin: {
        type: Boolean,
        default: false,
      },
      settings: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

const SubAdminPermission = model("SubAdminPermission", subAdminPermissionSchema)
module.exports = SubAdminPermission

