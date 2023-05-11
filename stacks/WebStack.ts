import * as lambda from "aws-cdk-lib/aws-lambda";
import fs from "fs-extra";
import path from "path";
import type { StackContext } from "sst/constructs";
import { NextjsSite } from "sst/constructs";

export function WebStack({ stack, app }: StackContext) {
  if (!app.local) {
    // Create a layer for production
    // This saves shipping Prisma binaries once per function
    const layerPath = ".sst/layers/prisma";

    // Clear out the layer path
    fs.removeSync(layerPath);
    fs.mkdirSync(layerPath, { recursive: true });

    // Copy files to the layer
    const toCopy = [
      // "node_modules/.prisma",
      "node_modules/@prisma/client",
      "node_modules/prisma/build",
    ];
    for (const file of toCopy) {
      fs.copySync(file, path.join(layerPath, "nodejs", file), {
        // Do not include binary files that aren't for AWS to save space
        filter: (src) => !src.endsWith("so.node") || src.includes("rhel"),
      });
    }
    const prismaLayer = new lambda.LayerVersion(stack, "PrismaLayer", {
      code: lambda.Code.fromAsset(path.resolve(layerPath)),
    });

    // Add to all functions in this stack
    stack.addDefaultFunctionLayers([prismaLayer]);
  }

  const site = new NextjsSite(stack, "modal-web", {
    path: "apps/web",
    environment: {
      DATABASE_URL: process.env.DATABASE_URL!,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
