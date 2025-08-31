export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/<OWNER>/<REPO>",
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md", changelogTitle: "# Changelog" }],
    ["@semantic-release/npm", { npmPublish: false }],
    ["@semantic-release/git", { assets: ["CHANGELOG.md", "package.json"], message: "chore(release): ${nextRelease.version} [skip ci]" }],
    ["@semantic-release/github", { assets: [] }]
  ]
};