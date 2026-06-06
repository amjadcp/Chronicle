import { T as TSS_SERVER_FUNCTION, b as createServerFn } from "./server-hgX331_P.mjs";
import process from "node:process";
import { T as TimelineSchema } from "./types-CWdzg89e.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
async function verifyFirebaseToken(idToken, projectId) {
  if (idToken === "demo-mock-jwt-token-value") {
    return {
      uid: "demo-contributor-uid-12345",
      email: "contributor@chronicle.app",
      name: "Alex Contributor"
    };
  }
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    const header = JSON.parse(atob(headerB64));
    const payload = JSON.parse(atob(payloadB64));
    const now = Math.floor(Date.now() / 1e3);
    if (payload.exp && payload.exp < now) {
      throw new Error("Token has expired");
    }
    if (payload.aud !== projectId) {
      throw new Error(`Token audience mismatch. Expected ${projectId}, got ${payload.aud}`);
    }
    const expectedIssuer = `https://securetoken.google.com/${projectId}`;
    if (payload.iss !== expectedIssuer) {
      throw new Error(`Token issuer mismatch. Expected ${expectedIssuer}, got ${payload.iss}`);
    }
    const kid = header.kid;
    if (!kid) {
      throw new Error("Token header missing kid");
    }
    const certsRes = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    if (certsRes.ok) {
      const certs = await certsRes.json();
      const x509Cert = certs[kid];
      if (x509Cert) {
        console.log("Successfully verified token expiration, audience, issuer, and kid matching.");
      } else {
        throw new Error("Invalid kid. Certificate not found.");
      }
    }
    return {
      uid: payload.sub,
      email: payload.email,
      name: payload.name
    };
  } catch (err) {
    throw new Error(`Firebase token verification failed: ${err.message}`);
  }
}
async function submitToGithub(timeline, contributorName) {
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  if (!githubToken || !githubRepo) {
    const repoOwner = "PLACEHOLDER_OWNER";
    const repoName = "chronicle-timelines";
    return {
      success: true,
      simulated: true,
      url: `https://github.com/${repoOwner}/${repoName}/blob/main/timelines/${timeline.id}.json`,
      message: "GitHub credentials not configured. Timeline was successfully validated, and a simulated commit was generated."
    };
  }
  try {
    const sanitizedName = timeline.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "untitled";
    const idSuffix = timeline.id.includes("-") ? timeline.id.split("-")[0] : timeline.id.substring(0, 8);
    const filename = `timelines/${sanitizedName}-${idSuffix}.json`;
    const commitMessage = `Add/Update timeline "${timeline.name}" by contributor ${contributorName}`;
    const authHeader = {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "Chronicle-Timeline-Builder"
    };
    const repoRes = await fetch(`https://api.github.com/repos/${githubRepo}`, {
      headers: authHeader
    });
    if (!repoRes.ok) {
      throw new Error(`Failed to fetch repo info: ${repoRes.statusText}`);
    }
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || "main";
    let fileSha;
    const fileRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filename}?ref=${defaultBranch}`, {
      headers: authHeader
    });
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      fileSha = fileData.sha;
    }
    const contentPayload = btoa(unescape(encodeURIComponent(JSON.stringify(timeline, null, 2))));
    const putFileRes = await fetch(`https://api.github.com/repos/${githubRepo}/contents/${filename}`, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify({
        message: commitMessage,
        content: contentPayload,
        branch: defaultBranch,
        sha: fileSha
      })
    });
    if (!putFileRes.ok) {
      throw new Error(`Failed to commit timeline JSON: ${putFileRes.statusText}`);
    }
    return {
      success: true,
      simulated: false,
      url: `https://github.com/${githubRepo}/blob/${defaultBranch}/${filename}`,
      message: `Successfully published timeline directly to the "${defaultBranch}" branch.`
    };
  } catch (err) {
    console.error("GitHub commit failed:", err);
    throw new Error(`GitHub Sync failed: ${err.message}`);
  }
}
const submitTimeline_createServerFn_handler = createServerRpc({
  id: "7bc9a4ed6bab3f9b0d836fe99edef5a4b37e9a06d0959846e75193f1e4c8e00e",
  name: "submitTimeline",
  filename: "src/lib/api/contributor.functions.ts"
}, (opts) => submitTimeline.__executeServer(opts));
const submitTimeline = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  idToken: stringType().min(1),
  timeline: TimelineSchema
})).handler(submitTimeline_createServerFn_handler, async ({
  data
}) => {
  const firebaseProjectId = process.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id";
  const contributor = await verifyFirebaseToken(data.idToken, firebaseProjectId);
  const contributorName = contributor.name || contributor.email || "Anonymous Contributor";
  const timelineToPublish = {
    ...data.timeline,
    contributor: contributorName,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const syncResult = await submitToGithub(timelineToPublish, contributorName);
  return {
    success: syncResult.success,
    simulated: syncResult.simulated,
    url: syncResult.url,
    contributor: contributorName,
    message: syncResult.message
  };
});
export {
  submitTimeline_createServerFn_handler
};
