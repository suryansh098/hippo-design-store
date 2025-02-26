import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import path from "path";
import { buildConfig } from "payload/config";
import dotenv from "dotenv";
import { Products } from "./collections/Products/Products";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { ProductFiles } from "./collections/ProductFiles";
import { Orders } from "./collections/Orders";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// S3 Adapter configuration
const bucketAdapter = s3Adapter({
  config: {
    endpoint: process.env.S3_BUCKET_ENDPOINT || "",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    region: process.env.S3_BUCKET_REGION || "",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  },
  bucket: process.env.S3_BUCKET_NAME || "",
});

// Cloud Storage Plugin
const storagePlugin = cloudStorage({
  collections: {
    media: {
      adapter: bucketAdapter,
      prefix: "media/",
    },
    product_files: {
      adapter: bucketAdapter,
      prefix: "product_files/",
    },
  },
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFiles, Orders],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- HippoDesignStore",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  rateLimit: {
    max: 2000,
  },
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  plugins: [storagePlugin],
});
